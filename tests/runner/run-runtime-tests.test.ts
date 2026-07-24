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
  resolveResultOutputDirectory,
  runLlmJudgedTests,
  summarize,
  validateRuntimeTest,
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

  it("loads fixture and workspace assertion contracts without exposing them as response expectations", () => {
    const repositoryRoot = mkdtempSync(
      path.join(tmpdir(), "studio-runtime-fixture-definition-"),
    );
    mkdirSync(path.join(repositoryRoot, "fixtures", "input"), {
      recursive: true,
    });
    writeFileSync(
      path.join(repositoryRoot, "fixtures", "input", "package.json"),
      '{"name":"fixture"}\n',
    );
    writeFileSync(
      path.join(repositoryRoot, "fixtures", "assertions.json"),
      JSON.stringify({
        version: 1,
        created: [".studio/project-state.md"],
        allowedChanges: [".studio/project-state.md"],
      }),
    );

    const test = validateRuntimeTest(
      path.join(repositoryRoot, "scenario.md"),
      `---
id: fixture-basic
title: Fixture basic
stage: Brownfield Onboarding
prompt: Onboard this project
expect:
  - reports onboarding completion
fixture: fixtures/input
workspace_assertions: fixtures/assertions.json
---
The physical project fixture is authoritative.
`,
      repositoryRoot,
    );

    assert.equal(test.workspace?.assertions.version, 1);
    assert.deepEqual(test.expect, ["reports onboarding completion"]);
    assert.equal(
      test.workspace?.assertions.created?.includes(
        ".studio/project-state.md",
      ),
      true,
    );
  });

  it("loads replay turns and reports their total without merging expectations", () => {
    const repositoryRoot = mkdtempSync(
      path.join(tmpdir(), "studio-runtime-replay-definition-"),
    );
    mkdirSync(path.join(repositoryRoot, "fixtures", "input"), {
      recursive: true,
    });
    writeFileSync(
      path.join(repositoryRoot, "fixtures", "input", "project.md"),
      "# Project\n",
    );
    writeFileSync(
      path.join(repositoryRoot, "fixtures", "first.json"),
      JSON.stringify({
        version: 1,
        unchanged: ["project.md"],
        allowedChanges: [],
      }),
    );
    writeFileSync(
      path.join(repositoryRoot, "fixtures", "second.json"),
      JSON.stringify({
        version: 1,
        modified: ["project.md"],
        allowedChanges: ["project.md"],
      }),
    );
    writeFileSync(
      path.join(repositoryRoot, "fixtures", "replay.json"),
      JSON.stringify({
        version: 1,
        turns: [
          {
            id: "confirm",
            prompt: "Apply the proposed update.",
            expect: ["Confirms the update."],
            workspace_assertions: "fixtures/second.json",
          },
        ],
      }),
    );
    const scenarioPath = path.join(repositoryRoot, "scenario.md");
    const source = `---
id: fixture-replay
title: Fixture replay
stage: Loader
prompt: Review current state
expect:
  - proposes an update
fixture: fixtures/input
workspace_assertions: fixtures/first.json
replay: fixtures/replay.json
---
An existing project is resumed.
`;
    writeFileSync(scenarioPath, source);

    const test = validateRuntimeTest(
      scenarioPath,
      source,
      repositoryRoot,
    );
    const results = loadRuntimeTests(repositoryRoot, repositoryRoot);

    assert.equal(test.expect.length, 1);
    assert.equal(test.replay?.turns.length, 1);
    assert.deepEqual(test.replay?.turns[0].expect, [
      "Confirms the update.",
    ]);
    assert.match(
      results
        .find((result) => result.id === "fixture-replay")
        ?.details.join("\n") ?? "",
      /2 turn\(s\)/,
    );
  });

  it("rejects an incomplete fixture declaration", () => {
    assert.throws(
      () =>
        validateRuntimeTest(
          "scenario.md",
          `---
id: fixture-invalid
title: Fixture invalid
stage: Brownfield Onboarding
prompt: Onboard this project
expect:
  - reports onboarding completion
fixture: fixtures/input
---
The physical project fixture is authoritative.
`,
        ),
      /workspace_assertions/,
    );
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
      "--engine",
      "ollama",
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
      "--trial",
      "2",
      "--output-dir",
      "test-results/baselines/local/trial-2",
    ]);

    assert.equal(options.confirmLlmCost, true);
    assert.equal(options.engine, "ollama");
    assert.deepEqual(options.ids, ["bootstrap-001"]);
    assert.deepEqual(options.tags, ["severity:critical"]);
    assert.equal(options.maxTests, 3);
    assert.equal(options.model, "executor-model");
    assert.equal(options.judgeModel, "judge-model");
    assert.equal(options.localProvider, undefined);
    assert.equal(options.timeoutMs, 60_000);
    assert.equal(options.trial, 2);
    assert.equal(
      options.outputDir,
      "test-results/baselines/local/trial-2",
    );
    assert.equal(options.runAll, false);
  });

  it("rejects an unsupported local model provider", () => {
    assert.throws(
      () => parseArgs(["--local-provider", "unknown"]),
      /ollama or lmstudio/,
    );
  });

  it("requires a model for the direct Ollama engine", () => {
    const options = parseArgs([
      "--confirm-llm-cost",
      "--engine",
      "ollama",
      "--max-tests",
      "1",
    ]);

    assert.throws(
      () => assertBehavioralRunAuthorized(options),
      /explicit --model/,
    );
    assert.throws(
      () => parseArgs(["--engine", "unknown"]),
      /codex or ollama/,
    );
  });

  it("enforces exploratory and baseline policy boundaries", () => {
    const tagWithoutLimit = parseArgs([
      "--confirm-llm-cost",
      "--tag",
      "severity:critical",
    ]);
    const oversized = parseArgs([
      "--confirm-llm-cost",
      "--max-tests",
      "11",
    ]);
    const baselineWithoutIdentity = parseArgs([
      "--confirm-llm-cost",
      "--id",
      "fixture-003-greenfield-interview-replay",
      "--trial",
      "1",
      "--output-dir",
      "test-results/baselines/greenfield/trial-1",
    ]);
    const baselineUsingLatest = parseArgs([
      "--confirm-llm-cost",
      "--id",
      "fixture-003-greenfield-interview-replay",
      "--model",
      "pinned-model",
      "--trial",
      "1",
    ]);
    const baseline = parseArgs([
      "--confirm-llm-cost",
      "--id",
      "fixture-003-greenfield-interview-replay",
      "--model",
      "pinned-model",
      "--trial",
      "1",
      "--output-dir",
      "test-results/baselines/greenfield/trial-1",
    ]);

    assert.throws(
      () => assertBehavioralRunAuthorized(tagWithoutLimit),
      /--max-tests/,
    );
    assert.throws(
      () => assertBehavioralRunAuthorized(oversized),
      /at most 10/,
    );
    assert.throws(
      () => assertBehavioralRunAuthorized(baselineWithoutIdentity),
      /explicit --model/,
    );
    assert.throws(
      () => assertBehavioralRunAuthorized(baselineUsingLatest),
      /--output-dir/,
    );
    assert.doesNotThrow(() => assertBehavioralRunAuthorized(baseline));
  });

  it("keeps result output inside the repository test-results directory", () => {
    const repositoryRoot = mkdtempSync(
      path.join(tmpdir(), "studio-runtime-output-"),
    );

    assert.equal(
      resolveResultOutputDirectory(
        "test-results/baselines/model/trial-1",
        repositoryRoot,
      ),
      path.join(
        repositoryRoot,
        "test-results",
        "baselines",
        "model",
        "trial-1",
      ),
    );
    assert.throws(
      () =>
        resolveResultOutputDirectory(
          "../outside",
          repositoryRoot,
        ),
      /inside test-results/,
    );
    assert.throws(
      () =>
        resolveResultOutputDirectory(
          path.join(repositoryRoot, "absolute"),
          repositoryRoot,
        ),
      /project-relative/,
    );
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
        fixtureBackedScenarios: number;
        usesLlmJudge: boolean;
        validatesWorkspaceMutations: boolean;
      };
    };

    assert.equal(report.run.executesStudioOs, true);
    assert.equal(report.run.usesLlmJudge, true);
    assert.equal(report.run.fixtureBackedScenarios, 0);
    assert.equal(report.run.validatesWorkspaceMutations, false);
  });

  it("marks executed fixture scenarios as deterministic workspace checks", () => {
    const report = buildResultsJson(
      [
        {
          filePath: "tests/runtime/fixtures/001.md",
          id: "fixture-001",
          title: "Fixture",
          stage: "Brownfield Onboarding",
          status: "PASS",
          details: ["Passed."],
          fixtureBacked: true,
        },
      ],
      "runtime-judge",
    ) as {
      run: {
        fixtureBackedScenarios: number;
        validatesWorkspaceMutations: boolean;
      };
    };

    assert.equal(report.run.fixtureBackedScenarios, 1);
    assert.equal(report.run.validatesWorkspaceMutations, true);
  });

  it("reports replay scenario and executor turn counts", () => {
    const report = buildResultsJson(
      [
        {
          filePath: "tests/runtime/fixtures/002.md",
          id: "fixture-002",
          title: "Fixture replay",
          stage: "Loader",
          status: "PASS",
          details: ["Passed."],
          fixtureBacked: true,
          turnCount: 2,
          validTrial: true,
        },
      ],
      "runtime-judge",
    ) as {
      run: {
        replayScenarios: number;
        runtimeTurns: number;
      };
    };

    assert.equal(report.run.replayScenarios, 1);
    assert.equal(report.run.runtimeTurns, 2);
  });

  it("records reproducible behavioral trial identity and call budget", () => {
    const report = buildResultsJson(
      [
        {
          filePath: "tests/runtime/fixtures/003.md",
          id: "fixture-003",
          title: "Greenfield replay",
          stage: "Interview",
          status: "PASS",
          details: ["Passed."],
          fixtureBacked: true,
          turnCount: 2,
          validTrial: true,
        },
      ],
      "runtime-judge",
      {
        policyVersion: 1,
        studioOsVersion: "0.5.0-alpha.3",
        gitRevision: "abc123",
        workingTreeDirty: false,
        engine: "ollama",
        adapter: "ollama-direct",
        executorModel: "qwen:test",
        judgeModel: "qwen:test",
        timeoutMs: 300_000,
        trial: 1,
        baselineEligible: true,
      },
    ) as {
      run: {
        plannedModelCalls: number;
        validBehavioralTrials: number;
        invalidBehavioralTrials: number;
        identity: {
          policyVersion: number;
          gitRevision: string;
          trial: number;
          baselineEligible: boolean;
        };
      };
    };

    assert.equal(report.run.plannedModelCalls, 3);
    assert.equal(report.run.validBehavioralTrials, 1);
    assert.equal(report.run.invalidBehavioralTrials, 0);
    assert.equal(report.run.identity.policyVersion, 1);
    assert.equal(report.run.identity.gitRevision, "abc123");
    assert.equal(report.run.identity.trial, 1);
    assert.equal(report.run.identity.baselineEligible, true);
  });

  it("keeps invalid judge trials out of compatibility evidence counts", () => {
    const report = buildResultsJson(
      [
        {
          filePath: "tests/runtime/fixtures/003.md",
          id: "fixture-003",
          title: "Greenfield replay",
          stage: "Interview",
          status: "FAIL",
          details: ["Judge output is invalid."],
          fixtureBacked: true,
          turnCount: 2,
          validTrial: false,
        },
      ],
      "runtime-judge",
    ) as {
      run: {
        validBehavioralTrials: number;
        invalidBehavioralTrials: number;
      };
      tests: Array<{ validTrial: boolean }>;
    };

    assert.equal(report.run.validBehavioralTrials, 0);
    assert.equal(report.run.invalidBehavioralTrials, 1);
    assert.equal(report.tests[0].validTrial, false);
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
