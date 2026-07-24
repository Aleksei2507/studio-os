import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import type {
  FixtureWorkspaceSpec,
  WorkspaceAssertions,
} from "../../scripts/runtime-testing/contracts.ts";
import {
  loadFixtureWorkspaceSpec,
  parseWorkspaceAssertions,
  runFixtureWorkspace,
  withFixtureWorkspace,
} from "../../scripts/runtime-testing/workspace-fixture.ts";

function createFixtureRoot(): {
  repositoryRoot: string;
  fixtureDirectory: string;
  assertionsFile: string;
} {
  const repositoryRoot = mkdtempSync(
    path.join(tmpdir(), "studio-os-workspace-test-"),
  );
  const fixtureDirectory = path.join(repositoryRoot, "fixtures", "input");
  const assertionsFile = path.join(
    repositoryRoot,
    "fixtures",
    "assertions.json",
  );

  mkdirSync(path.join(fixtureDirectory, "src"), { recursive: true });
  writeFileSync(
    path.join(fixtureDirectory, "src", "app.ts"),
    'export const status = "ready";\n',
  );

  return { repositoryRoot, fixtureDirectory, assertionsFile };
}

function writeAssertions(
  assertionsFile: string,
  assertions: WorkspaceAssertions,
): void {
  writeFileSync(assertionsFile, `${JSON.stringify(assertions, null, 2)}\n`);
}

describe("fixture-backed runtime workspace", () => {
  it("loads a repository-local fixture contract", () => {
    const { repositoryRoot, fixtureDirectory, assertionsFile } =
      createFixtureRoot();
    writeAssertions(assertionsFile, {
      version: 1,
      created: [".studio/project-state.md"],
      allowedChanges: [".studio/project-state.md"],
    });

    const spec = loadFixtureWorkspaceSpec(
      repositoryRoot,
      "fixtures/input",
      "fixtures/assertions.json",
    );

    assert.equal(spec.fixtureDirectory, realpathSync(fixtureDirectory));
    assert.equal(spec.assertionsFile, realpathSync(assertionsFile));
    assert.deepEqual(spec.assertions.created, [".studio/project-state.md"]);
  });

  it("rejects fixture paths that escape the repository", () => {
    const { repositoryRoot, assertionsFile } = createFixtureRoot();
    writeAssertions(assertionsFile, {
      version: 1,
      absent: ["docs/roadmap.md"],
    });

    assert.throws(
      () =>
        loadFixtureWorkspaceSpec(
          repositoryRoot,
          "../outside",
          "fixtures/assertions.json",
        ),
      /repository-relative|outside/i,
    );
  });

  it("rejects assertion manifests with no observable checks", () => {
    assert.throws(
      () => parseWorkspaceAssertions({ version: 1, contains: {} }),
      /observable check/,
    );
  });

  it("captures created files, content, unchanged source, and forbidden output", async () => {
    const { repositoryRoot, assertionsFile } = createFixtureRoot();
    const assertions: WorkspaceAssertions = {
      version: 1,
      created: [".studio/project-state.md"],
      unchanged: ["src/app.ts"],
      absent: ["docs/roadmap.md"],
      allowedChanges: [".studio/project-state.md"],
      contains: {
        ".studio/project-state.md": [
          "Mode: Brownfield",
          "Current Stage: Briefing",
        ],
      },
      notContains: {
        ".studio/project-state.md": ["/Users/", "file://"],
      },
    };
    writeAssertions(assertionsFile, assertions);
    const spec: FixtureWorkspaceSpec = loadFixtureWorkspaceSpec(
      repositoryRoot,
      "fixtures/input",
      "fixtures/assertions.json",
    );
    let disposableWorkspace = "";

    const result = await runFixtureWorkspace(spec, async (workspace) => {
      disposableWorkspace = workspace;
      mkdirSync(path.join(workspace, ".studio"), { recursive: true });
      writeFileSync(
        path.join(workspace, ".studio", "project-state.md"),
        "# Project State\n\nMode: Brownfield\nCurrent Stage: Briefing\n",
      );
      return "runtime response";
    });

    assert.equal(result.value, "runtime response");
    assert.equal(result.evaluation.status, "PASS");
    assert.deepEqual(result.evaluation.diff.created, [
      ".studio/project-state.md",
    ]);
    assert.deepEqual(result.evaluation.diff.modified, []);
    assert.equal(
      result.evaluation.assertions.every((assessment) => assessment.met),
      true,
    );
    assert.equal(existsSync(disposableWorkspace), false);
  });

  it("fails deterministic evaluation on an unexpected source mutation", async () => {
    const { repositoryRoot, assertionsFile } = createFixtureRoot();
    writeAssertions(assertionsFile, {
      version: 1,
      unchanged: ["src/app.ts"],
      allowedChanges: [],
    });
    const spec = loadFixtureWorkspaceSpec(
      repositoryRoot,
      "fixtures/input",
      "fixtures/assertions.json",
    );

    const result = await runFixtureWorkspace(spec, async (workspace) => {
      writeFileSync(
        path.join(workspace, "src", "app.ts"),
        'export const status = "changed";\n',
      );
      return "runtime response";
    });

    assert.equal(result.evaluation.status, "FAIL");
    assert.deepEqual(result.evaluation.diff.modified, ["src/app.ts"]);
    assert.match(
      result.evaluation.assertions
        .filter((assessment) => !assessment.met)
        .map((assessment) => assessment.evidence)
        .join("\n"),
      /src\/app\.ts/,
    );
  });

  it("keeps one disposable workspace and advances the baseline per checkpoint", async () => {
    const { fixtureDirectory } = createFixtureRoot();
    let disposableWorkspace = "";

    const result = await withFixtureWorkspace(
      fixtureDirectory,
      async ({ workspace, checkpoint }) => {
        disposableWorkspace = workspace;
        const first = checkpoint({
          version: 1,
          unchanged: ["src/app.ts"],
          allowedChanges: [],
        });

        writeFileSync(
          path.join(workspace, "src", "app.ts"),
          'export const status = "migrated";\n',
        );
        const second = checkpoint({
          version: 1,
          modified: ["src/app.ts"],
          allowedChanges: ["src/app.ts"],
        });

        return { first, second, workspace };
      },
    );

    assert.equal(result.first.status, "PASS");
    assert.deepEqual(result.first.diff.modified, []);
    assert.equal(result.second.status, "PASS");
    assert.deepEqual(result.second.diff.modified, ["src/app.ts"]);
    assert.equal(result.workspace, disposableWorkspace);
    assert.equal(existsSync(disposableWorkspace), false);
  });
});
