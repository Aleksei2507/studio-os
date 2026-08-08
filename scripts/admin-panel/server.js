import { createServer } from "node:http";
import { readFile, writeFile, mkdir, rename, readdir, stat } from "node:fs/promises";
import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Plain Node.js, zero dependencies (not even a TypeScript loader): this file
// must run with bare `node` inside an installed plugin copy, which ships no
// package.json, no node_modules, and no tsx. Keep it that way.

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Studio OS Root: where this tool's own code (and its static assets) lives.
export const STUDIO_OS_ROOT = path.resolve(HERE, "..", "..");
export const PUBLIC_DIR = path.resolve(HERE, "public");

const ALLOWED_ARTIFACT_ROOTS = ["docs", "work-items", ".studio"];
const FEEDBACK_DIR = ".studio/feedback";
const FEEDBACK_RESOLVED_DIR = ".studio/feedback/resolved";

/**
 * Resolves a project-relative path requested by a client and guarantees it stays
 * inside one of ALLOWED_ARTIFACT_ROOTS under workspaceRoot. Throws on traversal
 * or any path that escapes the allowed roots.
 */
export function resolveArtifactPath(workspaceRoot, relPath) {
  if (!relPath || relPath.includes("\0")) {
    throw new Error("invalid path");
  }
  const normalized = relPath.replace(/^\/+/, "");
  const resolved = path.resolve(workspaceRoot, normalized);
  const isAllowed = ALLOWED_ARTIFACT_ROOTS.some((root) => {
    const rootAbs = path.resolve(workspaceRoot, root);
    return resolved === rootAbs || resolved.startsWith(rootAbs + path.sep);
  });
  if (!isAllowed) {
    throw new Error("path escapes allowed roots");
  }
  return resolved;
}

function slugifyArtifactPath(relPath) {
  return relPath
    .replace(/^\/+/, "")
    .replace(/\.md$/, "")
    .replace(/[\\/]/g, "-");
}

async function collectMarkdownFiles(workspaceRoot, root) {
  const rootAbs = path.resolve(workspaceRoot, root);
  if (!existsSync(rootAbs)) {
    return [];
  }
  const results = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") && root !== ".studio") {
        continue;
      }
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (root === ".studio" && entry.name === "feedback") {
          continue;
        }
        await walk(abs);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push(path.relative(workspaceRoot, abs));
      }
    }
  }
  await walk(rootAbs);
  return results;
}

