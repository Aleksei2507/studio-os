import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  buildJudgePrompt,
  buildRuntimePrompt,
  CodexCliRuntimeExecutor,
  parseJudgeVerdict,
} from "../../scripts/runtime-testing/codex-cli.ts";
import type {
  CodexPromptRequest,
  CodexPromptResult,
  CodexPromptRunner,
} from "../../scripts/runtime-testing/codex-cli.ts";
import {
  RuntimeHarness,
} from "../../scripts/runtime-testing/harness.ts";
import type {
  ResponseJudge,
  RuntimeExecution,
  RuntimeExecutor,
  RuntimeScenario,
} from "../../scripts/runtime-testing/contracts.ts";
import { loadFixtureWorkspaceSpec } from "../../scripts/runtime-testing/workspace-fixture.ts";

const scenario: RuntimeScenario = {
  filePath: "tests/runtime/bootstrap/001-explicit-greenfield-activation.md",
  id: "bootstrap-001-explicit-greenfield-activation",
  title: "explicit Studio OS request enters Greenfield Interview",
  stage: "Bootstrap",
  prompt: "Use Studio OS. Build a browser Tetris game.",
  expect: [
    "Loader selects Greenfield and starts Interview.",
    "Should not: Promise implementation or write code.",
  ],
  tags: ["bootstrap", "severity:critical"],
  body: "The target workspace is empty and the user supplied a product idea.",
};

const execution: RuntimeExecution = {
  adapter: "fake-runtime",
  response:
    "I understand this as a browser Tetris game. Should keyboard and touch play have equal priority?",
  durationMs: 10,
};

