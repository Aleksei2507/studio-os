import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { resolveRepositoryPath } from "../runtime-testing/workspace-fixture.ts";
import {
  installedAdapterFailureOwners,
  installedAdapterOutcomes,
} from "./contracts.ts";
import type {
  InstalledAdapterCheckEvidence,
  InstalledAdapterEvidence,
  InstalledAdapterEvidenceRecord,
  InstalledAdapterEvidenceSummary,
  InstalledAdapterFailureOwner,
  InstalledAdapterMatrix,
  InstalledAdapterMatrixCase,
  InstalledAdapterOutcome,
} from "./contracts.ts";

const forbiddenPersistentText = [
  /\/Users\//i,
  /\/home\/[^/\s]+/i,
  /\/private\//i,
  /\/(?:tmp|var\/folders)\//i,
  /Downloads[\\/]/i,
  /file:\/\//i,
  /codex-remote-attachments/i,
  /[A-Za-z]:[\\/]/,
  /\.\.[\\/]/,
];

const secretText = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bBearer\s+[A-Za-z0-9._~+/-]{16,}/i,
  /\b(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{16,}\b/,
];

export function loadInstalledAdapterEvidence(
  repositoryRoot: string,
  repositoryPath: string,
  matrix: InstalledAdapterMatrix,
): InstalledAdapterEvidence {
  const resolvedRepositoryRoot = realpathSync(repositoryRoot);
  const evidenceRoot = resolveRepositoryPath(
    resolvedRepositoryRoot,
    "test-results/installed-adapters",
    "Installed adapter evidence root",
  );
  const evidenceFile = resolveRepositoryPath(
    resolvedRepositoryRoot,
    repositoryPath,
    "Installed adapter evidence",
  );
  const relativePath = path.relative(evidenceRoot, evidenceFile);

  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(
      "Installed adapter evidence path must remain inside test-results/installed-adapters.",
    );
  }
  if (path.extname(evidenceFile) !== ".json") {
    throw new Error("Installed adapter evidence path must reference a JSON file.");
  }

  let value: unknown;
  try {
    value = JSON.parse(readFileSync(evidenceFile, "utf8"));
  } catch (error) {
    throw new Error(
      `Installed adapter evidence must contain valid JSON: ${errorMessage(error)}`,
    );
  }

  return parseInstalledAdapterEvidence(
    value,
    matrix,
    path
      .relative(resolvedRepositoryRoot, evidenceFile)
      .split(path.sep)
      .join("/"),
  );
}

export function parseInstalledAdapterEvidence(
  value: unknown,
  matrix: InstalledAdapterMatrix,
  sourcePath = "test-results/installed-adapters/evidence.json",
): InstalledAdapterEvidence {
  if (!isRecord(value)) {
    throw new Error("Installed adapter evidence must be a JSON object.");
  }
  rejectUnknownKeys(
    value,
    [
      "version",
      "runId",
      "matrixId",
      "recordedAt",
      "studioOsVersion",
      "studioOsRevision",
      "records",
    ],
    "Installed adapter evidence",
  );

  if (value.version !== 1) {
    throw new Error("Installed adapter evidence version must be 1.");
  }
  const runId = identifier(value.runId, "Installed adapter evidence runId");
  const matrixId = identifier(value.matrixId, "Installed adapter evidence matrixId");
  if (matrixId !== matrix.matrixId) {
    throw new Error(
      `Installed adapter evidence matrixId must be ${matrix.matrixId}.`,
    );
  }
  const recordedAt = isoTimestamp(value.recordedAt);
  const studioOsVersion = semanticVersion(
    value.studioOsVersion,
    "Installed adapter evidence studioOsVersion",
  );
  const studioOsRevision = gitRevision(value.studioOsRevision);
  if (!Array.isArray(value.records)) {
    throw new Error("Installed adapter evidence records must be an array.");
  }
  if (value.records.length !== matrix.cases.length) {
    throw new Error(
      `Installed adapter evidence must contain exactly ${matrix.cases.length} records.`,
    );
  }

  const matrixCases = new Map(matrix.cases.map((entry) => [entry.id, entry]));
  const recordsByCase = new Map<string, InstalledAdapterEvidenceRecord>();

  for (const [index, entry] of value.records.entries()) {
    const caseId =
      isRecord(entry) && typeof entry.caseId === "string" ? entry.caseId : undefined;
    const matrixCase = caseId ? matrixCases.get(caseId) : undefined;
    if (!matrixCase) {
      throw new Error(
        `Installed adapter evidence record ${index + 1} references an unknown case.`,
      );
    }
    if (recordsByCase.has(matrixCase.id)) {
      throw new Error(
        `Installed adapter evidence has duplicate case record: ${matrixCase.id}`,
      );
    }
    recordsByCase.set(matrixCase.id, parseEvidenceRecord(entry, matrixCase));
  }

  const missing = matrix.cases
    .map((entry) => entry.id)
    .filter((caseId) => !recordsByCase.has(caseId));
  if (missing.length > 0) {
    throw new Error(
      `Installed adapter evidence is missing case records: ${missing.join(", ")}`,
    );
  }

  const records = matrix.cases.map(
    (entry) => recordsByCase.get(entry.id) as InstalledAdapterEvidenceRecord,
  );

  return {
    version: 1,
    runId,
    matrixId,
    recordedAt,
    studioOsVersion,
    studioOsRevision,
    sourcePath,
    records,
  };
}

