import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import {
  aggregateCompatibilityResults,
  loadCompatibilityBaseline,
  loadTrialRecords,
  summarizeCompatibilityResults,
} from "../../scripts/compatibility-baseline/aggregator.ts";
import {
  classifyCompatibility,
  compatibilityBaselineId,
  compatibilitySuiteId,
  overallCombinationClassification,
  parseCompatibilityBaseline,
  parseCompatibilityTrialRecord,
  REQUIRED_TRIALS,
} from "../../scripts/compatibility-baseline/contracts.ts";
import type {
  CompatibilityTrialRecord,
} from "../../scripts/compatibility-baseline/contracts.ts";
import { parseArgs, run } from "../../scripts/check-compatibility-baseline.ts";

const SCENARIO_IDS = [
  "bootstrap-001-explicit-greenfield-activation",
  "bootstrap-002-nested-plugin-root-resolution",
  "fixture-001-brownfield-project-memory",
  "fixture-002-existing-project-routing-replay",
  "fixture-003-greenfield-interview-replay",
  "fixture-004-incomplete-milestone-after-qa",
  "interaction-006-language-agnostic",
  "regression-010-project-local-file-references",
  "release-003-explicit-authorization",
  "release-005-milestone-requires-product-outcome",
];

const revision = "a".repeat(40);

function baselineValue(): Record<string, unknown> {
  return {
    version: 1,
    baselineId: compatibilityBaselineId,
    suiteId: compatibilitySuiteId,
    requiredTrials: REQUIRED_TRIALS,
    combinations: [
      {
        id: "remote-o4-mini",
        description: "Remote baseline",
        engine: "codex",
        executorModel: "o4-mini",
        judgeModel: "o4-mini",
        adapter: "codex-cli:o4-mini",
      },
      {
        id: "local-llama3.2",
        description: "Local baseline",
        engine: "ollama",
        executorModel: "llama3.2",
        judgeModel: "llama3.2",
        adapter: "ollama:llama3.2",
      },
    ],
  };
}

function trialRecord(
  overrides: Partial<CompatibilityTrialRecord> = {},
): CompatibilityTrialRecord {
  const base: CompatibilityTrialRecord = {
    version: 1,
    baselineId: compatibilityBaselineId,
    combinationId: "remote-o4-mini",
    scenarioId: "bootstrap-001-explicit-greenfield-activation",
    trialNumber: 1,
    studioOsVersion: "0.5.0-alpha.4",
    studioOsRevision: revision,
    workingTreeDirty: false,
    engine: "codex",
    executorModelExact: "o4-mini",
    judgeModelExact: "o4-mini",
    executedAt: "2026-08-07T10:00:00Z",
    validTrial: true,
    status: "PASS",
    workspaceMutationViolation: false,
  };
  return { ...base, ...overrides };
}

function createTestRepository(): string {
  const root = mkdtempSync(path.join(tmpdir(), "studio-compat-test-"));
  mkdirSync(path.join(root, "tests", "compatibility"), { recursive: true });
  mkdirSync(path.join(root, "tests", "runtime"), { recursive: true });
  mkdirSync(path.join(root, "test-results", "compatibility"), {
    recursive: true,
  });
  writeFileSync(
    path.join(root, "tests", "compatibility", "baseline.json"),
    JSON.stringify(baselineValue(), null, 2),
  );
  writeFileSync(
    path.join(root, "tests", "runtime", "critical-suite.json"),
    JSON.stringify({
      version: 1,
      suiteId: compatibilitySuiteId,
      scenarios: SCENARIO_IDS.map((id) => ({ id, riskResponsibility: "test" })),
    }),
  );
  return root;
}

function writeTrialRecord(
  root: string,
  runId: string,
  fileName: string,
  record: CompatibilityTrialRecord,
): void {
  const runDir = path.join(root, "test-results", "compatibility", runId);
  mkdirSync(runDir, { recursive: true });
  writeFileSync(
    path.join(runDir, fileName),
    JSON.stringify(record),
  );
}

