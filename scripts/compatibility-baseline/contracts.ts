export type CompatibilityClassification =
  | "Compatible"
  | "Flaky"
  | "Incompatible"
  | "Unknown";

export type CompatibilityEngine = "codex" | "ollama";

export type TrialStatus = "PASS" | "FAIL" | "PARTIAL";

export const compatibilityEngines: readonly CompatibilityEngine[] = [
  "codex",
  "ollama",
];

export const compatibilityBaselineId = "v0.5-compatibility";
export const compatibilitySuiteId = "v0.5-critical-lifecycle";
export const REQUIRED_TRIALS = 3;

export interface BaselineCombination {
  id: string;
  description: string;
  engine: CompatibilityEngine;
  executorModel: string;
  judgeModel: string;
  adapter: string;
}

export interface CompatibilityBaseline {
  version: 1;
  baselineId: string;
  suiteId: string;
  requiredTrials: number;
  combinations: BaselineCombination[];
  sourcePath: string;
}

export interface CompatibilityTrialRecord {
  version: 1;
  baselineId: string;
  combinationId: string;
  scenarioId: string;
  trialNumber: number;
  studioOsVersion: string;
  studioOsRevision: string;
  workingTreeDirty: boolean;
  engine: CompatibilityEngine;
  executorModelExact: string;
  judgeModelExact: string;
  providerVersion?: string;
  executedAt: string;
  validTrial: boolean;
  status?: TrialStatus;
  invalidReason?: string;
  workspaceMutationViolation: boolean;
}

export interface CombinationScenarioSummary {
  scenarioId: string;
  classification: CompatibilityClassification;
  validTrials: number;
  passedTrials: number;
  failedTrials: number;
  invalidTrials: number;
  workspaceMutationViolation: boolean;
}

export interface CombinationSummary {
  combinationId: string;
  engine: CompatibilityEngine;
  executorModel: string;
  judgeModel: string;
  overallClassification: CompatibilityClassification;
  scenarios: CombinationScenarioSummary[];
}

export interface CompatibilitySummary {
  version: 1;
  baselineId: string;
  suiteId: string;
  generatedAt: string;
  combinations: CombinationSummary[];
}

export function classifyCompatibility(
  passedTrials: number,
  validTrials: number,
  workspaceMutationViolation: boolean,
): CompatibilityClassification {
  if (workspaceMutationViolation) return "Incompatible";
  if (validTrials < REQUIRED_TRIALS) return "Unknown";
  if (passedTrials === REQUIRED_TRIALS) return "Compatible";
  if (passedTrials === 0) return "Incompatible";
  return "Flaky";
}

export function overallCombinationClassification(
  scenarios: CombinationScenarioSummary[],
): CompatibilityClassification {
  if (scenarios.some((s) => s.classification === "Incompatible")) {
    return "Incompatible";
  }
  if (scenarios.some((s) => s.classification === "Flaky")) {
    return "Flaky";
  }
  if (scenarios.some((s) => s.classification === "Unknown")) {
    return "Unknown";
  }
  return "Compatible";
}

export function parseCompatibilityBaseline(
  value: unknown,
  sourcePath: string,
): CompatibilityBaseline {
  if (!isRecord(value)) {
    throw new Error("Compatibility baseline must be a JSON object.");
  }
  if (value.version !== 1) {
    throw new Error("Compatibility baseline version must be 1.");
  }
  if (typeof value.baselineId !== "string" || !value.baselineId.trim()) {
    throw new Error(
      "Compatibility baseline baselineId must be a non-empty string.",
    );
  }
  if (typeof value.suiteId !== "string" || !value.suiteId.trim()) {
    throw new Error(
      "Compatibility baseline suiteId must be a non-empty string.",
    );
  }
  if (typeof value.requiredTrials !== "number" || value.requiredTrials < 1) {
    throw new Error(
      "Compatibility baseline requiredTrials must be a positive number.",
    );
  }
  if (!Array.isArray(value.combinations) || value.combinations.length === 0) {
    throw new Error(
      "Compatibility baseline must contain at least one combination.",
    );
  }

  const seenIds = new Set<string>();
  const combinations: BaselineCombination[] = [];
  for (const item of value.combinations) {
    const combo = parseBaselineCombination(item);
    if (seenIds.has(combo.id)) {
      throw new Error(`Duplicate baseline combination id: ${combo.id}.`);
    }
    seenIds.add(combo.id);
    combinations.push(combo);
  }

  return {
    version: 1,
    baselineId: value.baselineId,
    suiteId: value.suiteId,
    requiredTrials: value.requiredTrials,
    combinations,
    sourcePath,
  };
}