export function summarizeInstalledAdapterEvidence(
  evidence: InstalledAdapterEvidence,
): InstalledAdapterEvidenceSummary {
  const pass = evidence.records.filter((record) => record.outcome === "PASS").length;
  const fail = evidence.records.filter((record) => record.outcome === "FAIL").length;
  const blocked = evidence.records.filter(
    (record) => record.outcome === "BLOCKED",
  ).length;
  const status: InstalledAdapterOutcome =
    fail > 0 ? "FAIL" : blocked > 0 ? "BLOCKED" : "PASS";

  return { status, total: evidence.records.length, pass, fail, blocked };
}

export function buildInstalledAdapterResults(
  evidence: InstalledAdapterEvidence,
  matrix: InstalledAdapterMatrix,
): object {
  return {
    run: {
      runId: evidence.runId,
      matrixId: evidence.matrixId,
      matrixVersion: matrix.version,
      matrixSource: matrix.sourcePath,
      evidenceVersion: evidence.version,
      evidenceSource: evidence.sourcePath,
      recordedAt: evidence.recordedAt,
      studioOsVersion: evidence.studioOsVersion,
      studioOsRevision: evidence.studioOsRevision,
    },
    summary: summarizeInstalledAdapterEvidence(evidence),
    records: evidence.records,
  };
}

