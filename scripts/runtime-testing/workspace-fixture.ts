import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type {
  FixtureWorkspaceSpec,
  WorkspaceAssertionAssessment,
  WorkspaceAssertions,
  WorkspaceDiff,
  WorkspaceEvaluation,
} from "./contracts.ts";

interface FileSnapshot {
  hash: string;
}

interface WorkspaceSnapshot {
  directories: Set<string>;
  files: Map<string, FileSnapshot>;
}

export interface FixtureWorkspaceRun<T> {
  value: T;
  evaluation: WorkspaceEvaluation;
}

const ASSERTION_KEYS = new Set([
  "version",
  "created",
  "modified",
  "deleted",
  "unchanged",
  "absent",
  "allowedChanges",
  "contains",
  "notContains",
]);

export function loadFixtureWorkspaceSpec(
  repositoryRoot: string,
  fixturePath: string,
  assertionsPath: string,
): FixtureWorkspaceSpec {
  const root = realpathSync(repositoryRoot);
  const fixtureDirectory = resolveRepositoryPath(
    root,
    fixturePath,
    "Fixture",
  );
  const assertionsFile = resolveRepositoryPath(
    root,
    assertionsPath,
    "Workspace assertions",
  );

  if (!statSync(fixtureDirectory).isDirectory()) {
    throw new Error(`Fixture path is not a directory: ${fixturePath}`);
  }

  if (fixtureDirectory === root) {
    throw new Error("Fixture must be a repository-relative subdirectory.");
  }

  if (!statSync(assertionsFile).isFile()) {
    throw new Error(
      `Workspace assertions path is not a file: ${assertionsPath}`,
    );
  }

  assertNoSymlinks(fixtureDirectory);

  let source: unknown;
  try {
    source = JSON.parse(readFileSync(assertionsFile, "utf8"));
  } catch (error) {
    throw new Error(
      `Workspace assertions must be valid JSON: ${errorMessage(error)}`,
    );
  }

  return {
    fixtureDirectory,
    assertionsFile,
    assertions: parseWorkspaceAssertions(source),
  };
}

export async function runFixtureWorkspace<T>(
  spec: FixtureWorkspaceSpec,
  execute: (workspace: string) => Promise<T>,
): Promise<FixtureWorkspaceRun<T>> {
  const sessionRoot = mkdtempSync(
    path.join(tmpdir(), "studio-os-runtime-fixture-"),
  );
  const workspace = path.join(sessionRoot, "workspace");
  mkdirSync(workspace);

  try {
    copyFixtureContents(spec.fixtureDirectory, workspace);
    const before = snapshotWorkspace(workspace);
    const value = await execute(workspace);
    const after = snapshotWorkspace(workspace);

    return {
      value,
      evaluation: evaluateWorkspace(
        workspace,
        before,
        after,
        spec.assertions,
      ),
    };
  } finally {
    rmSync(sessionRoot, { recursive: true, force: true });
  }
}

export function parseWorkspaceAssertions(
  source: unknown,
): WorkspaceAssertions {
  if (!isRecord(source)) {
    throw new Error("Workspace assertions must be a JSON object.");
  }

  const unknownKeys = Object.keys(source).filter(
    (key) => !ASSERTION_KEYS.has(key),
  );
  if (unknownKeys.length > 0) {
    throw new Error(
      `Unknown workspace assertion field(s): ${unknownKeys.join(", ")}`,
    );
  }

  if (source.version !== 1) {
    throw new Error("Workspace assertions version must be 1.");
  }

  const assertions: WorkspaceAssertions = {
    version: 1,
    created: optionalPathList(source, "created"),
    modified: optionalPathList(source, "modified"),
    deleted: optionalPathList(source, "deleted"),
    unchanged: optionalPathList(source, "unchanged"),
    absent: optionalPathList(source, "absent"),
    allowedChanges: optionalPathList(source, "allowedChanges"),
    contains: optionalContentAssertions(source, "contains"),
    notContains: optionalContentAssertions(source, "notContains"),
  };

  const observableCheckCount =
    (assertions.created?.length ?? 0) +
    (assertions.modified?.length ?? 0) +
    (assertions.deleted?.length ?? 0) +
    (assertions.unchanged?.length ?? 0) +
    (assertions.absent?.length ?? 0) +
    contentCheckCount(assertions.contains) +
    contentCheckCount(assertions.notContains) +
    (assertions.allowedChanges ? 1 : 0);
  if (observableCheckCount === 0) {
    throw new Error(
      "Workspace assertions must define at least one observable check.",
    );
  }

  validateAssertionRelationships(assertions);
  return assertions;
}

