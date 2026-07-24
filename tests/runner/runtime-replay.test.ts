import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { loadRuntimeReplaySpec } from "../../scripts/runtime-testing/replay.ts";

function createReplayRoot(): string {
  const repositoryRoot = mkdtempSync(
    path.join(tmpdir(), "studio-os-replay-test-"),
  );
  mkdirSync(path.join(repositoryRoot, "fixtures"), { recursive: true });
  writeFileSync(
    path.join(repositoryRoot, "fixtures", "after-confirmation.json"),
    JSON.stringify({
      version: 1,
      modified: [".studio/project-state.md"],
      allowedChanges: [".studio/project-state.md"],
    }),
  );
  return repositoryRoot;
}

function writeReplay(repositoryRoot: string, source: unknown): void {
  writeFileSync(
    path.join(repositoryRoot, "fixtures", "replay.json"),
    `${JSON.stringify(source, null, 2)}\n`,
  );
}

describe("runtime replay contract", () => {
  it("loads bounded follow-up turns and their workspace assertions", () => {
    const repositoryRoot = createReplayRoot();
    writeReplay(repositoryRoot, {
      version: 1,
      turns: [
        {
          id: "confirm-routing-migration",
          prompt: "Apply the proposed routing fields.",
          expect: ["Confirms the migration."],
          workspace_assertions: "fixtures/after-confirmation.json",
        },
      ],
    });

    const replay = loadRuntimeReplaySpec(
      repositoryRoot,
      "fixtures/replay.json",
      true,
    );

    assert.equal(replay.turns.length, 1);
    assert.equal(replay.turns[0].id, "confirm-routing-migration");
    assert.deepEqual(replay.turns[0].workspace?.assertions.modified, [
      ".studio/project-state.md",
    ]);
  });

  it("rejects replay paths outside the repository", () => {
    const repositoryRoot = createReplayRoot();

    assert.throws(
      () =>
        loadRuntimeReplaySpec(repositoryRoot, "../replay.json", false),
      /repository-relative|outside/i,
    );
  });

  it("rejects duplicate turn ids and replays longer than five follow-ups", () => {
    const repositoryRoot = createReplayRoot();
    writeReplay(repositoryRoot, {
      version: 1,
      turns: [
        { id: "confirm", prompt: "First", expect: ["First result"] },
        { id: "confirm", prompt: "Second", expect: ["Second result"] },
      ],
    });
    assert.throws(
      () =>
        loadRuntimeReplaySpec(
          repositoryRoot,
          "fixtures/replay.json",
          false,
        ),
      /duplicate/i,
    );

    writeReplay(repositoryRoot, {
      version: 1,
      turns: Array.from({ length: 6 }, (_, index) => ({
        id: `turn-${index + 1}`,
        prompt: `Prompt ${index + 1}`,
        expect: [`Result ${index + 1}`],
      })),
    });
    assert.throws(
      () =>
        loadRuntimeReplaySpec(
          repositoryRoot,
          "fixtures/replay.json",
          false,
        ),
      /at most 5/i,
    );
  });

  it("requires a checkpoint manifest for every fixture-backed follow-up", () => {
    const repositoryRoot = createReplayRoot();
    writeReplay(repositoryRoot, {
      version: 1,
      turns: [
        {
          id: "confirm",
          prompt: "Apply the migration.",
          expect: ["Confirms the migration."],
        },
      ],
    });

    assert.throws(
      () =>
        loadRuntimeReplaySpec(
          repositoryRoot,
          "fixtures/replay.json",
          true,
        ),
      /workspace_assertions.*required/i,
    );
  });
});
