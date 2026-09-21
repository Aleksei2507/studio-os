import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  readReleaseManifest,
  validateReleaseManifest,
} from "../../scripts/build-release.ts";
import {
  findMarkdownFiles,
  validateRuntimeTest,
} from "../../scripts/run-runtime-tests.ts";
import { buildRuntimePrompt } from "../../scripts/runtime-testing/codex-cli.ts";

const root = process.cwd();
const read = (file: string): string => readFileSync(path.join(root, file), "utf8");
const capabilityPath = "skill/capabilities/model-orchestration.md";
const planPath = "templates/orchestration-plan.md";

interface RuntimeDefinition {
  path: string;
  capabilities: string[];
}

describe("native subagent model orchestration contract", () => {
  it("connects planning, assignment, and execution to the same capability", () => {
    const capabilities = JSON.parse(read("skill/capabilities/registry.json"));
    const { runtimes } = JSON.parse(read("skill/workflows/registry.json")) as {
      runtimes: Record<string, RuntimeDefinition>;
    };
    assert.equal(capabilities.capabilities["model-orchestration"].path, capabilityPath);

    const consumers = Object.entries(runtimes).filter(([, runtime]) =>
      runtime.capabilities.includes("model-orchestration"),
    );
    assert.deepEqual(consumers.map(([id]) => id).sort(), [
      "architecture",
      "development",
      "task-decomposition",
    ]);
    for (const [id, runtime] of consumers) {
      assert.ok(read(runtime.path).includes(`\`${capabilityPath}\``), id);
      assert.ok(read(runtime.path).includes("orchestration-plan.md"), id);
    }
  });

  it("keeps the plan modes and bounded defaults aligned with the capability", () => {
    const capability = read(capabilityPath);
    const plan = read(planPath);
    const modes = [...capability.matchAll(/^- `([a-z-]+)`:/gm)].map((match) => match[1]);
    assert.deepEqual(modes, ["single-model", "same-model-delegation", "multi-model"]);
    assert.deepEqual(/^Mode: (.+)$/m.exec(plan)?.[1].split(" | "), modes);

    for (const [label, limit] of [
      ["Maximum concurrent subagents", 2],
      ["Maximum attempts per task across all executors", 2],
      ["Maximum delegation depth", 1],
    ] as const) {
      assert.match(plan, new RegExp(`${label} \\(default ${limit}\\b`));
    }
    assert.match(capability, /unless stricter host\/user limits apply/);
  });

  it("preserves assignment and observed job evidence across the artifact handoff", () => {
    const tasks = read("templates/tasks.md");
    const report = read("templates/development-report.md");
    const plan = read(planPath);
    assert.match(tasks, /^## Orchestration Plan$/m);
    for (const label of [
      "Satisfies",
      "Dependencies",
      "Execution Owner",
      "Change Ownership (files or interfaces)",
      "Verification Evidence",
    ]) {
      assert.ok(tasks.includes(`- ${label}:`), label);
    }
    assert.match(report, /^## Orchestration Results$/m);
    for (const column of ["Agent/job ID", "Requested model", "Observed model / source", "Attempts"]) {
      assert.ok(plan.includes(`| ${column} |`), column);
    }
    for (const column of ["Planned Subagent Model", "Actual Subagent Model And Source", "Attempts"]) {
      assert.ok(report.includes(`| ${column} |`), column);
    }
    assert.match(report, /^Tool-Provided Token Usage \(or Unknown\):$/m);
    assert.match(report, /^Tool-Provided Cost \(or Unknown\):$/m);
  });

  it("ships the capability and plan template through the release manifest", () => {
    const manifest = readReleaseManifest(root);
    const required = [capabilityPath, planPath];
    for (const file of required) {
      assert.ok(existsSync(path.join(root, file)), file);
    }
    assert.doesNotThrow(() => validateReleaseManifest({
      ...manifest,
      requiredFiles: [...new Set([...manifest.requiredFiles, ...required])],
    }));
  });

  it("keeps orchestration scenario expectations outside executor context", () => {
    const scenarios = findMarkdownFiles(path.join(root, "tests/runtime"))
      .map((file) => validateRuntimeTest(file, readFileSync(file, "utf8"), root))
      .filter((scenario) => scenario.tags.includes("model-orchestration"));

    assert.deepEqual([...new Set(scenarios.map((scenario) => scenario.stage))].sort(), [
      "Architecture",
      "Development",
      "Task Decomposition",
    ]);
    for (const scenario of scenarios) {
      const prompt = buildRuntimePrompt(scenario, "adapters/universal/BOOTSTRAP.md");
      assert.doesNotMatch(scenario.body, /^#+ (Expected Behavior|Should Not|Expectations)\b/im);
      for (const expectation of scenario.expect) {
        assert.equal(prompt.includes(expectation), false, `${scenario.id}: leaked expectation`);
      }
    }
  });
});
