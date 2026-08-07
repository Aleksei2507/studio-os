export const installedAdapters = ["codex", "claude-code", "universal"] as const;
export type InstalledAdapter = (typeof installedAdapters)[number];

export const installedAdapterMatrixId = "v0.5-installed-adapter-parity";

export const installedAdapterProjectModes = ["greenfield", "brownfield"] as const;
export type InstalledAdapterProjectMode =
  (typeof installedAdapterProjectModes)[number];

export const installedAdapterOutcomes = ["PASS", "FAIL", "BLOCKED"] as const;
export type InstalledAdapterOutcome = (typeof installedAdapterOutcomes)[number];

export const installedAdapterFailureOwners = [
  "none",
  "adapter",
  "runtime",
  "host",
  "infrastructure",
] as const;
export type InstalledAdapterFailureOwner =
  (typeof installedAdapterFailureOwners)[number];

const commonCheckIds = [
  "exact-studio-os-root",
  "canonical-runtime-boundary",
  "project-language",
  "portable-evidence",
  "target-workspace-isolation",
] as const;

const modeCheckIds = {
  greenfield: ["interview-handoff", "no-premature-implementation"],
  brownfield: [
    "briefing-handoff",
    "bounded-onboarding-artifacts",
    "source-preservation",
  ],
} as const satisfies Record<InstalledAdapterProjectMode, readonly string[]>;

export const scenarioByProjectMode = {
  greenfield: "bootstrap-001-explicit-greenfield-activation",
  brownfield: "fixture-001-brownfield-project-memory",
} as const satisfies Record<InstalledAdapterProjectMode, string>;

export const distributionSourceByAdapter = {
  codex: "github-marketplace",
  "claude-code": "github-marketplace",
  universal: "release-zip",
} as const satisfies Record<InstalledAdapter, string>;

export function requiredCheckIds(
  projectMode: InstalledAdapterProjectMode,
): string[] {
  return [...commonCheckIds, ...modeCheckIds[projectMode]];
}

export interface InstalledAdapterMatrixCase {
  id: string;
  adapter: InstalledAdapter;
  projectMode: InstalledAdapterProjectMode;
  distributionSource: string;
  scenarioId: string;
  requiredChecks: string[];
}

export interface InstalledAdapterMatrix {
  version: 1;
  matrixId: string;
  sourcePath: string;
  cases: InstalledAdapterMatrixCase[];
}

export interface InstalledAdapterCheckEvidence {
  id: string;
  status: InstalledAdapterOutcome;
  observation: string;
}

export interface InstalledAdapterEvidenceRecord {
  caseId: string;
  adapter: InstalledAdapter;
  projectMode: InstalledAdapterProjectMode;
  adapterVersion: string;
  hostName: string;
  hostVersion: string;
  distributionSource: string;
  scenarioId: string;
  outcome: InstalledAdapterOutcome;
  failureOwner: InstalledAdapterFailureOwner;
  summary: string;
  checks: InstalledAdapterCheckEvidence[];
  evidenceReferences: string[];
}

export interface InstalledAdapterEvidence {
  version: 1;
  runId: string;
  matrixId: string;
  recordedAt: string;
  studioOsVersion: string;
  studioOsRevision: string;
  sourcePath: string;
  records: InstalledAdapterEvidenceRecord[];
}

export interface InstalledAdapterEvidenceSummary {
  status: InstalledAdapterOutcome;
  total: number;
  pass: number;
  fail: number;
  blocked: number;
}
