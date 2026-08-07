import { readFileSync, realpathSync } from "node:fs";
import path from "node:path";

import { resolveRepositoryPath } from "../runtime-testing/workspace-fixture.ts";
import {
  distributionSourceByAdapter,
  installedAdapterMatrixId,
  installedAdapterProjectModes,
  installedAdapters,
  requiredCheckIds,
  scenarioByProjectMode,
} from "./contracts.ts";
import type {
  InstalledAdapter,
  InstalledAdapterMatrix,
  InstalledAdapterMatrixCase,
  InstalledAdapterProjectMode,
} from "./contracts.ts";

export function loadInstalledAdapterMatrix(
  repositoryRoot: string,
  repositoryPath = "tests/installed-adapters/matrix.json",
): InstalledAdapterMatrix {
  const resolvedRepositoryRoot = realpathSync(repositoryRoot);
  const matrixRoot = resolveRepositoryPath(
    resolvedRepositoryRoot,
    "tests/installed-adapters",
    "Installed adapter matrix root",
  );
  const matrixFile = resolveRepositoryPath(
    resolvedRepositoryRoot,
    repositoryPath,
    "Installed adapter matrix",
  );
  const relativePath = path.relative(matrixRoot, matrixFile);

  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(
      "Installed adapter matrix path must remain inside tests/installed-adapters.",
    );
  }
  if (path.extname(matrixFile) !== ".json") {
    throw new Error("Installed adapter matrix path must reference a JSON file.");
  }

  let value: unknown;
  try {
    value = JSON.parse(readFileSync(matrixFile, "utf8"));
  } catch (error) {
    throw new Error(
      `Installed adapter matrix must contain valid JSON: ${errorMessage(error)}`,
    );
  }

  const matrix = parseInstalledAdapterMatrix(value);
  return {
    ...matrix,
    sourcePath: path
      .relative(resolvedRepositoryRoot, matrixFile)
      .split(path.sep)
      .join("/"),
  };
}

export function parseInstalledAdapterMatrix(
  value: unknown,
): Omit<InstalledAdapterMatrix, "sourcePath"> {
  if (!isRecord(value)) {
    throw new Error("Installed adapter matrix must be a JSON object.");
  }
  rejectUnknownKeys(value, ["version", "matrixId", "cases"], "Installed adapter matrix");

  if (value.version !== 1) {
    throw new Error("Installed adapter matrix version must be 1.");
  }
  const matrixId = identifier(value.matrixId, "Installed adapter matrix matrixId");
  if (matrixId !== installedAdapterMatrixId) {
    throw new Error(`Installed adapter matrix matrixId must be ${installedAdapterMatrixId}.`);
  }
  if (!Array.isArray(value.cases)) {
    throw new Error("Installed adapter matrix cases must be an array.");
  }

  const expectedCaseCount = installedAdapters.length * installedAdapterProjectModes.length;
  if (value.cases.length !== expectedCaseCount) {
    throw new Error(
      `Installed adapter matrix must contain exactly ${expectedCaseCount} cases.`,
    );
  }

  const seenIds = new Set<string>();
  const seenPairs = new Set<string>();
  const cases = value.cases.map((entry, index) => {
    const parsed = parseMatrixCase(entry, index);
    const expectedAdapter =
      installedAdapters[Math.floor(index / installedAdapterProjectModes.length)];
    const expectedProjectMode =
      installedAdapterProjectModes[index % installedAdapterProjectModes.length];
    const expectedId = `${expectedAdapter}-${expectedProjectMode}`;
    if (
      parsed.id !== expectedId ||
      parsed.adapter !== expectedAdapter ||
      parsed.projectMode !== expectedProjectMode
    ) {
      throw new Error(
        `Installed adapter matrix case ${index + 1} must be ${expectedId}.`,
      );
    }
    if (seenIds.has(parsed.id)) {
      throw new Error(`Installed adapter matrix has duplicate case id: ${parsed.id}`);
    }
    const pair = `${parsed.adapter}:${parsed.projectMode}`;
    if (seenPairs.has(pair)) {
      throw new Error(`Installed adapter matrix has duplicate adapter/mode pair: ${pair}`);
    }
    seenIds.add(parsed.id);
    seenPairs.add(pair);
    return parsed;
  });

  for (const adapter of installedAdapters) {
    for (const projectMode of installedAdapterProjectModes) {
      const pair = `${adapter}:${projectMode}`;
      if (!seenPairs.has(pair)) {
        throw new Error(`Installed adapter matrix is missing adapter/mode pair: ${pair}`);
      }
    }
  }

  return { version: 1, matrixId, cases };
}

