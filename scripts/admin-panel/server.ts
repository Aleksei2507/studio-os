import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile, writeFile, mkdir, rename, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(HERE, "..", "..");
export const PUBLIC_DIR = path.resolve(HERE, "public");

const ALLOWED_ARTIFACT_ROOTS = ["docs", "work-items", ".studio"];
const FEEDBACK_DIR = ".studio/feedback";
const FEEDBACK_RESOLVED_DIR = ".studio/feedback/resolved";

/**
 * Resolves a project-relative path requested by a client and guarantees it stays
 * inside one of ALLOWED_ARTIFACT_ROOTS under repoRoot. Throws on traversal or
 * any path that escapes the allowed roots.
 */
export function resolveArtifactPath(repoRoot: string, relPath: string): string {
  if (!relPath || relPath.includes("\0")) {
    throw new Error("invalid path");
  }
  const normalized = relPath.replace(/^\/+/, "");
  const resolved = path.resolve(repoRoot, normalized);
  const isAllowed = ALLOWED_ARTIFACT_ROOTS.some((root) => {
    const rootAbs = path.resolve(repoRoot, root);
    return resolved === rootAbs || resolved.startsWith(rootAbs + path.sep);
  });
  if (!isAllowed) {
    throw new Error("path escapes allowed roots");
  }
  return resolved;
}

function slugifyArtifactPath(relPath: string): string {
  return relPath
    .replace(/^\/+/, "")
    .replace(/\.md$/, "")
    .replace(/[\\/]/g, "-");
}

async function collectMarkdownFiles(repoRoot: string, root: string): Promise<string[]> {
  const rootAbs = path.resolve(repoRoot, root);
  if (!existsSync(rootAbs)) {
    return [];
  }
  const results: string[] = [];
  async function walk(dir: string): Promise<void> {
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
        results.push(path.relative(repoRoot, abs));
      }
    }
  }
  await walk(rootAbs);
  return results;
}

async function listOpenFeedback(repoRoot: string): Promise<string[]> {
  const dir = path.resolve(repoRoot, FEEDBACK_DIR);
  if (!existsSync(dir)) {
    return [];
  }
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function sendStatic(res: ServerResponse, filePath: string, contentType: string): Promise<void> {
  const content = await readFile(filePath);
  res.writeHead(200, { "content-type": contentType });
  res.end(content);
}

async function readRequestBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export function createAdminServer(repoRoot: string = REPO_ROOT) {
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
        const stateFile = path.resolve(repoRoot, ".studio/project-state.md");
        const contextFile = path.resolve(repoRoot, ".studio/active-context.md");
        const projectState = existsSync(stateFile) ? await readFile(stateFile, "utf8") : null;
        const activeContext = existsSync(contextFile) ? await readFile(contextFile, "utf8") : null;
        sendJson(res, 200, { projectState, activeContext });
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/artifacts") {
        const [docs, workItems, studio] = await Promise.all([
          collectMarkdownFiles(repoRoot, "docs"),
          collectMarkdownFiles(repoRoot, "work-items"),
          collectMarkdownFiles(repoRoot, ".studio"),
        ]);
        sendJson(res, 200, { docs, workItems, studio });
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/artifact") {
        const relPath = url.searchParams.get("path") ?? "";
        try {
          const resolved = resolveArtifactPath(repoRoot, relPath);
          const content = await readFile(resolved, "utf8");
          sendJson(res, 200, { path: relPath, content });
        } catch {
          sendJson(res, 400, { error: "invalid or disallowed path" });
        }
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/feedback") {
        const open = await listOpenFeedback(repoRoot);
        sendJson(res, 200, { open });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/feedback") {
        const body = JSON.parse(await readRequestBody(req)) as {
          artifactPath?: string;
          comment?: string;
        };
        if (!body.artifactPath || !body.comment || !body.comment.trim()) {
          sendJson(res, 400, { error: "artifactPath and comment are required" });
          return;
        }
        const dir = path.resolve(repoRoot, FEEDBACK_DIR);
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
        const body = JSON.parse(await readRequestBody(req)) as { file?: string };
        const fileName = body.file ?? "";
        if (!fileName || fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
          sendJson(res, 400, { error: "invalid file name" });
          return;
        }
        const from = path.resolve(repoRoot, FEEDBACK_DIR, fileName);
        const toDir = path.resolve(repoRoot, FEEDBACK_RESOLVED_DIR);
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
      sendJson(res, 500, { error: (error as Error).message });
    }
  });
}

async function main(): Promise<void> {
  const port = Number(process.env.ADMIN_PORT ?? 4317);
  if (!existsSync(REPO_ROOT)) {
    throw new Error(`repo root not found: ${REPO_ROOT}`);
  }
  const stats = await stat(REPO_ROOT);
  if (!stats.isDirectory()) {
    throw new Error(`repo root is not a directory: ${REPO_ROOT}`);
  }
  const server = createAdminServer(REPO_ROOT);
  server.listen(port, "127.0.0.1", () => {
    console.log(`Admin panel: http://127.0.0.1:${port}`);
  });
}

const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
