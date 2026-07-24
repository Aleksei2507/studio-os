import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

interface BehavioralPolicy {
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
  criticalFailureDisposition: string;
  infrastructureErrorsCountAsBehavioralFailure: boolean;
  remoteProjectDataRequiresExplicitAuthorization: boolean;
}

const root = process.cwd();
const read = (relativePath: string): string =>
  readFileSync(path.join(root, relativePath), "utf8");
const policy = JSON.parse(
  read("tests/runtime/behavioral-policy.json"),
) as BehavioralPolicy;

describe("Runtime behavioral assurance policy", () => {
  it("keeps retries, trial count, and classifications deterministic", () => {
    assert.equal(policy.version, 1);
    assert.equal(policy.automaticRetries, 0);
    assert.equal(policy.baselineTrials, 3);
    assert.equal(policy.classification.compatiblePasses, 3);
    assert.equal(policy.classification.flakyMinimumPasses, 1);
    assert.equal(policy.classification.flakyMaximumPasses, 2);
    assert.equal(policy.classification.incompatiblePasses, 0);
    assert.equal(policy.criticalFailureDisposition, "incompatible");
    assert.equal(
      policy.infrastructureErrorsCountAsBehavioralFailure,
      false,
    );
  });

  it("requires bounded, identified, and authorized behavioral runs", () => {
    assert.equal(policy.exploratoryScenarioLimit, 10);
    assert.equal(policy.requireExplicitCostConfirmation, true);
    assert.equal(policy.requireExplicitModelIdentity, true);
    assert.equal(policy.fullSuiteRequiresExplicitAll, true);
    assert.equal(
      policy.remoteProjectDataRequiresExplicitAuthorization,
      true,
    );
  });

  it("documents evidence ownership without retrying until pass", () => {
    const documentation = read("docs/BEHAVIORAL_ASSURANCE.md");

    assert.match(documentation, /Policy Version: 1/);
    assert.match(documentation, /must not automatically retry/i);
    assert.match(documentation, /3 of 3 trials PASS/);
    assert.match(documentation, /1 or 2 of 3 trials PASS/);
    assert.match(documentation, /0 of 3 trials PASS/);
    assert.match(documentation, /Repository defect/);
    assert.match(documentation, /Harness defect/);
    assert.match(documentation, /Model incompatibility/);
    assert.match(documentation, /Judge incompatibility/);
    assert.match(documentation, /`validTrial: false`/);
    assert.match(documentation, /explicit authorization/i);
    assert.match(documentation, /Do not weaken a scenario/i);
  });
});