function resolveRepositoryPath(
  repositoryRoot: string,
  repositoryPath: string,
  label: string,
): string {
  if (
    !repositoryPath.trim() ||
    path.isAbsolute(repositoryPath) ||
    /^[A-Za-z]:[\\/]/.test(repositoryPath)
  ) {
    throw new Error(`${label} path must be repository-relative.`);
  }

  const candidate = path.resolve(repositoryRoot, repositoryPath);
  assertContainedPath(repositoryRoot, candidate, label);

  if (!existsSync(candidate)) {
    throw new Error(`${label} path does not exist: ${repositoryPath}`);
  }

  const resolved = realpathSync(candidate);
  assertContainedPath(repositoryRoot, resolved, label);
  return resolved;
}

function assertContainedPath(
  root: string,
  candidate: string,
  label: string,
): void {
  const relative = path.relative(root, candidate);
  if (
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`${label} path resolves outside the repository.`);
  }
}

function optionalPathList(
  source: Record<string, unknown>,
  key: string,
): string[] | undefined {
  if (!(key in source)) {
    return undefined;
  }

  const value = source[key];
  if (!Array.isArray(value)) {
    throw new Error(`Workspace assertion ${key} must be an array.`);
  }

  const paths = value.map((item, index) => {
    if (typeof item !== "string") {
      throw new Error(
        `Workspace assertion ${key}[${index}] must be a string.`,
      );
    }
    return normalizeArtifactPath(item, `${key}[${index}]`);
  });

  if (new Set(paths).size !== paths.length) {
    throw new Error(`Workspace assertion ${key} contains duplicate paths.`);
  }

  return paths;
}

function optionalContentAssertions(
  source: Record<string, unknown>,
  key: string,
): Record<string, string[]> | undefined {
  if (!(key in source)) {
    return undefined;
  }

  const value = source[key];
  if (!isRecord(value)) {
    throw new Error(`Workspace assertion ${key} must be an object.`);
  }

  const result: Record<string, string[]> = {};
  for (const [rawPath, rawSnippets] of Object.entries(value)) {
    const artifactPath = normalizeArtifactPath(rawPath, `${key} path`);
    if (!Array.isArray(rawSnippets) || rawSnippets.length === 0) {
      throw new Error(
        `Workspace assertion ${key}.${rawPath} must be a non-empty array.`,
      );
    }

    result[artifactPath] = rawSnippets.map((snippet, index) => {
      if (typeof snippet !== "string" || !snippet) {
        throw new Error(
          `Workspace assertion ${key}.${rawPath}[${index}] must be a non-empty string.`,
        );
      }
      return snippet;
    });
  }

  return result;
}

function normalizeArtifactPath(value: string, label: string): string {
  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed.includes("\0") ||
    trimmed.includes("\\") ||
    path.posix.isAbsolute(trimmed) ||
    /^[A-Za-z]:/.test(trimmed)
  ) {
    throw new Error(`${label} must be a project-relative POSIX path.`);
  }

  const normalized = path.posix.normalize(trimmed);
  if (
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    throw new Error(`${label} must remain inside the fixture workspace.`);
  }

  return normalized;
}