export function buildInstalledAdapterSummaryMarkdown(
  evidence: InstalledAdapterEvidence,
  matrix: InstalledAdapterMatrix,
): string {
  const summary = summarizeInstalledAdapterEvidence(evidence);
  const lines = [
    "# Installed Adapter Matrix",
    "",
    `- Run: ${evidence.runId}`,
    `- Matrix: ${evidence.matrixId} (contract v${matrix.version})`,
    `- Matrix source: ${matrix.sourcePath}`,
    `- Evidence source: ${evidence.sourcePath}`,
    `- Recorded at: ${evidence.recordedAt}`,
    `- Studio OS: ${evidence.studioOsVersion} (${evidence.studioOsRevision})`,
    `- Overall status: ${summary.status}`,
    `- Cases: ${summary.total}; PASS ${summary.pass}; FAIL ${summary.fail}; BLOCKED ${summary.blocked}`,
    "",
    "| Case | Adapter | Mode | Host | Outcome | Failure owner | Summary | Evidence |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...evidence.records.map(
      (record) =>
        `| ${escapeMarkdown(record.caseId)} | ${escapeMarkdown(record.adapter)} | ${escapeMarkdown(record.projectMode)} | ${escapeMarkdown(`${record.hostName} ${record.hostVersion}`)} | ${record.outcome} | ${record.failureOwner} | ${escapeMarkdown(record.summary)} | ${escapeMarkdown(record.evidenceReferences.join(", "))} |`,
    ),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

export function resolveInstalledAdapterOutputDirectory(
  repositoryRoot: string,
  repositoryPath: string,
): string {
  if (
    !repositoryPath.trim() ||
    path.isAbsolute(repositoryPath) ||
    /^[A-Za-z]:[\\/]/.test(repositoryPath) ||
    /^file:/i.test(repositoryPath)
  ) {
    throw new Error("Installed adapter output path must be repository-relative.");
  }
  const resolvedRepositoryRoot = realpathSync(repositoryRoot);
  const evidenceRoot = resolveRepositoryPath(
    resolvedRepositoryRoot,
    "test-results/installed-adapters",
    "Installed adapter evidence root",
  );
  const candidate = path.resolve(resolvedRepositoryRoot, repositoryPath);
  if (candidate === evidenceRoot) {
    throw new Error("Installed adapter output path must be below the evidence root.");
  }
  assertContained(evidenceRoot, candidate);
  if (existsSync(candidate)) {
    throw new Error(`Installed adapter output directory already exists: ${repositoryPath}`);
  }

  let existingParent = path.dirname(candidate);
  while (!existsSync(existingParent)) {
    const next = path.dirname(existingParent);
    if (next === existingParent) {
      throw new Error("Installed adapter output parent cannot be resolved.");
    }
    existingParent = next;
  }
  const resolvedParent = realpathSync(existingParent);
  if (resolvedParent !== evidenceRoot) {
    assertContained(evidenceRoot, resolvedParent);
  }
  return candidate;
}

export function writeInstalledAdapterArtifacts(
  outputDirectory: string,
  evidence: InstalledAdapterEvidence,
  matrix: InstalledAdapterMatrix,
): void {
  if (existsSync(outputDirectory)) {
    throw new Error(`Installed adapter output directory already exists: ${outputDirectory}`);
  }
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(
    path.join(outputDirectory, "summary.md"),
    buildInstalledAdapterSummaryMarkdown(evidence, matrix),
  );
  writeFileSync(
    path.join(outputDirectory, "results.json"),
    `${JSON.stringify(buildInstalledAdapterResults(evidence, matrix), null, 2)}\n`,
  );
}

function parseEvidenceRecord(
  value: unknown,
  matrixCase: InstalledAdapterMatrixCase,
): InstalledAdapterEvidenceRecord {
  if (!isRecord(value)) {
    throw new Error(`Installed adapter evidence record ${matrixCase.id} must be an object.`);
  }
  rejectUnknownKeys(
    value,
    [
      "caseId",
      "adapter",
      "projectMode",
      "adapterVersion",
      "hostName",
      "hostVersion",
      "distributionSource",
      "scenarioId",
      "outcome",
      "failureOwner",
      "summary",
      "checks",
      "evidenceReferences",
    ],
    `Installed adapter evidence record ${matrixCase.id}`,
  );

  const caseId = exactText(value.caseId, matrixCase.id, "caseId");
  const adapter = exactText(value.adapter, matrixCase.adapter, "adapter");
  const projectMode = exactText(
    value.projectMode,
    matrixCase.projectMode,
    "projectMode",
  );
  const adapterVersion = semanticVersion(
    value.adapterVersion,
    `Installed adapter evidence record ${caseId} adapterVersion`,
  );
  const hostName = compactText(
    value.hostName,
    `Installed adapter evidence record ${caseId} hostName`,
    80,
  );
  const hostVersion = compactText(
    value.hostVersion,
    `Installed adapter evidence record ${caseId} hostVersion`,
    80,
  );
  const distributionSource = exactText(
    value.distributionSource,
    matrixCase.distributionSource,
    "distributionSource",
  );
  const scenarioId = exactText(value.scenarioId, matrixCase.scenarioId, "scenarioId");
  const outcome = enumValue(
    value.outcome,
    installedAdapterOutcomes,
    `Installed adapter evidence record ${caseId} outcome`,
  );
  const failureOwner = enumValue(
    value.failureOwner,
    installedAdapterFailureOwners,
    `Installed adapter evidence record ${caseId} failureOwner`,
  );
  const summary = compactText(
    value.summary,
    `Installed adapter evidence record ${caseId} summary`,
    240,
  );
  const checks = parseChecks(value.checks, matrixCase);
  const evidenceReferences = referenceArray(
    value.evidenceReferences,
    `Installed adapter evidence record ${caseId} evidenceReferences`,
  );

  const expectedOutcome = classifyChecks(checks);
  if (outcome !== expectedOutcome) {
    throw new Error(
      `Installed adapter evidence record ${caseId} outcome must be ${expectedOutcome} for its check statuses.`,
    );
  }
  if (
    (outcome === "PASS" && failureOwner !== "none") ||
    (outcome !== "PASS" && failureOwner === "none")
  ) {
    throw new Error(
      `Installed adapter evidence record ${caseId} failureOwner is inconsistent with ${outcome}.`,
    );
  }

  for (const text of [
    adapterVersion,
    hostName,
    hostVersion,
    summary,
    ...evidenceReferences,
    ...checks.map((check) => check.observation),
  ]) {
    assertPortableAndSanitized(text, `Installed adapter evidence record ${caseId}`);
  }

  return {
    caseId,
    adapter,
    projectMode,
    adapterVersion,
    hostName,
    hostVersion,
    distributionSource,
    scenarioId,
    outcome,
    failureOwner,
    summary,
    checks,
    evidenceReferences,
  };
}

function parseChecks(
  value: unknown,
  matrixCase: InstalledAdapterMatrixCase,
): InstalledAdapterCheckEvidence[] {
  if (!Array.isArray(value) || value.length !== matrixCase.requiredChecks.length) {
    throw new Error(
      `Installed adapter evidence record ${matrixCase.id} must contain exactly ${matrixCase.requiredChecks.length} checks.`,
    );
  }
  return value.map((entry, index) => {
    if (!isRecord(entry)) {
      throw new Error(
        `Installed adapter evidence record ${matrixCase.id} check ${index + 1} must be an object.`,
      );
    }
    rejectUnknownKeys(
      entry,
      ["id", "status", "observation"],
      `Installed adapter evidence record ${matrixCase.id} check ${index + 1}`,
    );
    const id = exactText(entry.id, matrixCase.requiredChecks[index], "check id");
    const status = enumValue(
      entry.status,
      installedAdapterOutcomes,
      `Installed adapter evidence record ${matrixCase.id} check ${id} status`,
    );
    const observation = compactText(
      entry.observation,
      `Installed adapter evidence record ${matrixCase.id} check ${id} observation`,
      240,
    );
    return { id, status, observation };
  });
}

function classifyChecks(checks: InstalledAdapterCheckEvidence[]): InstalledAdapterOutcome {
  if (checks.some((check) => check.status === "FAIL")) {
    return "FAIL";
  }
  if (checks.some((check) => check.status === "BLOCKED")) {
    return "BLOCKED";
  }
  return "PASS";
}

function referenceArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 8) {
    throw new Error(`${label} must contain between 1 and 8 references.`);
  }
  const references = value.map((entry, index) => {
    if (
      typeof entry !== "string" ||
      !/^[a-z0-9][a-z0-9._:/-]{0,127}$/.test(entry) ||
      entry.includes("..") ||
      entry.includes("//") ||
      entry.includes("://")
    ) {
      throw new Error(`${label}[${index}] must be a portable evidence identifier.`);
    }
    return entry;
  });
  if (new Set(references).size !== references.length) {
    throw new Error(`${label} must not contain duplicates.`);
  }
  return references;
}

