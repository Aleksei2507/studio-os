import assert from "node:assert/strict";
import { existsSync, realpathSync, symlinkSync, copyFileSync, mkdirSync } from "node:fs";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { describe, it, after } from "node:test";
import type { Server } from "node:http";

import {
  createAdminServer,
  resolveArtifactPath,
  buildTraceability,
  STUDIO_OS_ROOT,
  PUBLIC_DIR,
} from "../../scripts/admin-panel/server.js";

const repositoryRoot = process.cwd();
const tempDirs: string[] = [];

async function makeWorkspace(projectStateContents: string): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "studio-os-admin-test-"));
  tempDirs.push(dir);
  await mkdir(path.join(dir, ".studio"), { recursive: true });
  await writeFile(path.join(dir, ".studio", "project-state.md"), projectStateContents, "utf8");
  return dir;
}

async function makeWorkItemWorkspace(): Promise<string> {
  const dir = await makeWorkspace(
    "Mode: Brownfield\nWorkflow: work-item-feature\nActive Work Item: work-items/2026-01-01-fixture\n",
  );
  const workItemDir = path.join(dir, "work-items", "2026-01-01-fixture");
  await mkdir(workItemDir, { recursive: true });
  await writeFile(
    path.join(workItemDir, "brief.md"),
    "## Acceptance Criteria\n\n- AC1: First criterion.\n- AC2: Second criterion, uncovered.\n",
    "utf8",
  );
  await writeFile(
    path.join(workItemDir, "tasks.md"),
    [
      "## Task List",
      "",
      "### T1",
      "",
      "- Title: Do the first thing",
      "- Satisfies: AC1",
      "- Estimate: 1h",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    path.join(workItemDir, "validation-report.md"),
    "## Acceptance Criteria Verified\n\nAC1 — confirmed manually.\n",
    "utf8",
  );
  return dir;
}

async function withServer<T>(workspaceRoot: string, fn: (base: string) => Promise<T>): Promise<T> {
  const server: Server = createAdminServer(workspaceRoot);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("expected a bound TCP address");
  }
  try {
    return await fn(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

describe("Studio OS admin panel", () => {
  it("resolves STUDIO_OS_ROOT and PUBLIC_DIR from the script location, not cwd or workspace", () => {
    assert.equal(path.resolve(STUDIO_OS_ROOT), path.resolve(repositoryRoot));
    assert.ok(PUBLIC_DIR.endsWith(path.join("admin-panel", "public")));
  });

  it("ships the required static files as plain JS (no build step, no tsx)", () => {
    for (const file of ["index.html", "styles.css", "script.js"]) {
      assert.ok(existsSync(path.join(PUBLIC_DIR, file)), file);
    }
    assert.ok(existsSync(path.join(STUDIO_OS_ROOT, "scripts/admin-panel/server.js")));
    assert.equal(existsSync(path.join(STUDIO_OS_ROOT, "scripts/admin-panel/server.ts")), false);
  });

  it("allows paths inside docs, work-items, and .studio under an arbitrary workspace root", () => {
    assert.doesNotThrow(() => resolveArtifactPath(repositoryRoot, "docs/architecture.md"));
    assert.doesNotThrow(() => resolveArtifactPath(repositoryRoot, ".studio/project-state.md"));
  });

  it("rejects traversal and paths outside the allowed roots", () => {
    for (const attempt of [
      "../../etc/passwd",
      "docs/../../etc/passwd",
      "/etc/passwd",
      "package.json",
      "node_modules/.bin/tsx",
      "",
    ]) {
      assert.throws(() => resolveArtifactPath(repositoryRoot, attempt), attempt);
    }
  });

  it("serves this repository's real project state when workspaceRoot is the repository root", async () => {
    await withServer(repositoryRoot, async (base) => {
      const res = await fetch(`${base}/api/state`);
      assert.equal(res.status, 200);
      const body = (await res.json()) as { projectState: string | null };
      assert.ok(body.projectState);
      assert.match(body.projectState, /^Mode:/m);
    });
  });

  it("serves a different workspace's artifacts, decoupled from where the script itself lives", async () => {
    const workspace = await makeWorkspace("Mode: Greenfield\nCurrent Stage: Interview\n");
    await withServer(workspace, async (base) => {
      const res = await fetch(`${base}/api/state`);
      assert.equal(res.status, 200);
      const body = (await res.json()) as { workspaceRoot: string; projectState: string | null };
      assert.equal(path.resolve(body.workspaceRoot), path.resolve(workspace));
      assert.equal(body.projectState, "Mode: Greenfield\nCurrent Stage: Interview\n");
      assert.notEqual(body.projectState, undefined);
    });
  });

  it("rejects traversal for an arbitrary workspace root too", async () => {
    const workspace = await makeWorkspace("Mode: Greenfield\n");
    await withServer(workspace, async (base) => {
      const res = await fetch(`${base}/api/artifact?path=${encodeURIComponent("../../../../etc/passwd")}`);
      assert.equal(res.status, 400);
    });
  });

  it("accepts a feedback comment and resolves it, scoped to the given workspace only", async () => {
    const workspace = await makeWorkspace("Mode: Greenfield\n");
    await withServer(workspace, async (base) => {
      const createRes = await fetch(`${base}/api/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ artifactPath: ".studio/project-state.md", comment: "test comment" }),
      });
      assert.equal(createRes.status, 201);
      const created = (await createRes.json()) as { file: string };
      assert.ok(existsSync(path.join(workspace, ".studio/feedback", created.file)));

      const resolveRes = await fetch(`${base}/api/feedback/resolve`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ file: created.file }),
      });
      assert.equal(resolveRes.status, 200);
      assert.ok(existsSync(path.join(workspace, ".studio/feedback/resolved", created.file)));
      assert.equal(existsSync(path.join(workspace, ".studio/feedback", created.file)), false);
    });
    assert.equal(existsSync(path.join(repositoryRoot, ".studio/feedback")), false);
  });

  it("reports no active work item when project-state.md has none", async () => {
    const workspace = await makeWorkspace("Mode: Greenfield\n");
    const result = await buildTraceability(workspace);
    assert.equal(result.workItemId, null);
    assert.deepEqual(result.acceptanceCriteria, []);
  });

  it("builds AC coverage from brief.md, tasks.md, and validation-report.md for the active Work Item", async () => {
    const workspace = await makeWorkItemWorkspace();
    const result = await buildTraceability(workspace);
    assert.equal(result.workItemId, "work-items/2026-01-01-fixture");
    assert.equal(result.hasTasksFile, true);
    assert.equal(result.tasks.length, 1);
    assert.equal(result.tasks[0].id, "T1");

    const ac1 = result.acceptanceCriteria.find((ac: { id: string }) => ac.id === "AC1");
    assert.ok(ac1);
    assert.deepEqual(ac1.taskIds, ["T1"]);
    assert.equal(ac1.verified, true);

    const ac2 = result.acceptanceCriteria.find((ac: { id: string }) => ac.id === "AC2");
    assert.ok(ac2);
    assert.deepEqual(ac2.taskIds, []);
    assert.equal(ac2.verified, false);
  });

  it("serves /api/traceability over HTTP for the active Work Item", async () => {
    const workspace = await makeWorkItemWorkspace();
    await withServer(workspace, async (base) => {
      const res = await fetch(`${base}/api/traceability`);
      assert.equal(res.status, 200);
      const body = (await res.json()) as { workItemId: string; acceptanceCriteria: Array<{ id: string }> };
      assert.equal(body.workItemId, "work-items/2026-01-01-fixture");
      assert.equal(body.acceptanceCriteria.length, 2);
    });
  });

  it("starts as a real subprocess when reached through a symlinked ancestor directory", async () => {
    // Regression coverage: `node <installed-copy>/server.js` failed silently
    // (isMainModule() false, main() never called, exit 0, no output) whenever
    // the entry path crossed a symlink -- e.g. macOS's /tmp -> /private/tmp.
    // An installed plugin cache can sit behind an equivalent symlink, so this
    // must be a real child process through a real symlink, not an in-process
    // import.
    const realParent = await mkdtemp(path.join(realpathSync(os.tmpdir()), "admin-panel-real-"));
    tempDirs.push(realParent);
    const linkParent = `${realParent}-alias`;
    tempDirs.push(linkParent);
    mkdirSync(path.join(realParent, "nested"));
    copyFileSync(
      path.join(STUDIO_OS_ROOT, "scripts/admin-panel/server.js"),
      path.join(realParent, "nested", "server.js"),
    );
    symlinkSync(realParent, linkParent, "dir");
    assert.notEqual(linkParent, realpathSync(linkParent), "test setup requires an actual symlink hop");

    const entryThroughSymlink = path.join(linkParent, "nested", "server.js");
    const workspace = await makeWorkspace("Mode: Greenfield\nCurrent Stage: Interview\n");
    const port = 20000 + Math.floor(Math.random() * 10000);

    const child = spawn(process.execPath, [entryThroughSymlink, "--port", String(port), "--workspace", workspace], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    try {
      await assert.doesNotReject(async () => {
        const deadline = Date.now() + 5000;
        while (!stdout.includes("Admin panel:")) {
          if (Date.now() > deadline) {
            throw new Error(`server did not start through symlinked entry path; stderr: ${stderr || "(empty)"}`);
          }
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      });

      const res = await fetch(`http://127.0.0.1:${port}/api/state`);
      assert.equal(res.status, 200);
      const body = (await res.json()) as { projectState: string | null };
      assert.equal(body.projectState, "Mode: Greenfield\nCurrent Stage: Interview\n");
    } finally {
      child.kill();
    }
  });

  after(async () => {
    for (const dir of tempDirs) {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