function validateAssertionRelationships(assertions: WorkspaceAssertions): void {
  const changed = new Set([
    ...(assertions.created ?? []),
    ...(assertions.modified ?? []),
    ...(assertions.deleted ?? []),
  ]);
  const present = new Set([
    ...changed,
    ...(assertions.unchanged ?? []),
    ...Object.keys(assertions.contains ?? {}),
    ...Object.keys(assertions.notContains ?? {}),
  ]);

  for (const artifactPath of assertions.unchanged ?? []) {
    if (changed.has(artifactPath)) {
      throw new Error(
        `Workspace path cannot be both changed and unchanged: ${artifactPath}`,
      );
    }
  }

  for (const artifactPath of assertions.absent ?? []) {
    if (present.has(artifactPath)) {
      throw new Error(
        `Workspace path cannot be both present and absent: ${artifactPath}`,
      );
    }
  }

  if (assertions.allowedChanges) {
    const allowed = new Set(assertions.allowedChanges);
    for (const artifactPath of changed) {
      if (!allowed.has(artifactPath)) {
        throw new Error(
          `Expected changed path is missing from allowedChanges: ${artifactPath}`,
        );
      }
    }
  }
}

function copyFixtureContents(source: string, destination: string): void {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    cpSync(
      path.join(source, entry.name),
      path.join(destination, entry.name),
      {
        recursive: true,
        errorOnExist: true,
      },
    );
  }
}