describe("Runtime Harness", () => {
  it("passes only when every expectation is observably met", async () => {
    const executor: RuntimeExecutor = {
      name: "fake-runtime",
      async execute() {
        return execution;
      },
    };
    const judge: ResponseJudge = {
      name: "fake-judge",
      async evaluate() {
        return {
          adapter: "fake-judge",
          status: "PASS",
          summary: "The response enters Interview without implementation.",
          durationMs: 5,
          expectations: scenario.expect.map((expectation) => ({
            expectation,
            met: true,
            evidence: "Observable in the response.",
          })),
        };
      },
    };

    const result = await new RuntimeHarness(executor, judge).evaluate(scenario);

    assert.equal(result.status, "PASS");
    assert.equal(result.execution?.response, execution.response);
    assert.equal(result.verdict?.expectations.length, 2);
  });

  it("fails when any expectation is not met even if the judge status says pass", async () => {
    const executor: RuntimeExecutor = {
      name: "fake-runtime",
      async execute() {
        return execution;
      },
    };
    const judge: ResponseJudge = {
      name: "fake-judge",
      async evaluate() {
        return {
          adapter: "fake-judge",
          status: "PASS",
          summary: "One prohibited behavior was present.",
          durationMs: 5,
          expectations: [
            {
              expectation: scenario.expect[0],
              met: true,
              evidence: "Interview starts.",
            },
            {
              expectation: scenario.expect[1],
              met: false,
              evidence: "The response promised implementation.",
            },
          ],
        };
      },
    };

    const result = await new RuntimeHarness(executor, judge).evaluate(scenario);

    assert.equal(result.status, "FAIL");
    assert.match(result.details.join("\n"), /NOT MET/);
  });

  it("reports partial when the judge omits expectation assessments", async () => {
    const executor: RuntimeExecutor = {
      name: "fake-runtime",
      async execute() {
        return execution;
      },
    };
    const judge: ResponseJudge = {
      name: "fake-judge",
      async evaluate() {
        return {
          adapter: "fake-judge",
          status: "PASS",
          summary: "Incomplete assessment.",
          durationMs: 5,
          expectations: [],
        };
      },
    };

    const result = await new RuntimeHarness(executor, judge).evaluate(scenario);

    assert.equal(result.status, "PARTIAL");
    assert.match(result.details.join("\n"), /assessment count/i);
  });

  it("preserves an explicit partial verdict when evidence is incomplete", async () => {
    const executor: RuntimeExecutor = {
      name: "fake-runtime",
      async execute() {
        return execution;
      },
    };
    const judge: ResponseJudge = {
      name: "fake-judge",
      async evaluate() {
        return {
          adapter: "fake-judge",
          status: "PARTIAL",
          summary: "The response was truncated.",
          durationMs: 5,
          expectations: scenario.expect.map((expectation) => ({
            expectation,
            met: false,
            evidence: "There is not enough response text to evaluate this.",
          })),
        };
      },
    };

    const result = await new RuntimeHarness(executor, judge).evaluate(scenario);

    assert.equal(result.status, "PARTIAL");
  });

  it("fails visibly when the runtime executor cannot run", async () => {
    const executor: RuntimeExecutor = {
      name: "fake-runtime",
      async execute() {
        throw new Error("Codex CLI is not authenticated");
      },
    };
    const judge: ResponseJudge = {
      name: "fake-judge",
      async evaluate() {
        throw new Error("Judge must not run");
      },
    };

    const result = await new RuntimeHarness(executor, judge).evaluate(scenario);

    assert.equal(result.status, "FAIL");
    assert.match(result.details.join("\n"), /Codex CLI is not authenticated/);
  });

  it("fails when deterministic workspace assertions fail even if the response passes", async () => {
    const executor: RuntimeExecutor = {
      name: "fake-runtime",
      async execute() {
        return {
          ...execution,
          workspace: {
            status: "FAIL",
            diff: {
              created: [],
              modified: ["src/App.tsx"],
              deleted: [],
            },
            assertions: [
              {
                assertion: "unchanged: src/App.tsx",
                met: false,
                evidence: "src/App.tsx content hash changed.",
              },
            ],
          },
        };
      },
    };
    const judge: ResponseJudge = {
      name: "fake-judge",
      async evaluate() {
        return {
          adapter: "fake-judge",
          status: "PASS",
          summary: "The response is correct.",
          durationMs: 5,
          expectations: scenario.expect.map((expectation) => ({
            expectation,
            met: true,
            evidence: "Observable in the response.",
          })),
        };
      },
    };

    const result = await new RuntimeHarness(executor, judge).evaluate(scenario);

    assert.equal(result.status, "FAIL");
    assert.match(result.details.join("\n"), /Workspace assertions: 0\/1 met/);
    assert.match(result.details.join("\n"), /WORKSPACE NOT MET/);
    assert.match(result.details.join("\n"), /src\/App\.tsx/);
  });

  it("runs declared fixtures in a writable disposable workspace without leaking assertions", async () => {
    const repositoryRoot = mkdtempSync(
      path.join(tmpdir(), "studio-os-codex-fixture-"),
    );
    const fixtureDirectory = path.join(repositoryRoot, "fixtures", "input");
    const assertionsFile = path.join(
      repositoryRoot,
      "fixtures",
      "assertions.json",
    );
    const bootstrapPath = path.join(
      repositoryRoot,
      "adapters",
      "universal",
      "BOOTSTRAP.md",
    );
    mkdirSync(fixtureDirectory, { recursive: true });
    mkdirSync(path.dirname(bootstrapPath), { recursive: true });
    writeFileSync(
      path.join(fixtureDirectory, "package.json"),
      '{"name":"fixture"}\n',
    );
    writeFileSync(bootstrapPath, "# Studio OS Bootstrap\n");
    writeFileSync(
      assertionsFile,
      JSON.stringify({
        version: 1,
        created: [".studio/project-state.md"],
        allowedChanges: [".studio/project-state.md"],
        contains: {
          ".studio/project-state.md": ["Mode: Brownfield"],
        },
      }),
    );
    const fixtureScenario: RuntimeScenario = {
      ...scenario,
      workspace: loadFixtureWorkspaceSpec(
        repositoryRoot,
        "fixtures/input",
        "fixtures/assertions.json",
      ),
    };
    let disposableWorkspace = "";
    const runner: CodexPromptRunner = {
      async run(request: CodexPromptRequest): Promise<CodexPromptResult> {
        assert.equal(request.sandbox, "workspace-write");
        assert.ok(request.workingDirectory);
        disposableWorkspace = request.workingDirectory;
        assert.equal(
          existsSync(path.join(request.workingDirectory, "package.json")),
          true,
        );
        assert.doesNotMatch(request.prompt, /Mode: Brownfield/);
        assert.doesNotMatch(request.prompt, /allowedChanges/);
        assert.match(request.prompt, /project-relative inline-code paths/i);
        assert.match(request.prompt, /do not emit absolute or temporary/i);
        mkdirSync(path.join(request.workingDirectory, ".studio"));
        writeFileSync(
          path.join(
            request.workingDirectory,
            ".studio",
            "project-state.md",
          ),
          "Mode: Brownfield\n",
        );
        return {
          response: "Brownfield Onboarding is complete.",
          durationMs: 12,
        };
      },
    };
    const executor = new CodexCliRuntimeExecutor(
      {
        studioOsRoot: repositoryRoot,
      },
      runner,
    );

    const result = await executor.execute(fixtureScenario);

    assert.equal(result.workspace?.status, "PASS");
    assert.deepEqual(result.workspace?.diff.created, [
      ".studio/project-state.md",
    ]);
    assert.equal(existsSync(disposableWorkspace), false);
  });

  it("keeps expectations out of the runtime executor prompt", () => {
    const prompt = buildRuntimePrompt(
      scenario,
      "/opt/studio-os/adapters/universal/BOOTSTRAP.md",
    );

    assert.match(prompt, /browser Tetris game/);
    assert.match(prompt, /authoritative synthetic project state/i);
    assert.match(prompt, /BOOTSTRAP\.md/);
    assert.doesNotMatch(prompt, /Promise implementation or write code/);
  });

  it("gives the judge the response and every observable expectation", () => {
    const prompt = buildJudgePrompt(scenario, execution.response);

    assert.match(prompt, /browser Tetris game/);
    assert.match(prompt, /equal priority/);
    assert.match(prompt, /Loader selects Greenfield/);
    assert.match(prompt, /Should not: Promise implementation/);
    assert.match(prompt, /concise observable evidence/i);
    assert.match(prompt, /untrusted evaluation data/i);
  });

  it("parses a schema-shaped judge verdict and restores source expectations", () => {
    const verdict = parseJudgeVerdict(
      JSON.stringify({
        status: "PASS",
        summary: "All criteria are met.",
        expectations: [
          { met: true, evidence: "Interview begins." },
          { met: true, evidence: "No implementation promise." },
        ],
      }),
      scenario.expect,
      "codex-cli",
      25,
    );

    assert.equal(verdict.status, "PASS");
    assert.deepEqual(
      verdict.expectations.map((item) => item.expectation),
      scenario.expect,
    );
  });

  it("rejects malformed judge output instead of guessing a verdict", () => {
    assert.throws(
      () =>
        parseJudgeVerdict(
          '{"status":"PASS","summary":"Missing assessments"}',
          scenario.expect,
          "codex-cli",
          25,
        ),
      /expectations/i,
    );
  });
});