function semanticVersion(value: unknown, label: string): string {
  const version = compactText(value, label, 80);
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`${label} must be a semantic version.`);
  }
  return version;
}

function gitRevision(value: unknown): string {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/.test(value)) {
    throw new Error("Installed adapter evidence studioOsRevision must be a full Git revision.");
  }
  return value;
}

function isoTimestamp(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error("Installed adapter evidence recordedAt must be an ISO UTC timestamp.");
  }
  return value;
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

function exactText<T extends string>(
  value: unknown,
  expected: T,
  field: string,
): T {
  if (value !== expected) {
    throw new Error(`${field} must be ${expected}.`);
  }
  return expected;
}

function compactText(value: unknown, label: string, maximum: number): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > maximum ||
    /[\r\n]/.test(value)
  ) {
    throw new Error(`${label} must be a compact non-empty string up to ${maximum} characters.`);
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

function assertPortableAndSanitized(value: string, label: string): void {
  if (forbiddenPersistentText.some((pattern) => pattern.test(value))) {
    throw new Error(`${label} contains a machine-specific or escaping path.`);
  }
  if (secretText.some((pattern) => pattern.test(value))) {
    throw new Error(`${label} contains secret-like material.`);
  }
}

function assertContained(root: string, candidate: string): void {
  const relative = path.relative(root, candidate);
  if (
    relative === "" ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(
      "Installed adapter output path must remain inside test-results/installed-adapters.",
    );
  }
}

function escapeMarkdown(value: string): string {
  return value.replaceAll("|", "\\|");
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
