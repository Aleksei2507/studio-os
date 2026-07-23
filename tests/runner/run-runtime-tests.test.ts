import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  assertBehavioralRunAuthorized,
  buildResultsJson,
  findMarkdownFiles,
  loadRuntimeTests,
  parseArgs,
  parseFrontmatter,
  runLlmJudgedTests,
  summarize,
  writeResultArtifacts,
} from "../../scripts/run-runtime-tests.ts";

describe("runtime regression runner", () => {
  it("parses YAML frontmatter and preserves the markdown body", () => {
    const parsed = parseFrontmatter(`---
id: loader-basic
title: Loader basic routing
stage: loader
prompt: Start a new project
expect:
  - asks for project goal
tags: [loader, greenfield]
---
# Scenario

User starts a project.`);

    assert.equal(parsed.frontmatter.id, "loader-basic");
    assert.deepEqual(parsed.frontmatter.expect, ["asks for project goal"]);
    assert.equal(parsed.body, "# Scenario\n\nUser starts a project.");
  });

  it("dry mode passes structurally valid runtime tests", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "studio-runtime-tests-"));
    mkdirSync(path.join(directory, "nested"));
    writeFileSync(
      path.join(directory, "nested", "loader-basic.md"),
      `---
id: loader-basic
title: Loader basic routing
stage: loader
prompt: Start a new project
expect:
  - asks for project goal
---
User starts a project.
`,
    );

    const results = loadRuntimeTests(directory);

    assert.equal(results.length, 1);
    assert.equal(results[0].status, "PASS");
    assert.equal(summarize(results), "PASS");
  });

  it("dry mode fails invalid runtime tests", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "studio-runtime-tests-"));
    writeFileSync(
      path.join(directory, "invalid.md"),
      `---
id: invalid
title: Invalid test
stage: loader
---
Missing prompt and expectations.
`,
    );

    const results = loadRuntimeTests(directory);

    assert.equal(results.length, 1);
    assert.equal(results[0].status, "FAIL");
    assert.equal(summarize(results), "FAIL");
  });

  it("dry mode reports partial when no runtime tests exist yet", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "studio-runtime-tests-"));

    const results = loadRuntimeTests(directory);

    assert.equal(results.length, 1);
    assert.equal(results[0].status, "PARTIAL");
    assert.equal(summarize(results), "PARTIAL");
  });

  it("ignores README files in runtime test discovery", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "studio-runtime-tests-"));
    writeFileSync(path.join(directory, "README.md"), "# Runtime tests\n");
    writeFileSync(
      path.join(directory, "valid.md"),
      `---
id: valid
title: Valid test
stage: loader
prompt: Start
expect:
  - routes correctly
---
Runtime scenario.
`,
    );

    const files = findMarkdownFiles(directory);

    assert.equal(files.length, 1);
    assert.equal(path.basename(files[0]), "valid.md");
  });

  it("LLM mode executes an injected Runtime judge", async () => {
    const directory = mkdtempSync(path.join(tmpdir(), "studio-runtime-tests-"));
    writeFileSync(
      path.join(directory, "valid.md"),
      `---
id: valid
title: Valid test
stage: discovery
prompt: Discover requirements
expect:
  - asks one question
---
User asks to build a product.
`,
    );

    const results = await runLlmJudgedTests(directory, {
      async judge(test) {
        return {
          filePath: test.filePath,
          id: test.id,
          title: test.title,
          stage: test.stage,
          status: "PASS",
          details: ["Injected judge passed."],
        };
      },
    });

    assert.equal(results[0].status, "PASS");
    assert.equal(summarize(results), "PASS");
  });

  it("requires explicit LLM cost confirmation for behavioral runs", () => {
    const unconfirmed = parseArgs([]);
    const dry = parseArgs(["--dry"]);
    const unbounded = parseArgs(["--confirm-llm-cost"]);
    const confirmed = parseArgs(["--confirm-llm-cost", "--max-tests", "1"]);
    const full = parseArgs(["--confirm-llm-cost", "--all"]);
    const conflicting = parseArgs([
      "--confirm-llm-cost",
      "--all",
      "--max-tests",
      "1",
    ]);

    assert.throws(
      () => assertBehavioralRunAuthorized(unconfirmed),
      /--confirm-llm-cost/,
    );
    assert.throws(
      () => assertBehavioralRunAuthorized(unbounded),
      /--all/,
    );
    assert.throws(
      () => assertBehavioralRunAuthorized(conflicting),
      /cannot be combined/,
    );
    assert.doesNotThrow(() => assertBehavioralRunAuthorized(dry));
    assert.doesNotThrow(() => assertBehavioralRunAuthorized(confirmed));
    assert.doesNotThrow(() => assertBehavioralRunAuthorized(full));
  });

  it("parses bounded behavioral-run options", () => {
    const options = parseArgs([
      "--confirm-llm-cost",
      "--id",
      "bootstrap-001",
      "--tag",
      "severity:critical",
      "--max-tests",
      "3",
      "--model",
      "executor-model",
      "--judge-model",
      "judge-model",
      "--timeout-ms",
      "60000",
    ]);

    assert.equal(options.confirmLlmCost, true);
    assert.deepEqual(options.ids, ["bootstrap-001"]);
    assert.deepEqual(options.tags, ["severity:critical"]);
    assert.equal(options.maxTests, 3);
    assert.equal(options.model, "executor-model");
    assert.equal(options.judgeModel, "judge-model");
    assert.equal(options.timeoutMs, 60_000);
    assert.equal(options.runAll, false);
  });

  it("runs selected Runtime scenarios sequentially", async () => {
    const directory = mkdtempSync(path.join(tmpdir(), "studio-runtime-tests-"));
    for (const [id, tag] of [
      ["critical-one", "severity:critical"],
      ["critical-two", "severity:critical"],
      ["low-risk", "severity:low"],
    ]) {
      writeFileSync(
        path.join(directory, `${id}.md`),
        `---
id: ${id}
title: ${id}
stage: Loader
prompt: Start
expect:
  - routes correctly
tags: [${tag}]
---
Runtime scenario.
`,
      );
    }

    let active = 0;
    let maximumActive = 0;
    const judgedIds: string[] = [];
    const results = await runLlmJudgedTests(
      directory,
      {
        async judge(test) {
          active += 1;
          maximumActive = Math.max(maximumActive, active);
          judgedIds.push(test.id);
          await new Promise((resolve) => setTimeout(resolve, 2));
          active -= 1;
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
      {
        tags: ["severity:critical"],
        maxTests: 2,
      },
    );

    assert.equal(maximumActive, 1);
    assert.deepEqual(judgedIds, ["critical-one", "critical-two"]);
    assert.equal(results.length, 2);
  });

  it("marks behavioral reports as executed and LLM-judged", () => {
    const report = buildResultsJson(
      [
        {
          filePath: "tests/runtime/bootstrap/001.md",
          id: "bootstrap-001",
          title: "Bootstrap",
          stage: "Bootstrap",
          status: "PASS",
          details: ["Passed."],
        },
      ],
      "runtime-judge",
    ) as {
      run: {
        executesStudioOs: boolean;
        usesLlmJudge: boolean;
      };
    };

    assert.equal(report.run.executesStudioOs, true);
    assert.equal(report.run.usesLlmJudge, true);
  });

  it("writes latest markdown summary and machine-readable JSON results", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "studio-runtime-results-"));
    const outputDir = path.join(directory, "test-results", "latest");

    writeResultArtifacts(
      [
        {
          filePath: "tests/runtime/loader/001-greenfield-start.md",
          id: "loader-001-greenfield-start",
          title: "Greenfield start",
          stage: "Loader",
          status: "PASS",
          details: ["2 expectation(s), stage: Loader"],
          evaluation: {
            status: "PASS",
            details: ["All expectations met."],
            execution: {
              adapter: "fake-runtime",
              response: "What outcome should this product create?",
              durationMs: 10,
            },
            verdict: {
              adapter: "fake-judge",
              status: "PASS",
              summary: "All expectations met.",
              expectations: [
                {
                  expectation: "asks one focused question",
                  met: true,
                  evidence: "The response asks one question.",
                },
              ],
              durationMs: 5,
            },
          },
        },
        {
          filePath: "tests/runtime/planning/invalid.md",
          id: "invalid.md",
          title: "Invalid runtime test",
          stage: "unknown",
          status: "FAIL",
          details: ["Missing required field: prompt"],
        },
      ],
      outputDir,
    );

    const summaryPath = path.join(outputDir, "summary.md");
    const resultsPath = path.join(outputDir, "results.json");
    const evaluationPath = path.join(
      outputDir,
      "evaluations",
      "loader-001-greenfield-start.json",
    );
    const summary = readFileSync(summaryPath, "utf8");
    const results = JSON.parse(readFileSync(resultsPath, "utf8"));
    const evaluation = JSON.parse(readFileSync(evaluationPath, "utf8"));

    assert.equal(existsSync(summaryPath), true);
    assert.equal(existsSync(resultsPath), true);
    assert.equal(existsSync(evaluationPath), true);
    assert.match(summary, /Total tests: 2/);
    assert.match(summary, /Mode: Scenario definition validation/);
    assert.match(summary, /does not execute or judge Studio OS responses/);
    assert.match(summary, /Pass: 1/);
    assert.match(summary, /Fail: 1/);
    assert.match(summary, /loader-001-greenfield-start/);
    assert.equal(results.summary.total, 2);
    assert.equal(results.run.mode, "scenario-structure");
    assert.equal(results.run.executesStudioOs, false);
    assert.equal(results.run.usesLlmJudge, false);
    assert.equal(results.summary.pass, 1);
    assert.equal(results.summary.fail, 1);
    assert.equal(results.tests[0].stage, "Loader");
    assert.equal(evaluation.execution.adapter, "fake-runtime");
    assert.equal(evaluation.verdict.adapter, "fake-judge");
  });
});