function assertNoSymlinks(root: string): void {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Fixture must not contain symlinks: ${entryPath}`);
    }
    if (entry.isDirectory()) {
      assertNoSymlinks(entryPath);
    }
  }
}

function snapshotWorkspace(root: string): WorkspaceSnapshot {
  const snapshot: WorkspaceSnapshot = {
    directories: new Set<string>(),
    files: new Map<string, FileSnapshot>(),
  };

  walkWorkspace(root, "", snapshot);
  return snapshot;
}

function walkWorkspace(
  root: string,
  relativeDirectory: string,
  snapshot: WorkspaceSnapshot,
): void {
  const directory = path.join(root, relativeDirectory);
  const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  for (const entry of entries) {
    const relativePath = relativeDirectory
      ? path.posix.join(
          relativeDirectory.split(path.sep).join(path.posix.sep),
          entry.name,
        )
      : entry.name;
    const absolutePath = path.join(directory, entry.name);
    const stats = lstatSync(absolutePath);

    if (stats.isSymbolicLink()) {
      throw new Error(
        `Runtime workspace must not contain symlinks: ${relativePath}`,
      );
    }

    if (stats.isDirectory()) {
      snapshot.directories.add(relativePath);
      walkWorkspace(
        root,
        relativePath.split(path.posix.sep).join(path.sep),
        snapshot,
      );
      continue;
    }

    if (!stats.isFile()) {
      throw new Error(
        `Runtime workspace contains an unsupported entry: ${relativePath}`,
      );
    }

    snapshot.files.set(relativePath, {
      hash: createHash("sha256")
        .update(readFileSync(absolutePath))
        .digest("hex"),
    });
  }
}

function evaluateWorkspace(
  workspace: string,
  before: WorkspaceSnapshot,
  after: WorkspaceSnapshot,
  expected: WorkspaceAssertions,
): WorkspaceEvaluation {
  const diff = diffSnapshots(before, after);
  const assertions: WorkspaceAssertionAssessment[] = [];

  for (const artifactPath of expected.created ?? []) {
    assertions.push(
      pathChangeAssessment(
        "created",
        artifactPath,
        diff.created.includes(artifactPath),
        diff.created,
      ),
    );
  }

  for (const artifactPath of expected.modified ?? []) {
    assertions.push(
      pathChangeAssessment(
        "modified",
        artifactPath,
        diff.modified.includes(artifactPath),
        diff.modified,
      ),
    );
  }

  for (const artifactPath of expected.deleted ?? []) {
    assertions.push(
      pathChangeAssessment(
        "deleted",
        artifactPath,
        diff.deleted.includes(artifactPath),
        diff.deleted,
      ),
    );
  }

  for (const artifactPath of expected.unchanged ?? []) {
    const beforeFile = before.files.get(artifactPath);
    const afterFile = after.files.get(artifactPath);
    const met = Boolean(
      beforeFile && afterFile && beforeFile.hash === afterFile.hash,
    );
    assertions.push({
      assertion: `unchanged: ${artifactPath}`,
      met,
      evidence: met
        ? `${artifactPath} exists with the same content hash.`
        : `${artifactPath} was missing or its content hash changed.`,
    });
  }

  for (const artifactPath of expected.absent ?? []) {
    const met = !snapshotHasPath(after, artifactPath);
    assertions.push({
      assertion: `absent: ${artifactPath}`,
      met,
      evidence: met
        ? `${artifactPath} is absent after execution.`
        : `${artifactPath} exists after execution.`,
    });
  }

  if (expected.allowedChanges) {
    const actualChanges = [
      ...diff.created,
      ...diff.modified,
      ...diff.deleted,
    ].sort();
    const allowed = new Set(expected.allowedChanges);
    const unexpected = actualChanges.filter(
      (artifactPath) => !allowed.has(artifactPath),
    );
    assertions.push({
      assertion: "allowedChanges",
      met: unexpected.length === 0,
      evidence:
        unexpected.length === 0
          ? `All ${actualChanges.length} changed path(s) are allowed.`
          : `Unexpected changed path(s): ${unexpected.join(", ")}`,
    });
  }

  appendContentAssessments(
    assertions,
    workspace,
    after,
    expected.contains,
    true,
  );
  appendContentAssessments(
    assertions,
    workspace,
    after,
    expected.notContains,
    false,
  );

  return {
    status: assertions.every((assessment) => assessment.met) ? "PASS" : "FAIL",
    diff,
    assertions,
  };
}

function diffSnapshots(
  before: WorkspaceSnapshot,
  after: WorkspaceSnapshot,
): WorkspaceDiff {
  const created = [...after.files.keys()]
    .filter((artifactPath) => !before.files.has(artifactPath))
    .sort();
  const deleted = [...before.files.keys()]
    .filter((artifactPath) => !after.files.has(artifactPath))
    .sort();
  const modified = [...after.files.keys()]
    .filter((artifactPath) => {
      const beforeFile = before.files.get(artifactPath);
      const afterFile = after.files.get(artifactPath);
      return beforeFile && afterFile && beforeFile.hash !== afterFile.hash;
    })
    .sort();

  return { created, modified, deleted };
}

function pathChangeAssessment(
  kind: "created" | "modified" | "deleted",
  artifactPath: string,
  met: boolean,
  actual: string[],
): WorkspaceAssertionAssessment {
  return {
    assertion: `${kind}: ${artifactPath}`,
    met,
    evidence: met
      ? `${artifactPath} was ${kind}.`
      : `Expected ${artifactPath} to be ${kind}; actual ${kind} path(s): ${actual.join(", ") || "none"}.`,
  };
}

function snapshotHasPath(
  snapshot: WorkspaceSnapshot,
  artifactPath: string,
): boolean {
  return (
    snapshot.files.has(artifactPath) ||
    snapshot.directories.has(artifactPath)
  );
}

function appendContentAssessments(
  target: WorkspaceAssertionAssessment[],
  workspace: string,
  snapshot: WorkspaceSnapshot,
  expectations: Record<string, string[]> | undefined,
  shouldContain: boolean,
): void {
  if (!expectations) {
    return;
  }

  for (const [artifactPath, snippets] of Object.entries(expectations)) {
    const fileExists = snapshot.files.has(artifactPath);
    const content = fileExists
      ? readFileSync(
          path.join(workspace, artifactPath.split(path.posix.sep).join(path.sep)),
          "utf8",
        )
      : "";

    for (const snippet of snippets) {
      const found = fileExists && content.includes(snippet);
      const met = shouldContain ? found : fileExists && !found;
      const verb = shouldContain ? "contain" : "exclude";
      target.push({
        assertion: `${shouldContain ? "contains" : "notContains"}: ${artifactPath}`,
        met,
        evidence: !fileExists
          ? `${artifactPath} does not exist after execution.`
          : met
            ? `${artifactPath} satisfies the ${verb} check for ${JSON.stringify(snippet)}.`
            : `${artifactPath} does not satisfy the ${verb} check for ${JSON.stringify(snippet)}.`,
      });
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function contentCheckCount(
  expectations: Record<string, string[]> | undefined,
): number {
  return Object.values(expectations ?? {}).reduce(
    (total, snippets) => total + snippets.length,
    0,
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
