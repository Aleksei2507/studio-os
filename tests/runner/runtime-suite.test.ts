import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import {
  assertBehavioralRunAuthorized,
  buildResultsJson,
  parseArgs,
  runLlmJudgedTests,
} from "../../scripts/run-runtime-tests.ts";
import {
  loadRuntimeSuite,
  runtimeSuiteIdentity,
  selectRuntimeSuiteMembers,
} from "../../scripts/runtime-testing/suite.ts";
import type { RuntimeSuite } from "../../scripts/runtime-testing/suite.ts";

function createRepository(): string {
  const root = mkdtempSync(path.join(tmpdir(), "studio-runtime-suite-"));
  mkdirSync(path.join(root, "tests", "runtime"), { recursive: true });
  return root;
}

function suite(
  scenarioIds = ["critical-two", "critical-one"],
): RuntimeSuite {
  return {
    version: 1,
    suiteId: "test-critical-suite",
    sourcePath: "tests/runtime/critical-suite.json",
    scenarios: scenarioIds.map((id) => ({
      id,
      riskResponsibility: `Product risk owned by ${id}.`,
    })),
  };
}

function writeSuite(
  root: string,
  value: unknown,
  relativePath = "tests/runtime/critical-suite.json",
): string {
  const filePath = path.join(root, relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
  return relativePath;
}

function writeScenario(directory: string, id: string): void {
  writeFileSync(
    path.join(directory, `${id}.md`),
    `---
id: ${id}
title: ${id}
stage: Loader
prompt: Start
expect:
  - routes correctly
tags: [severity:critical]
---
Runtime scenario.
`,
  );
}

describe("runtime critical suites", () => {
  it("loads a strict versioned suite and preserves declared scenario order", () => {
    const root = createRepository();
    const relativePath = writeSuite(root, {
      version: 1,
      suiteId: "test-critical-suite",
      scenarios: [
        {
          id: "critical-two",
          riskResponsibility: "Second critical product risk.",
        },
        {
          id: "critical-one",
          riskResponsibility: "First critical product risk.",
        },
      ],
    });

    const loaded = loadRuntimeSuite(root, relativePath);
    const selected = selectRuntimeSuiteMembers(
      [{ id: "critical-one" }, { id: "critical-two" }],
      loaded,
    );

    assert.equal(loaded.version, 1);
    assert.equal(loaded.suiteId, "test-critical-suite");
    assert.equal(loaded.sourcePath, relativePath);
    assert.deepEqual(
      selected.map((item) => item.id),
      ["critical-two", "critical-one"],
    );
  });

  it("rejects unsafe locations and malformed suite contracts", () => {
    const root = createRepository();
    const outsideRuntime = writeSuite(
      root,
      { version: 1, suiteId: "outside", scenarios: [] },
      "config/critical-suite.json",
    );
    const duplicate = writeSuite(
      root,
      {
        version: 1,
        suiteId: "duplicates",
        scenarios: [
          { id: "same", riskResponsibility: "First risk." },
          { id: "same", riskResponsibility: "Second risk." },
        ],
      },
      "tests/runtime/duplicate.json",
    );
    const missingRisk = writeSuite(
      root,
      {
        version: 1,
        suiteId: "missing-risk",
        scenarios: [{ id: "critical-one" }],
      },
      "tests/runtime/missing-risk.json",
    );

    assert.throws(
      () => loadRuntimeSuite(root, outsideRuntime),
      /inside tests\/runtime/,
    );
    assert.throws(
      () => loadRuntimeSuite(root, path.join(root, duplicate)),
      /repository-relative/,
    );
    assert.throws(
      () => loadRuntimeSuite(root, duplicate),
      /duplicate scenario id/i,
    );
    assert.throws(
      () => loadRuntimeSuite(root, missingRisk),
      /riskResponsibility/,
    );
  });

  it("fails closed when a declared scenario is missing or ambiguous", () => {
    assert.throws(
      () =>
        selectRuntimeSuiteMembers(
          [{ id: "critical-one" }],
          suite(),
        ),
      /missing.*critical-two/i,
    );
    assert.throws(
      () =>
        selectRuntimeSuiteMembers(
          [
            { id: "critical-one", source: "a" },
            { id: "critical-one", source: "b" },
            { id: "critical-two", source: "c" },
          ],
          suite(),
        ),
      /duplicate.*critical-one/i,
    );
  });

  it("treats --suite as an exclusive bounded behavioral selector", () => {
    const selected = parseArgs([
      "--confirm-llm-cost",
      "--suite",
      "tests/runtime/critical-suite.json",
    ]);
    const conflicting = ["--id", "--tag", "--max-tests", "--all"];

    assert.equal(selected.suite, "tests/runtime/critical-suite.json");
    assert.doesNotThrow(() =>
      assertBehavioralRunAuthorized(selected, undefined, suite()),
    );

    for (const option of conflicting) {
      const args = [
        "--confirm-llm-cost",
        "--suite",
        "tests/runtime/critical-suite.json",
        option,
      ];
      if (option !== "--all") {
        args.push(option === "--max-tests" ? "1" : "value");
      }
      assert.throws(
        () =>
          assertBehavioralRunAuthorized(
            parseArgs(args),
            undefined,
            suite(),
          ),
        /cannot be combined/i,
      );
    }
    assert.throws(
      () =>
        parseArgs([
          "--suite",
          "tests/runtime/critical-suite.json",
          "--tests-dir",
          "tests/alternate-runtime",
        ]),
      /canonical tests\/runtime/,
    );
  });

  it("keeps a suite within the exploratory scenario budget", () => {
    const options = parseArgs([
      "--confirm-llm-cost",
      "--suite",
      "tests/runtime/critical-suite.json",
    ]);
    const oversized = suite(
      Array.from({ length: 11 }, (_, index) => `critical-${index + 1}`),
    );

    assert.throws(
      () => assertBehavioralRunAuthorized(options, undefined, oversized),
      /at most 10/,
    );
  });

  it("executes suite scenarios sequentially without attaching risk answers", async () => {
    const root = createRepository();
    const testsDirectory = path.join(root, "tests", "runtime");
    writeScenario(testsDirectory, "critical-one");
    writeScenario(testsDirectory, "critical-two");

    const judgedIds: string[] = [];
    const observedScenarios: unknown[] = [];
    const results = await runLlmJudgedTests(
      testsDirectory,
      {
        async judge(test) {
          judgedIds.push(test.id);
          observedScenarios.push(test);
          return {
            filePath: test.filePath,
            id: test.id,
            title: test.title,
            stage: test.stage,
            status: "PASS",
            details: ["Passed."],
          };
        },
      },
      { suite: suite() },
    );

    assert.deepEqual(judgedIds, ["critical-two", "critical-one"]);
    assert.equal(results.length, 2);
    assert.equal(
      JSON.stringify(observedScenarios).includes("Product risk owned by"),
      false,
    );
  });

  it("records portable suite identity in behavioral evidence", () => {
    const selectedSuite = suite();
    const report = buildResultsJson(
      [
        {
          filePath: "tests/runtime/critical-one.md",
          id: "critical-one",
          title: "Critical one",
          stage: "Loader",
          status: "PASS",
          details: ["Passed."],
          turnCount: 1,
          validTrial: true,
        },
      ],
      "runtime-judge",
      undefined,
      runtimeSuiteIdentity(selectedSuite),
    ) as {
      run: {
        suite: {
          suiteId: string;
          version: number;
          sourcePath: string;
          scenarioCount: number;
        };
      };
    };

    assert.deepEqual(report.run.suite, {
      suiteId: "test-critical-suite",
      version: 1,
      sourcePath: "tests/runtime/critical-suite.json",
      scenarioCount: 2,
    });
  });
});