function parseMatrixCase(value: unknown, index: number): InstalledAdapterMatrixCase {
  if (!isRecord(value)) {
    throw new Error(`Installed adapter matrix case ${index + 1} must be an object.`);
  }
  rejectUnknownKeys(
    value,
    [
      "id",
      "adapter",
      "projectMode",
      "distributionSource",
      "scenarioId",
      "requiredChecks",
    ],
    `Installed adapter matrix case ${index + 1}`,
  );

  const id = identifier(value.id, `Installed adapter matrix case ${index + 1} id`);
  const adapter = enumValue(
    value.adapter,
    installedAdapters,
    `Installed adapter matrix case ${id} adapter`,
  );
  const projectMode = enumValue(
    value.projectMode,
    installedAdapterProjectModes,
    `Installed adapter matrix case ${id} projectMode`,
  );
  const distributionSource = compactText(
    value.distributionSource,
    `Installed adapter matrix case ${id} distributionSource`,
  );
  const scenarioId = identifier(
    value.scenarioId,
    `Installed adapter matrix case ${id} scenarioId`,
  );
  const requiredChecks = identifierArray(
    value.requiredChecks,
    `Installed adapter matrix case ${id} requiredChecks`,
  );

  if (distributionSource !== distributionSourceByAdapter[adapter]) {
    throw new Error(
      `Installed adapter matrix case ${id} must use ${distributionSourceByAdapter[adapter]}.`,
    );
  }
  if (scenarioId !== scenarioByProjectMode[projectMode]) {
    throw new Error(
      `Installed adapter matrix case ${id} must use scenario ${scenarioByProjectMode[projectMode]}.`,
    );
  }

  const expectedChecks = requiredCheckIds(projectMode);
  if (
    requiredChecks.length !== expectedChecks.length ||
    requiredChecks.some((check, checkIndex) => check !== expectedChecks[checkIndex])
  ) {
    throw new Error(
      `Installed adapter matrix case ${id} must declare the canonical ${projectMode} checks in order.`,
    );
  }

  return {
    id,
    adapter: adapter as InstalledAdapter,
    projectMode: projectMode as InstalledAdapterProjectMode,
    distributionSource,
    scenarioId,
    requiredChecks,
  };
}

function identifier(value: unknown, label: string): string {
  if (
    typeof value !== "string" ||
    !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(value)
  ) {
    throw new Error(`${label} must be a lowercase identifier.`);
  }
  return value;
}

function identifierArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array.`);
  }
  const values = value.map((entry, index) => identifier(entry, `${label}[${index}]`));
  if (new Set(values).size !== values.length) {
    throw new Error(`${label} must not contain duplicates.`);
  }
  return values;
}

function compactText(value: unknown, label: string): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > 120 ||
    /[\r\n]/.test(value)
  ) {
    throw new Error(`${label} must be a compact non-empty string.`);
  }
  return value.trim();
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  label: string,
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(`${label} must be one of: ${allowed.join(", ")}.`);
  }
  return value as T;
}

function rejectUnknownKeys(
  value: Record<string, unknown>,
  allowed: string[],
  label: string,
): void {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw new Error(`${label} contains unknown fields: ${unknown.sort().join(", ")}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
