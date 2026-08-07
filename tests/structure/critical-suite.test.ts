import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  findMarkdownFiles,
  validateRuntimeTest,
} from "../../scripts/run-runtime-tests.ts";
import {
  loadRuntimeSuite,
  selectRuntimeSuiteMembers,
} from "../../scripts/runtime-testing/suite.ts";
import type {
  RuntimeScenario,
  WorkspaceAssertionSpec,
} from "../../scripts/runtime-testing/contracts.ts";

const root = process.cwd();
const suite = loadRuntimeSuite(root, "tests/runtime/critical-suite.json");
const expectedIds = [
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
const portabilityMarkers = ["/Users/", "/private/", "Downloads/", "file://"];

function loadScenarios(): RuntimeScenario[] {
  return findMarkdownFiles(path.join(root, "tests", "runtime")).map(
    (filePath) =>
      validateRuntimeTest(
        filePath,
        readFileSync(filePath, "utf8"),
        root,
      ),
  );
}

function mutationCheckpoints(
  scenario: RuntimeScenario,
): WorkspaceAssertionSpec[] {
  return [
    scenario.workspace,
    ...(scenario.replay?.turns.map((turn) => turn.workspace) ?? []),
  ].filter(
    (checkpoint): checkpoint is WorkspaceAssertionSpec =>
      checkpoint !== undefined &&
      (checkpoint.assertions.allowedChanges?.length ?? 0) > 0,
  );
}

describe("v0.5 critical lifecycle suite", () => {
  it("keeps exactly the ten accepted scenario responsibilities", () => {
    assert.equal(suite.version, 1);
    assert.equal(suite.suiteId, "v0.5-critical-lifecycle");
    assert.deepEqual(
      suite.scenarios.map((scenario) => scenario.id),
      expectedIds,
    );
    assert.equal(suite.scenarios.length, 10);

    for (const scenario of suite.scenarios) {
      assert.ok(scenario.riskResponsibility.length >= 40);
      assert.equal(scenario.riskResponsibility.includes("\n"), false);
    }
  });

  it("resolves every declared id to one valid Runtime scenario", () => {
    const selected = selectRuntimeSuiteMembers(loadScenarios(), suite);

    assert.deepEqual(
      selected.map((scenario) => scenario.id),
      expectedIds,
    );
  });

  it("keeps critical file mutations bounded, source-preserving, and portable", () => {
    const selected = selectRuntimeSuiteMembers(loadScenarios(), suite);
    const fixtureIds = selected
      .filter((scenario) => scenario.workspace)
      .map((scenario) => scenario.id);

    assert.deepEqual(fixtureIds, [
      "fixture-001-brownfield-project-memory",
      "fixture-002-existing-project-routing-replay",
      "fixture-003-greenfield-interview-replay",
      "fixture-004-incomplete-milestone-after-qa",
    ]);

    for (const scenario of selected) {
      for (const checkpoint of mutationCheckpoints(scenario)) {
        const assertions = checkpoint.assertions;
        const changed = [
          ...(assertions.created ?? []),
          ...(assertions.modified ?? []),
          ...(assertions.deleted ?? []),
        ].sort();

        assert.deepEqual([...(assertions.allowedChanges ?? [])].sort(), changed);
        assert.ok((assertions.unchanged?.length ?? 0) > 0);

        for (const changedPath of changed) {
          const guards = assertions.notContains?.[changedPath] ?? [];
          for (const marker of portabilityMarkers) {
            assert.ok(
              guards.includes(marker),
              `${checkpoint.assertionsFile} must reject ${marker} in ${changedPath}`,
            );
          }
        }
      }
    }
  });

  it("keeps critical confirmation flows as observable replay checkpoints", () => {
    const selected = selectRuntimeSuiteMembers(loadScenarios(), suite);
    const replayScenarios = selected.filter((scenario) => scenario.replay);

    assert.deepEqual(
      replayScenarios.map((scenario) => scenario.id),
      [
        "fixture-002-existing-project-routing-replay",
        "fixture-003-greenfield-interview-replay",
      ],
    );

    for (const scenario of replayScenarios) {
      assert.ok(scenario.workspace);
      assert.equal(scenario.replay?.turns.length, 1);
      assert.ok((scenario.replay?.turns[0].expect.length ?? 0) > 0);
      assert.ok(scenario.replay?.turns[0].workspace);
    }
  });

  it("documents deterministic gates before critical behavioral execution", () => {
    const documentation = readFileSync(
      path.join(root, "docs", "runtime-testing.md"),
      "utf8",
    );
    const runnerGate = documentation.indexOf("npm run test:runner");
    const fullDryGate = documentation.indexOf("npm run test:runtime:dry\n");
    const suiteDryGate = documentation.indexOf(
      "npm run test:runtime:dry -- --suite tests/runtime/critical-suite.json",
    );
    const behavioralRun = documentation.indexOf(
      "--suite tests/runtime/critical-suite.json",
      suiteDryGate + 1,
    );

    assert.ok(runnerGate >= 0);
    assert.ok(fullDryGate > runnerGate);
    assert.ok(suiteDryGate > fullDryGate);
    assert.ok(behavioralRun > suiteDryGate);
    assert.match(
      documentation,
      /cannot be combined with `--id`, `--tag`,\s+`--max-tests`, `--all`, or a custom `--tests-dir`/,
    );
    assert.match(documentation, /risk responsibilities are not sent to the Runtime executor/i);
  });
});
