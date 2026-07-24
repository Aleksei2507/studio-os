import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import {
  classifyCompatibility,
  loadBehavioralAssurancePolicy,
} from "../../scripts/runtime-testing/assurance-policy.ts";

function writePolicy(root: string, overrides: Record<string, unknown> = {}): void {
  const policyDirectory = path.join(root, "tests", "runtime");
  mkdirSync(policyDirectory, { recursive: true });
  writeFileSync(
    path.join(policyDirectory, "behavioral-policy.json"),
    `${JSON.stringify(
      {
        version: 1,
        automaticRetries: 0,
        baselineTrials: 3,
        exploratoryScenarioLimit: 10,
        requireExplicitCostConfirmation: true,
        requireExplicitModelIdentity: true,
        fullSuiteRequiresExplicitAll: true,
        classification: {
          compatiblePasses: 3,
          flakyMinimumPasses: 1,
          flakyMaximumPasses: 2,
          incompatiblePasses: 0,
        },
        criticalFailureDisposition: "incompatible",
        infrastructureErrorsCountAsBehavioralFailure: false,
        remoteProjectDataRequiresExplicitAuthorization: true,
        ...overrides,
      },
      null,
      2,
    )}\n`,
  );
}

describe("behavioral assurance policy contract", () => {
  it("loads the checked-in policy and classifies three-trial evidence", () => {
    const policy = loadBehavioralAssurancePolicy(process.cwd());

    assert.equal(policy.automaticRetries, 0);
    assert.equal(classifyCompatibility(policy, 3, 3), "compatible");
    assert.equal(classifyCompatibility(policy, 2, 3), "flaky");
    assert.equal(classifyCompatibility(policy, 1, 3), "flaky");
    assert.equal(classifyCompatibility(policy, 0, 3), "incompatible");
    assert.equal(classifyCompatibility(policy, 1, 2), "unknown");
    assert.equal(
      classifyCompatibility(policy, 3, 3, true),
      "incompatible",
    );
  });

  it("rejects policy changes that enable automatic retry sampling", () => {
    const root = mkdtempSync(
      path.join(tmpdir(), "studio-os-assurance-policy-"),
    );
    writePolicy(root, { automaticRetries: 1 });

    assert.throws(
      () => loadBehavioralAssurancePolicy(root),
      /automaticRetries must remain 0/,
    );
  });
});