async function listOpenFeedback(workspaceRoot) {
  const dir = path.resolve(workspaceRoot, FEEDBACK_DIR);
  if (!existsSync(dir)) {
    return [];
  }
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function sendStatic(res, filePath, contentType) {
  const content = await readFile(filePath);
  res.writeHead(200, { "content-type": contentType });
  res.end(content);
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * workspaceRoot is the project whose .studio/docs/work-items this instance
 * serves. It is deliberately independent from STUDIO_OS_ROOT/PUBLIC_DIR: when
 * Studio OS runs as an installed plugin, the tool's own code lives under the
 * plugin cache while the artifacts it must render live in the Target
 * Workspace the user is actually working in. Self-hosting (this repository)
 * is the special case where the two happen to be the same path.
 */
export function createAdminServer(workspaceRoot) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");

      if (req.method === "GET" && url.pathname === "/") {
        await sendStatic(res, path.join(PUBLIC_DIR, "index.html"), "text/html; charset=utf-8");
        return;
      }
      if (req.method === "GET" && url.pathname === "/styles.css") {
        await sendStatic(res, path.join(PUBLIC_DIR, "styles.css"), "text/css; charset=utf-8");
        return;
      }
      if (req.method === "GET" && url.pathname === "/script.js") {
        await sendStatic(res, path.join(PUBLIC_DIR, "script.js"), "application/javascript; charset=utf-8");
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/state") {
        const stateFile = path.resolve(workspaceRoot, ".studio/project-state.md");
        const contextFile = path.resolve(workspaceRoot, ".studio/active-context.md");
        const projectState = existsSync(stateFile) ? await readFile(stateFile, "utf8") : null;
        const activeContext = existsSync(contextFile) ? await readFile(contextFile, "utf8") : null;
        sendJson(res, 200, { workspaceRoot, projectState, activeContext });
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/artifacts") {
        const [docs, workItems, studio] = await Promise.all([
          collectMarkdownFiles(workspaceRoot, "docs"),
          collectMarkdownFiles(workspaceRoot, "work-items"),
          collectMarkdownFiles(workspaceRoot, ".studio"),
        ]);
        sendJson(res, 200, { docs, workItems, studio });
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/artifact") {
        const relPath = url.searchParams.get("path") ?? "";
        try {
          const resolved = resolveArtifactPath(workspaceRoot, relPath);
          const content = await readFile(resolved, "utf8");
          sendJson(res, 200, { path: relPath, content });
        } catch {
          sendJson(res, 400, { error: "invalid or disallowed path" });
        }
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/feedback") {
        const open = await listOpenFeedback(workspaceRoot);
        sendJson(res, 200, { open });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/feedback") {
        const body = JSON.parse(await readRequestBody(req));
        if (!body.artifactPath || !body.comment || !body.comment.trim()) {
          sendJson(res, 400, { error: "artifactPath and comment are required" });
          return;
        }
        const dir = path.resolve(workspaceRoot, FEEDBACK_DIR);
        await mkdir(dir, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${slugifyArtifactPath(body.artifactPath)}-${timestamp}.md`;
        const filePath = path.join(dir, fileName);
        const contents = `# Feedback: ${body.artifactPath}\n\nDate: ${new Date().toISOString()}\n\n${body.comment.trim()}\n`;
        await writeFile(filePath, contents, "utf8");
        sendJson(res, 201, { file: fileName });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/feedback/resolve") {
        const body = JSON.parse(await readRequestBody(req));
        const fileName = body.file ?? "";
        if (!fileName || fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
          sendJson(res, 400, { error: "invalid file name" });
          return;
        }
        const from = path.resolve(workspaceRoot, FEEDBACK_DIR, fileName);
        const toDir = path.resolve(workspaceRoot, FEEDBACK_RESOLVED_DIR);
        if (!existsSync(from)) {
          sendJson(res, 404, { error: "feedback file not found" });
          return;
        }
        await mkdir(toDir, { recursive: true });
        await rename(from, path.join(toDir, fileName));
        sendJson(res, 200, { resolved: fileName });
        return;
      }

      sendJson(res, 404, { error: "not found" });
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
  });
}

function parseArgs(argv) {
  let workspace = process.cwd();
  let port = Number(process.env.ADMIN_PORT ?? 4317);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--workspace") {
      workspace = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--port") {
      port = Number(argv[index + 1]);
      index += 1;
      continue;
    }
  }
  return { workspace: path.resolve(workspace), port };
}

async function main() {
  const { workspace, port } = parseArgs(process.argv.slice(2));
  if (!existsSync(workspace)) {
    throw new Error(`workspace not found: ${workspace}`);
  }
  const stats = await stat(workspace);
  if (!stats.isDirectory()) {
    throw new Error(`workspace is not a directory: ${workspace}`);
  }
  const server = createAdminServer(workspace);
  server.listen(port, "127.0.0.1", () => {
    console.log(`Admin panel: http://127.0.0.1:${port}`);
    console.log(`Workspace:   ${workspace}`);
  });
}

function isMainModule() {
  // Compare realpaths, not raw argv/import.meta.url strings: a symlinked
  // path (e.g. macOS /tmp -> /private/tmp, or a marketplace/plugin cache
  // symlink) makes a naive string comparison fail silently, and main()
  // never runs. See docs/adr/0003-ship-admin-panel-and-commands-in-distribution.md.
  if (process.argv[1] === undefined) {
    return false;
  }
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
}

if (isMainModule()) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
