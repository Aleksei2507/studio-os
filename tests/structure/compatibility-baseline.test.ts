import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  compatibilityBaselineId,
  compatibilitySuiteId,
  REQUIRED_TRIALS,
  parseCompatibilityBaseline,
} from "../../scripts/compatibility-baseline/contracts.ts";
import { loadCompatibilityBaseline } from "../../scripts/compatibility-baseline/aggregator.ts";

const root = process.cwd();

describe("compatibility baseline structure", () => {
  it("keeps a valid baseline contract at tests/compatibility/baseline.json", () => {
    const baseline = loadCompatibilityBaseline(root);
    assert.equal(baseline.version, 1);
    assert.equal(baseline.baselineId, compatibilityBaselineId);
    assert.equal(baseline.suiteId, compatibilitySuiteId);
    assert.equal(baseline.requiredTrials, REQUIRED_TRIALS);
    assert.ok(baseline.combinations.length > 0, "baseline must have at least one combination");
  });

  it("baseline combination ids are unique and non-empty", () => {
    const baseline = loadCompatibilityBaseline(root);
    const ids = baseline.combinations.map((c) => c.id);
    const unique = new Set(ids);
    assert.equal(ids.length, unique.size, "combination ids must be unique");
    for (const id of ids) {
      assert.ok(id.trim(), "combination id must be non-empty");
    }
  });

  it("baseline engines are restricted to codex or ollama", () => {
    const baseline = loadCompatibilityBaseline(root);
    for (const combo of baseline.combinations) {
      assert.ok(
        combo.engine === "codex" || combo.engine === "ollama",
        `combination ${combo.id} engine must be codex or ollama`,
      );
      assert.ok(combo.executorModel.trim(), `${combo.id} executorModel must be non-empty`);
      assert.ok(combo.judgeModel.trim(), `${combo.id} judgeModel must be non-empty`);
      assert.ok(combo.adapter.trim(), `${combo.id} adapter must be non-empty`);
    }
  });

  it("baseline suiteId matches the accepted critical suite", () => {
    const baseline = loadCompatibilityBaseline(root);
    const suite = JSON.parse(
      readFileSync(
        path.join(root, "tests", "runtime", "critical-suite.json"),
        "utf8",
      ),
    ) as { suiteId: string; scenarios: Array<{ id: string }> };
    assert.equal(
      baseline.suiteId,
      suite.suiteId,
      "baseline suiteId must match critical-suite.json suiteId",
    );
  });

  it("summary.json has valid structure and matches baseline", () => {
    const baseline = loadCompatibilityBaseline(root);
    const summary = JSON.parse(
      readFileSync(
        path.join(root, "tests", "compatibility", "summary.json"),
        "utf8",
      ),
    ) as {
      version: unknown;
      baselineId: unknown;
      suiteId: unknown;
      combinations: Array<{ combinationId: string; scenarios: unknown[] }>;
    };

    assert.equal(summary.version, 1);
    assert.equal(summary.baselineId, baseline.baselineId);
    assert.equal(summary.suiteId, baseline.suiteId);
    assert.equal(
      summary.combinations.length,
      baseline.combinations.length,
      "summary must have one entry per baseline combination",
    );

    const suite = JSON.parse(
      readFileSync(
        path.join(root, "tests", "runtime", "critical-suite.json"),
        "utf8",
      ),
    ) as { scenarios: Array<{ id: string }> };

    for (const combo of summary.combinations) {
      assert.equal(
        combo.scenarios.length,
        suite.scenarios.length,
        `${combo.combinationId} must have one scenario entry per critical scenario`,
      );
    }
  });

  it("exposes deterministic commands for compatibility baseline", () => {
    const packageJson = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    assert.equal(
      packageJson.scripts["test:compatibility:dry"],
      "node --import tsx scripts/check-compatibility-baseline.ts --dry",
    );
    assert.equal(
      packageJson.scripts["test:compatibility:check"],
      "node --import tsx scripts/check-compatibility-baseline.ts",
    );
  });

  it("compatibility baseline section is documented in MANUAL_TESTING.md", () => {
    const manual = readFileSync(
      path.join(root, "docs", "MANUAL_TESTING.md"),
      "utf8",
    );
    assert.match(manual, /## Compatibility Baseline/);
    assert.match(manual, /npm run test:compatibility:dry/);
    assert.match(manual, /npm run test:compatibility:check/);
    assert.match(manual, /--confirm-llm-cost/);
    assert.match(manual, /--trial/);
    assert.match(manual, /o4-mini/);
    assert.match(manual, /llama3\.2/);
    assert.match(manual, /validTrial/);
    assert.match(manual, /workspaceMutationViolation/);
  });
});
