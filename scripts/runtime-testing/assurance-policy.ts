import { readFileSync } from "node:fs";
import path from "node:path";

export type CompatibilityClassification =
  | "compatible"
  | "flaky"
  | "incompatible"
  | "unknown";

export interface BehavioralAssurancePolicy {
  version: number;
  automaticRetries: number;
  baselineTrials: number;
  exploratoryScenarioLimit: number;
  requireExplicitCostConfirmation: boolean;
  requireExplicitModelIdentity: boolean;
  fullSuiteRequiresExplicitAll: boolean;
  classification: {
    compatiblePasses: number;
    flakyMinimumPasses: number;
    flakyMaximumPasses: number;
    incompatiblePasses: number;
  };
  criticalFailureDisposition: "incompatible";
  infrastructureErrorsCountAsBehavioralFailure: false;
  remoteProjectDataRequiresExplicitAuthorization: boolean;
}

export function loadBehavioralAssurancePolicy(
  repositoryRoot: string,
): BehavioralAssurancePolicy {
  const policyPath = path.join(
    repositoryRoot,
    "tests",
    "runtime",
    "behavioral-policy.json",
  );
  let source: unknown;
  try {
    source = JSON.parse(readFileSync(policyPath, "utf8"));
  } catch (error) {
    throw new Error(
      `Behavioral assurance policy must be valid JSON: ${errorMessage(error)}`,
    );
  }

  if (!isRecord(source)) {
    throw new Error("Behavioral assurance policy must be a JSON object.");
  }
  if (source.version !== 1) {
    throw new Error("Behavioral assurance policy version must be 1.");
  }
  if (source.automaticRetries !== 0) {
    throw new Error(
      "Behavioral assurance automaticRetries must remain 0.",
    );
  }
  if (source.baselineTrials !== 3) {
    throw new Error("Behavioral assurance baselineTrials must be 3.");
  }
  if (
    !Number.isSafeInteger(source.exploratoryScenarioLimit) ||
    Number(source.exploratoryScenarioLimit) <= 0
  ) {
    throw new Error(
      "Behavioral assurance exploratoryScenarioLimit must be a positive integer.",
    );
  }
  for (const field of [
    "requireExplicitCostConfirmation",
    "requireExplicitModelIdentity",
    "fullSuiteRequiresExplicitAll",
    "remoteProjectDataRequiresExplicitAuthorization",
  ] as const) {
    if (typeof source[field] !== "boolean") {
      throw new Error(`Behavioral assurance ${field} must be boolean.`);
    }
  }
  if (source.criticalFailureDisposition !== "incompatible") {
    throw new Error(
      "Behavioral assurance criticalFailureDisposition must be incompatible.",
    );
  }
  if (source.infrastructureErrorsCountAsBehavioralFailure !== false) {
    throw new Error(
      "Infrastructure errors must not count as behavioral failures.",
    );
  }
  if (!isRecord(source.classification)) {
    throw new Error(
      "Behavioral assurance classification must be a JSON object.",
    );
  }

  const classification = source.classification;
  const expectedClassification = {
    compatiblePasses: 3,
    flakyMinimumPasses: 1,
    flakyMaximumPasses: 2,
    incompatiblePasses: 0,
  } as const;
  for (const [field, expected] of Object.entries(
    expectedClassification,
  )) {
    if (classification[field] !== expected) {
      throw new Error(
        `Behavioral assurance classification ${field} must be ${expected}.`,
      );
    }
  }

  return source as unknown as BehavioralAssurancePolicy;
}

export function classifyCompatibility(
  policy: BehavioralAssurancePolicy,
  passCount: number,
  validTrialCount: number,
  criticalFailure = false,
): CompatibilityClassification {
  if (
    !Number.isSafeInteger(passCount) ||
    !Number.isSafeInteger(validTrialCount) ||
    passCount < 0 ||
    validTrialCount < 0 ||
    passCount > validTrialCount
  ) {
    throw new Error("Compatibility evidence counts are invalid.");
  }
  if (criticalFailure) {
    return policy.criticalFailureDisposition;
  }
  if (validTrialCount < policy.baselineTrials) {
    return "unknown";
  }
  if (validTrialCount !== policy.baselineTrials) {
    throw new Error(
      `Compatibility classification requires exactly ${policy.baselineTrials} valid trials.`,
    );
  }
  if (passCount === policy.classification.compatiblePasses) {
    return "compatible";
  }
  if (passCount === policy.classification.incompatiblePasses) {
    return "incompatible";
  }
  if (
    passCount >= policy.classification.flakyMinimumPasses &&
    passCount <= policy.classification.flakyMaximumPasses
  ) {
    return "flaky";
  }

  throw new Error("Compatibility evidence does not match policy.");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