describe("classifyCompatibility", () => {
  it("returns Compatible for 3 of 3 PASS", () => {
    assert.equal(classifyCompatibility(3, 3, false), "Compatible");
  });

  it("returns Flaky for 1 of 3 PASS", () => {
    assert.equal(classifyCompatibility(1, 3, false), "Flaky");
  });

  it("returns Flaky for 2 of 3 PASS", () => {
    assert.equal(classifyCompatibility(2, 3, false), "Flaky");
  });

  it("returns Incompatible for 0 of 3 PASS", () => {
    assert.equal(classifyCompatibility(0, 3, false), "Incompatible");
  });

  it("returns Unknown when fewer than 3 valid trials", () => {
    assert.equal(classifyCompatibility(2, 2, false), "Unknown");
    assert.equal(classifyCompatibility(0, 0, false), "Unknown");
  });

  it("returns Incompatible immediately on workspace mutation violation", () => {
    assert.equal(classifyCompatibility(3, 3, true), "Incompatible");
    assert.equal(classifyCompatibility(0, 0, true), "Incompatible");
  });
});

describe("overallCombinationClassification", () => {
  it("returns Incompatible when any scenario is Incompatible", () => {
    assert.equal(
      overallCombinationClassification([
        { scenarioId: "a", classification: "Compatible", validTrials: 3, passedTrials: 3, failedTrials: 0, invalidTrials: 0, workspaceMutationViolation: false },
        { scenarioId: "b", classification: "Incompatible", validTrials: 3, passedTrials: 0, failedTrials: 3, invalidTrials: 0, workspaceMutationViolation: false },
      ]),
      "Incompatible",
    );
  });

  it("returns Flaky when any scenario is Flaky and none Incompatible", () => {
    assert.equal(
      overallCombinationClassification([
        { scenarioId: "a", classification: "Compatible", validTrials: 3, passedTrials: 3, failedTrials: 0, invalidTrials: 0, workspaceMutationViolation: false },
        { scenarioId: "b", classification: "Flaky", validTrials: 3, passedTrials: 1, failedTrials: 2, invalidTrials: 0, workspaceMutationViolation: false },
      ]),
      "Flaky",
    );
  });

  it("returns Unknown when any scenario is Unknown and none Incompatible or Flaky", () => {
    assert.equal(
      overallCombinationClassification([
        { scenarioId: "a", classification: "Compatible", validTrials: 3, passedTrials: 3, failedTrials: 0, invalidTrials: 0, workspaceMutationViolation: false },
        { scenarioId: "b", classification: "Unknown", validTrials: 0, passedTrials: 0, failedTrials: 0, invalidTrials: 0, workspaceMutationViolation: false },
      ]),
      "Unknown",
    );
  });

  it("returns Compatible when all scenarios are Compatible", () => {
    assert.equal(
      overallCombinationClassification([
        { scenarioId: "a", classification: "Compatible", validTrials: 3, passedTrials: 3, failedTrials: 0, invalidTrials: 0, workspaceMutationViolation: false },
        { scenarioId: "b", classification: "Compatible", validTrials: 3, passedTrials: 3, failedTrials: 0, invalidTrials: 0, workspaceMutationViolation: false },
      ]),
      "Compatible",
    );
  });
});

describe("parseCompatibilityBaseline", () => {
  it("parses a valid baseline", () => {
    const baseline = parseCompatibilityBaseline(baselineValue(), "tests/compatibility/baseline.json");
    assert.equal(baseline.version, 1);
    assert.equal(baseline.baselineId, compatibilityBaselineId);
    assert.equal(baseline.combinations.length, 2);
  });

  it("rejects wrong version", () => {
    assert.throws(
      () => parseCompatibilityBaseline({ ...baselineValue(), version: 2 }, "x.json"),
      /version must be 1/,
    );
  });

  it("rejects duplicate combination ids", () => {
    const value = baselineValue();
    (value.combinations as unknown[]).push({
      id: "remote-o4-mini",
      description: "dup",
      engine: "codex",
      executorModel: "o4-mini",
      judgeModel: "o4-mini",
      adapter: "codex-cli:o4-mini",
    });
    assert.throws(
      () => parseCompatibilityBaseline(value, "x.json"),
      /Duplicate/,
    );
  });

  it("rejects unknown engine", () => {
    const value = baselineValue();
    (value.combinations as Array<Record<string, unknown>>)[0].engine = "gpt4";
    assert.throws(
      () => parseCompatibilityBaseline(value, "x.json"),
      /engine must be one of/,
    );
  });
});

