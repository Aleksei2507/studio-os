import {
  readFileSync,
  realpathSync,
  statSync,
} from "node:fs";

import type {
  RuntimeFollowUpTurn,
  RuntimeReplaySpec,
} from "./contracts.ts";
import {
  loadWorkspaceAssertionSpec,
  resolveRepositoryPath,
} from "./workspace-fixture.ts";

const MAX_FOLLOW_UP_TURNS = 5;
const REPLAY_KEYS = new Set(["version", "turns"]);
const TURN_KEYS = new Set([
  "id",
  "prompt",
  "expect",
  "workspace_assertions",
]);

export function loadRuntimeReplaySpec(
  repositoryRoot: string,
  replayPath: string,
  fixtureBacked: boolean,
): RuntimeReplaySpec {
  const root = realpathSync(repositoryRoot);
  const replayFile = resolveRepositoryPath(root, replayPath, "Replay");
  if (!statSync(replayFile).isFile()) {
    throw new Error(`Replay path is not a file: ${replayPath}`);
  }

  let source: unknown;
  try {
    source = JSON.parse(readFileSync(replayFile, "utf8"));
  } catch (error) {
    throw new Error(`Replay must be valid JSON: ${errorMessage(error)}`);
  }

  if (!isRecord(source)) {
    throw new Error("Replay must be a JSON object.");
  }
  rejectUnknownKeys(source, REPLAY_KEYS, "replay");

  if (source.version !== 1) {
    throw new Error("Replay version must be 1.");
  }
  if (!Array.isArray(source.turns) || source.turns.length === 0) {
    throw new Error("Replay turns must be a non-empty array.");
  }
  if (source.turns.length > MAX_FOLLOW_UP_TURNS) {
    throw new Error(
      `Replay may contain at most ${MAX_FOLLOW_UP_TURNS} follow-up turns.`,
    );
  }

  const turns = source.turns.map((turn, index) =>
    parseTurn(root, turn, index, fixtureBacked),
  );
  const ids = turns.map((turn) => turn.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Replay contains a duplicate turn id.");
  }

  return { replayFile, turns };
}

function parseTurn(
  repositoryRoot: string,
  source: unknown,
  index: number,
  fixtureBacked: boolean,
): RuntimeFollowUpTurn {
  const label = `Replay turn ${index + 1}`;
  if (!isRecord(source)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  rejectUnknownKeys(source, TURN_KEYS, label);

  if (
    typeof source.id !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id)
  ) {
    throw new Error(`${label} id must be a non-empty kebab-case string.`);
  }
  if (source.id === "initial") {
    throw new Error(`${label} id "initial" is reserved.`);
  }
  if (typeof source.prompt !== "string" || !source.prompt.trim()) {
    throw new Error(`${label} prompt must be a non-empty string.`);
  }
  if (
    !Array.isArray(source.expect) ||
    source.expect.length === 0 ||
    source.expect.some(
      (expectation) =>
        typeof expectation !== "string" || !expectation.trim(),
    )
  ) {
    throw new Error(
      `${label} expect must be a non-empty array of non-empty strings.`,
    );
  }

  const assertionsPath =
    typeof source.workspace_assertions === "string" &&
    source.workspace_assertions.trim()
      ? source.workspace_assertions.trim()
      : undefined;

  if (fixtureBacked && !assertionsPath) {
    throw new Error(
      `${label} workspace_assertions is required for a fixture-backed replay.`,
    );
  }
  if (!fixtureBacked && "workspace_assertions" in source) {
    throw new Error(
      `${label} workspace_assertions requires a fixture-backed scenario.`,
    );
  }

  return {
    id: source.id,
    prompt: source.prompt.trim(),
    expect: (source.expect as string[]).map((expectation) =>
      expectation.trim(),
    ),
    workspace: assertionsPath
      ? loadWorkspaceAssertionSpec(repositoryRoot, assertionsPath)
      : undefined,
  };
}

function rejectUnknownKeys(
  source: Record<string, unknown>,
  allowed: Set<string>,
  label: string,
): void {
  const unknown = Object.keys(source).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown ${label} field(s): ${unknown.join(", ")}`,
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