function parseBaselineCombination(value: unknown): BaselineCombination {
  if (!isRecord(value)) {
    throw new Error("Baseline combination must be a JSON object.");
  }
  requireNonEmptyString(value, "id", "Baseline combination");
  requireNonEmptyString(value, "description", "Baseline combination");
  if (!compatibilityEngines.includes(value.engine as CompatibilityEngine)) {
    throw new Error(
      `Baseline combination engine must be one of: ${compatibilityEngines.join(", ")}.`,
    );
  }
  requireNonEmptyString(value, "executorModel", "Baseline combination");
  requireNonEmptyString(value, "judgeModel", "Baseline combination");
  requireNonEmptyString(value, "adapter", "Baseline combination");

  return {
    id: value.id as string,
    description: value.description as string,
    engine: value.engine as CompatibilityEngine,
    executorModel: value.executorModel as string,
    judgeModel: value.judgeModel as string,
    adapter: value.adapter as string,
  };
}

export function parseCompatibilityTrialRecord(
  value: unknown,
): CompatibilityTrialRecord {
  if (!isRecord(value)) {
    throw new Error("Compatibility trial record must be a JSON object.");
  }
  if (value.version !== 1) {
    throw new Error("Trial record version must be 1.");
  }
  requireNonEmptyString(value, "baselineId", "Trial record");
  requireNonEmptyString(value, "combinationId", "Trial record");
  requireNonEmptyString(value, "scenarioId", "Trial record");
  if (typeof value.trialNumber !== "number" || value.trialNumber < 1) {
    throw new Error("Trial record trialNumber must be a positive number.");
  }
  requireNonEmptyString(value, "studioOsVersion", "Trial record");
  requireNonEmptyString(value, "studioOsRevision", "Trial record");
  if (!/^[0-9a-f]{40}$/.test(value.studioOsRevision as string)) {
    throw new Error(
      "Trial record studioOsRevision must be a 40-character lowercase hex string.",
    );
  }
  if (typeof value.workingTreeDirty !== "boolean") {
    throw new Error("Trial record workingTreeDirty must be a boolean.");
  }
  if (!compatibilityEngines.includes(value.engine as CompatibilityEngine)) {
    throw new Error("Trial record engine must be codex or ollama.");
  }
  requireNonEmptyString(value, "executorModelExact", "Trial record");
  requireNonEmptyString(value, "judgeModelExact", "Trial record");
  requireNonEmptyString(value, "executedAt", "Trial record");
  if (typeof value.validTrial !== "boolean") {
    throw new Error("Trial record validTrial must be a boolean.");
  }
  if (value.validTrial) {
    if (
      value.status !== "PASS" &&
      value.status !== "FAIL" &&
      value.status !== "PARTIAL"
    ) {
      throw new Error("Valid trial record status must be PASS, FAIL, or PARTIAL.");
    }
  } else {
    if (
      typeof value.invalidReason !== "string" ||
      !(value.invalidReason as string).trim()
    ) {
      throw new Error(
        "Invalid trial record must have a non-empty invalidReason.",
      );
    }
  }
  if (typeof value.workspaceMutationViolation !== "boolean") {
    throw new Error(
      "Trial record workspaceMutationViolation must be a boolean.",
    );
  }

  const record: CompatibilityTrialRecord = {
    version: 1,
    baselineId: value.baselineId as string,
    combinationId: value.combinationId as string,
    scenarioId: value.scenarioId as string,
    trialNumber: value.trialNumber as number,
    studioOsVersion: value.studioOsVersion as string,
    studioOsRevision: value.studioOsRevision as string,
    workingTreeDirty: value.workingTreeDirty as boolean,
    engine: value.engine as CompatibilityEngine,
    executorModelExact: value.executorModelExact as string,
    judgeModelExact: value.judgeModelExact as string,
    executedAt: value.executedAt as string,
    validTrial: value.validTrial as boolean,
    workspaceMutationViolation: value.workspaceMutationViolation as boolean,
  };

  if (typeof value.providerVersion === "string" && value.providerVersion) {
    record.providerVersion = value.providerVersion;
  }
  if (value.validTrial && value.status) {
    record.status = value.status as TrialStatus;
  }
  if (!value.validTrial && value.invalidReason) {
    record.invalidReason = value.invalidReason as string;
  }

  return record;
}

function requireNonEmptyString(
  record: Record<string, unknown>,
  field: string,
  prefix: string,
): void {
  if (typeof record[field] !== "string" || !(record[field] as string).trim()) {
    throw new Error(`${prefix} ${field} must be a non-empty string.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