describe("parseCompatibilityTrialRecord", () => {
  it("parses a valid trial record", () => {
    const record = parseCompatibilityTrialRecord(trialRecord());
    assert.equal(record.version, 1);
    assert.equal(record.validTrial, true);
    assert.equal(record.status, "PASS");
  });

  it("rejects invalid trial without invalidReason", () => {
    assert.throws(
      () =>
        parseCompatibilityTrialRecord(
          trialRecord({ validTrial: false, status: undefined }),
        ),
      /invalidReason/,
    );
  });

  it("rejects studioOsRevision that is not 40-char hex", () => {
    assert.throws(
      () =>
        parseCompatibilityTrialRecord(
          trialRecord({ studioOsRevision: "abc123" }),
        ),
      /40-character/,
    );
  });

  it("rejects unknown engine", () => {
    assert.throws(
      () =>
        parseCompatibilityTrialRecord({
          ...trialRecord(),
          engine: "gpt4",
        } as unknown as CompatibilityTrialRecord),
      /engine must be/,
    );
  });
});

describe("loadTrialRecords", () => {
  it("returns empty array when trials directory does not exist", () => {
    const root = createTestRepository();
    const records = loadTrialRecords(
      path.join(root, "test-results", "compatibility", "nonexistent"),
    );
    assert.deepEqual(records, []);
  });

  it("reads trial records from run subdirectories", () => {
    const root = createTestRepository();
    writeTrialRecord(root, "run-001", "trial-1.json", trialRecord({ trialNumber: 1 }));
    writeTrialRecord(root, "run-001", "trial-2.json", trialRecord({ trialNumber: 2 }));
    writeTrialRecord(root, "run-001", "trial-3.json", trialRecord({ trialNumber: 3 }));

    const records = loadTrialRecords(
      path.join(root, "test-results", "compatibility"),
    );
    assert.equal(records.length, 3);
  });

  it("rejects a malformed trial record", () => {
    const root = createTestRepository();
    const runDir = path.join(root, "test-results", "compatibility", "run-bad");
    mkdirSync(runDir, { recursive: true });
    writeFileSync(path.join(runDir, "bad.json"), JSON.stringify({ version: 2 }));
    assert.throws(
      () => loadTrialRecords(path.join(root, "test-results", "compatibility")),
      /Trial record/,
    );
  });
});

