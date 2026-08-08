import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, after } from "node:test";
import type { Server } from "node:http";

import { createAdminServer, resolveArtifactPath, REPO_ROOT, PUBLIC_DIR } from "../../scripts/admin-panel/server.ts";

const repositoryRoot = process.cwd();

describe("Studio OS admin panel", () => {
  it("resolves REPO_ROOT and PUBLIC_DIR from the script location, not cwd", () => {
    assert.equal(path.resolve(REPO_ROOT), path.resolve(repositoryRoot));
    assert.ok(PUBLIC_DIR.endsWith(path.join("admin-panel", "public")));
  });

  it("ships the required static files", () => {
    for (const file of ["index.html", "styles.css", "script.js"]) {
      assert.ok(existsSync(path.join(PUBLIC_DIR, file)), file);
    }
  });

  it("allows paths inside docs, work-items, and .studio", () => {
    assert.doesNotThrow(() => resolveArtifactPath(repositoryRoot, "docs/architecture.md"));
    assert.doesNotThrow(() =>
      resolveArtifactPath(repositoryRoot, "work-items/2026-08-07-admin-panel-task-tracing/brief.md"),
    );
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

  it("serves real project state and accepts a feedback comment with no network egress", async () => {
    const server: Server = createAdminServer(repositoryRoot);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (address === null || typeof address === "string") {
      throw new Error("expected a bound TCP address");
    }
    const base = `http://127.0.0.1:${address.port}`;

    try {
      const stateRes = await fetch(`${base}/api/state`);
      assert.equal(stateRes.status, 200);
      const state = (await stateRes.json()) as { projectState: string | null };
      assert.ok(state.projectState);
      assert.match(state.projectState, /^Mode:/m);

      const badPathRes = await fetch(`${base}/api/artifact?path=${encodeURIComponent("../../etc/passwd")}`);
      assert.equal(badPathRes.status, 400);

      const feedbackRes = await fetch(`${base}/api/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ artifactPath: "docs/architecture.md", comment: "structure-test comment" }),
      });
      assert.equal(feedbackRes.status, 201);
      const created = (await feedbackRes.json()) as { file: string };
      assert.match(created.file, /^docs-architecture-.*\.md$/);

      const resolveRes = await fetch(`${base}/api/feedback/resolve`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ file: created.file }),
      });
      assert.equal(resolveRes.status, 200);
    } finally {
      await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    }
  });

  after(async () => {
    const { rm } = await import("node:fs/promises");
    const resolvedDir = path.join(repositoryRoot, ".studio/feedback/resolved");
    if (existsSync(resolvedDir)) {
      await rm(resolvedDir, { recursive: true, force: true });
    }
  });
});
