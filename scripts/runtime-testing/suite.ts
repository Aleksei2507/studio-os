import { readFileSync, realpathSync } from "node:fs";
import path from "node:path";

import { resolveRepositoryPath } from "./workspace-fixture.ts";

export interface RuntimeSuiteScenario {
  id: string;
  riskResponsibility: string;
}

export interface RuntimeSuite {
  version: 1;
  suiteId: string;
  sourcePath: string;
  scenarios: RuntimeSuiteScenario[];
}

export interface RuntimeSuiteIdentity {
  suiteId: string;
  version: number;
  sourcePath: string;
  scenarioCount: number;
}

export function loadRuntimeSuite(
  repositoryRoot: string,
  repositoryPath: string,
): RuntimeSuite {
  const resolvedRepositoryRoot = realpathSync(repositoryRoot);
  const runtimeRoot = resolveRepositoryPath(
    resolvedRepositoryRoot,
    "tests/runtime",
    "Runtime tests",
  );
  const suiteFile = resolveRepositoryPath(
    resolvedRepositoryRoot,
    repositoryPath,
    "Runtime suite",
  );
  const runtimeRelativePath = path.relative(runtimeRoot, suiteFile);

  if (
    runtimeRelativePath === "" ||
    runtimeRelativePath === ".." ||
    runtimeRelativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(runtimeRelativePath)
  ) {
    throw new Error("Runtime suite path must remain inside tests/runtime.");
  }
  if (path.extname(suiteFile) !== ".json") {
    throw new Error("Runtime suite path must reference a JSON file.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(suiteFile, "utf8"));
  } catch (error) {
    throw new Error(`Runtime suite must contain valid JSON: ${errorMessage(error)}`);
  }

  const suite = parseRuntimeSuite(parsed);
  return {
    ...suite,
    sourcePath: path
      .relative(resolvedRepositoryRoot, suiteFile)
      .split(path.sep)
      .join("/"),
  };
}

export function selectRuntimeSuiteMembers<T extends { id: string }>(
  members: T[],
  suite: RuntimeSuite,
): T[] {
  const requiredIds = new Set(suite.scenarios.map((scenario) => scenario.id));
  const membersById = new Map<string, T>();
  const duplicateIds = new Set<string>();

  for (const member of members) {
    if (!requiredIds.has(member.id)) {
      continue;
    }
    if (membersById.has(member.id)) {
      duplicateIds.add(member.id);
      continue;
    }
    membersById.set(member.id, member);
  }

  if (duplicateIds.size > 0) {
    throw new Error(
      `Runtime suite selection found duplicate scenario ids: ${[...duplicateIds].sort().join(", ")}`,
    );
  }

  const missingIds = suite.scenarios
    .map((scenario) => scenario.id)
    .filter((id) => !membersById.has(id));
  if (missingIds.length > 0) {
    throw new Error(
      `Runtime suite selection is missing scenario ids: ${missingIds.join(", ")}`,
    );
  }

  return suite.scenarios.map(
    (scenario) => membersById.get(scenario.id) as T,
  );
}

export function runtimeSuiteIdentity(
  suite: RuntimeSuite,
): RuntimeSuiteIdentity {
  return {
    suiteId: suite.suiteId,
    version: suite.version,
    sourcePath: suite.sourcePath,
    scenarioCount: suite.scenarios.length,
  };
}

function parseRuntimeSuite(
  value: unknown,
): Omit<RuntimeSuite, "sourcePath"> {
  if (!isRecord(value)) {
    throw new Error("Runtime suite must be a JSON object.");
  }
  rejectUnknownKeys(value, ["version", "suiteId", "scenarios"], "Runtime suite");

  if (value.version !== 1) {
    throw new Error("Runtime suite version must be 1.");
  }
  if (
    typeof value.suiteId !== "string" ||
    !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(value.suiteId)
  ) {
    throw new Error(
      "Runtime suite suiteId must be a non-empty lowercase identifier.",
    );
  }
  if (!Array.isArray(value.scenarios) || value.scenarios.length === 0) {
    throw new Error("Runtime suite scenarios must be a non-empty array.");
  }

  const seenIds = new Set<string>();
  const scenarios = value.scenarios.map((scenario, index) => {
    if (!isRecord(scenario)) {
      throw new Error(`Runtime suite scenario ${index + 1} must be an object.`);
    }
    rejectUnknownKeys(
      scenario,
      ["id", "riskResponsibility"],
      `Runtime suite scenario ${index + 1}`,
    );
    if (
      typeof scenario.id !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scenario.id)
    ) {
      throw new Error(
        `Runtime suite scenario ${index + 1} id must be kebab-case.`,
      );
    }
    if (seenIds.has(scenario.id)) {
      throw new Error(`Runtime suite has duplicate scenario id: ${scenario.id}`);
    }
    if (
      typeof scenario.riskResponsibility !== "string" ||
      !scenario.riskResponsibility.trim()
    ) {
      throw new Error(
        `Runtime suite scenario ${scenario.id} riskResponsibility must be a non-empty string.`,
      );
    }

    seenIds.add(scenario.id);
    return {
      id: scenario.id,
      riskResponsibility: scenario.riskResponsibility.trim(),
    };
  });

  return {
    version: 1,
    suiteId: value.suiteId,
    scenarios,
  };
}

function rejectUnknownKeys(
  value: Record<string, unknown>,
  allowedKeys: string[],
  label: string,
): void {
  const unknownKeys = Object.keys(value).filter(
    (key) => !allowedKeys.includes(key),
  );
  if (unknownKeys.length > 0) {
    throw new Error(`${label} has unknown fields: ${unknownKeys.join(", ")}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