describe("aggregateCompatibilityResults", () => {
  it("produces Unknown for all scenarios when no trials exist", () => {
    const root = createTestRepository();
    const baseline = loadCompatibilityBaseline(root);
    const summary = aggregateCompatibilityResults(baseline, [], SCENARIO_IDS);

    assert.equal(summary.version, 1);
    assert.equal(summary.baselineId, compatibilityBaselineId);
    assert.equal(summary.combinations.length, 2);
    for (const combo of summary.combinations) {
      assert.equal(combo.overallClassification, "Unknown");
      for (const scenario of combo.scenarios) {
        assert.equal(scenario.classification, "Unknown");
        assert.equal(scenario.validTrials, 0);
      }
    }
  });

  it("classifies Compatible when all 3 trials PASS", () => {
    const root = createTestRepository();
    const baseline = loadCompatibilityBaseline(root);
    const scenarioId = SCENARIO_IDS[0];

    const trials = [1, 2, 3].map((n) =>
      trialRecord({ trialNumber: n, scenarioId }),
    );
    const summary = aggregateCompatibilityResults(
      baseline,
      trials,
      [scenarioId],
    );
    const combo = summary.combinations[0];
    assert.equal(combo.scenarios[0].classification, "Compatible");
    assert.equal(combo.scenarios[0].validTrials, 3);
    assert.equal(combo.scenarios[0].passedTrials, 3);
  });

  it("classifies Flaky when 1 of 3 trials PASS", () => {
    const root = createTestRepository();
    const baseline = loadCompatibilityBaseline(root);
    const scenarioId = SCENARIO_IDS[0];

    const trials = [
      trialRecord({ trialNumber: 1, scenarioId, status: "PASS" }),
      trialRecord({ trialNumber: 2, scenarioId, status: "FAIL" }),
      trialRecord({ trialNumber: 3, scenarioId, status: "FAIL" }),
    ];
    const summary = aggregateCompatibilityResults(baseline, trials, [scenarioId]);
    assert.equal(summary.combinations[0].scenarios[0].classification, "Flaky");
  });

  it("classifies Incompatible immediately on workspace mutation violation", () => {
    const root = createTestRepository();
    const baseline = loadCompatibilityBaseline(root);
    const scenarioId = SCENARIO_IDS[0];

    const trials = [
      trialRecord({ trialNumber: 1, scenarioId, status: "PASS", workspaceMutationViolation: true }),
    ];
    const summary = aggregateCompatibilityResults(baseline, trials, [scenarioId]);
    assert.equal(
      summary.combinations[0].scenarios[0].classification,
      "Incompatible",
    );
  });

  it("keeps invalid trials separate from valid trial count", () => {
    const root = createTestRepository();
    const baseline = loadCompatibilityBaseline(root);
    const scenarioId = SCENARIO_IDS[0];

    const trials = [
      trialRecord({ trialNumber: 1, scenarioId, status: "PASS" }),
      { ...trialRecord({ trialNumber: 2, scenarioId }), validTrial: false, status: undefined, invalidReason: "timeout" } as unknown as CompatibilityTrialRecord,
    ];
    const parsed = trials.map((t) => parseCompatibilityTrialRecord(t));
    const summary = aggregateCompatibilityResults(baseline, parsed, [scenarioId]);
    const scenario = summary.combinations[0].scenarios[0];
    assert.equal(scenario.validTrials, 1);
    assert.equal(scenario.invalidTrials, 1);
    assert.equal(scenario.classification, "Unknown");
  });
});

describe("summarizeCompatibilityResults", () => {
  it("returns FAIL when Unknown scenarios exist", () => {
    const root = createTestRepository();
    const baseline = loadCompatibilityBaseline(root);
    const summary = aggregateCompatibilityResults(baseline, [], SCENARIO_IDS);
    const result = summarizeCompatibilityResults(summary);
    assert.equal(result.status, "FAIL");
    assert.ok(result.unknownCount > 0);
  });
});

describe("parseArgs", () => {
  it("defaults to dry=false with standard paths", () => {
    const opts = parseArgs([]);
    assert.equal(opts.dry, false);
    assert.equal(opts.baseline, "tests/compatibility/baseline.json");
    assert.equal(opts.trialsDir, "test-results/compatibility");
  });

  it("parses --dry flag", () => {
    const opts = parseArgs(["--dry"]);
    assert.equal(opts.dry, true);
  });

  it("parses --trials and --output", () => {
    const opts = parseArgs([
      "--trials",
      "test-results/compatibility/run-001",
      "--output",
      "tests/compatibility/summary.json",
    ]);
    assert.equal(opts.trialsDir, "test-results/compatibility/run-001");
  });

  it("rejects --dry combined with --trials", () => {
    assert.throws(
      () => parseArgs(["--dry", "--trials", "some/dir"]),
      /--dry cannot be combined with --trials/,
    );
  });

  it("rejects unknown argument", () => {
    assert.throws(() => parseArgs(["--unknown"]), /Unknown argument/);
  });
});

describe("run (dry mode)", () => {
  it("returns 0 for valid baseline", () => {
    const root = createTestRepository();
    const exitCode = run(
      { dry: true, baseline: "tests/compatibility/baseline.json", trialsDir: "test-results/compatibility", output: "tests/compatibility/summary.json", suiteFile: "tests/runtime/critical-suite.json" },
      root,
    );
    assert.equal(exitCode, 0);
  });
});
