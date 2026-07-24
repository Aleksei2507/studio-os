import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  CodexCliResponseJudge,
  CodexCliRuntimeExecutor,
} from "./runtime-testing/codex-cli.ts";
import type { CodexLocalProvider } from "./runtime-testing/codex-cli.ts";
import type {
  BehavioralStatus,
  FixtureWorkspaceSpec,
  HarnessEvaluation,
  RuntimeReplaySpec,
  RuntimeScenario,
} from "./runtime-testing/contracts.ts";
import { RuntimeHarness } from "./runtime-testing/harness.ts";
import { OllamaPromptRunner } from "./runtime-testing/ollama.ts";
import { loadRuntimeReplaySpec } from "./runtime-testing/replay.ts";
import {
  runtimeExpectationLabels,
  runtimeTurns,
} from "./runtime-testing/scenario.ts";
import { loadFixtureWorkspaceSpec } from "./runtime-testing/workspace-fixture.ts";

type TestStatus = BehavioralStatus;
type RuntimeTestMode = "scenario-structure" | "runtime-judge";
type RuntimeEngine = "codex" | "ollama";

type RuntimeTest = RuntimeScenario;

interface TestResult {
  filePath: string;
  id: string;
  title: string;
  stage: string;
  status: TestStatus;
  details: string[];
  fixtureBacked?: boolean;
  turnCount?: number;
  evaluation?: HarnessEvaluation;
}

interface RuntimeJudge {
  judge(test: RuntimeTest): Promise<TestResult>;
}

interface CliOptions {
  codexCommand: string;
  confirmLlmCost: boolean;
  dry: boolean;
  engine: RuntimeEngine;
  ids: string[];
  judgeModel?: string;
  localProvider?: CodexLocalProvider;
  maxTests?: number;
  model?: string;
  runAll: boolean;
  tags: string[];
  testsDir: string;
  timeoutMs: number;
}

interface RuntimeTestSelection {
  ids?: string[];
  maxTests?: number;
  tags?: string[];
}

interface RuntimeTestCallbacks {
  onScenarioStart?: (
    test: RuntimeTest,
    index: number,
    total: number,
  ) => void;
}

interface RuntimeTestRun {
  mode: RuntimeTestMode;
  label: string;
  assurance: string;
  executesStudioOs: boolean;
  fixtureBackedScenarios?: number;
  replayScenarios?: number;
  runtimeTurns?: number;
  usesLlmJudge: boolean;
  validatesWorkspaceMutations?: boolean;
}

const REQUIRED_FIELDS = [
  "id",
  "title",
  "stage",
  "prompt",
  "expect",
] as const;
const RUN_MODES: Record<RuntimeTestMode, RuntimeTestRun> = {
  "scenario-structure": {
    mode: "scenario-structure",
    label: "Scenario definition validation",
    assurance:
      "Validates Markdown scenario definitions only; it does not execute or judge Studio OS responses.",
    executesStudioOs: false,
    usesLlmJudge: false,
  },
  "runtime-judge": {
    mode: "runtime-judge",
    label: "Runtime contract evaluation",
    assurance:
      "Executes Universal Bootstrap for every declared turn and uses one LLM judge per scenario. Declared fixtures also receive deterministic workspace checkpoints; synthetic scenarios do not validate file mutations.",
    executesStudioOs: true,
    usesLlmJudge: true,
  },
};

function parseArgs(argv: string[]): CliOptions {
  let codexCommand = process.env.STUDIO_OS_CODEX_COMMAND ?? "codex";
  let confirmLlmCost = false;
  let dry = false;
  let engine: RuntimeEngine = "codex";
  const ids: string[] = [];
  let judgeModel: string | undefined;
  let localProvider: CodexLocalProvider | undefined;
  let maxTests: number | undefined;
  let model: string | undefined;
  let runAll = false;
  const tags: string[] = [];
  let testsDir = "tests/runtime";
  let timeoutMs = 180_000;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry") {
      dry = true;
      continue;
    }

    if (arg === "--confirm-llm-cost") {
      confirmLlmCost = true;
      continue;
    }

    if (arg === "--engine") {
      const selectedEngine = requiredOptionValue(argv, index, arg);
      if (selectedEngine !== "codex" && selectedEngine !== "ollama") {
        throw new Error("--engine must be either codex or ollama");
      }
      engine = selectedEngine;
      index += 1;
      continue;
    }

    if (arg === "--all") {
      runAll = true;
      continue;
    }

    if (arg === "--tests-dir") {
      testsDir = requiredOptionValue(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--id") {
      ids.push(requiredOptionValue(argv, index, arg));
      index += 1;
      continue;
    }

    if (arg === "--tag") {
      tags.push(requiredOptionValue(argv, index, arg));
      index += 1;
      continue;
    }

    if (arg === "--max-tests") {
      maxTests = positiveInteger(requiredOptionValue(argv, index, arg), arg);
      index += 1;
      continue;
    }

    if (arg === "--model") {
      model = requiredOptionValue(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--judge-model") {
      judgeModel = requiredOptionValue(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--local-provider") {
      const provider = requiredOptionValue(argv, index, arg);
      if (provider !== "ollama" && provider !== "lmstudio") {
        throw new Error(
          "--local-provider must be either ollama or lmstudio",
        );
      }
      localProvider = provider;
      index += 1;
      continue;
    }

    if (arg === "--timeout-ms") {
      timeoutMs = positiveInteger(requiredOptionValue(argv, index, arg), arg);
      index += 1;
      continue;
    }

    if (arg === "--codex-command") {
      codexCommand = requiredOptionValue(argv, index, arg);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    codexCommand,
    confirmLlmCost,
    dry,
    engine,
    ids,
    judgeModel,
    localProvider,
    maxTests,
    model,
    runAll,
    tags,
    testsDir,
    timeoutMs,
  };
}

function requiredOptionValue(
  argv: string[],
  index: number,
  option: string,
): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function positiveInteger(value: string, option: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${option} must be a positive integer`);
  }
  return parsed;
}

function assertBehavioralRunAuthorized(options: CliOptions): void {
  if (!options.dry && !options.confirmLlmCost) {
    throw new Error(
      "Runtime evaluation makes one executor call per turn plus one judge call per scenario. Re-run with --confirm-llm-cost and use --id, --tag, --max-tests, or an explicit --all.",
    );
  }

  if (options.dry) {
    return;
  }

  if (options.engine === "ollama" && !options.model) {
    throw new Error("Ollama engine requires an explicit --model.");
  }
  if (options.engine === "ollama" && options.localProvider) {
    throw new Error(
      "--local-provider configures Codex CLI and cannot be combined with --engine ollama.",
    );
  }

  const hasBound =
    options.ids.length > 0 ||
    options.tags.length > 0 ||
    options.maxTests !== undefined;
  if (!options.runAll && !hasBound) {
    throw new Error(
      "Behavioral runs require --id, --tag, --max-tests, or an explicit --all.",
    );
  }

  if (options.runAll && hasBound) {
    throw new Error("--all cannot be combined with scenario filters or --max-tests.");
  }
}

function findMarkdownFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findMarkdownFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") {
        return [entryPath];
      }

      return [];
    })
    .sort();
}

function parseFrontmatter(source: string): { frontmatter: Record<string, unknown>; body: string } {
  if (!source.startsWith("---\n")) {
    throw new Error("Missing YAML frontmatter block");
  }

  const closingIndex = source.indexOf("\n---", 4);
  if (closingIndex === -1) {
    throw new Error("Unclosed YAML frontmatter block");
  }

  const rawFrontmatter = source.slice(4, closingIndex);
  const body = source.slice(closingIndex + 4).trim();

  return {
    frontmatter: parseMinimalYaml(rawFrontmatter),
    body,
  };
}

function parseMinimalYaml(source: string): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = /^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/.exec(line);
    if (!match) {
      throw new Error(`Unsupported YAML line: ${line}`);
    }

    const [, key, rawValue = ""] = match;
    const value = rawValue.trim();

    if (value) {
      data[key] = parseYamlScalarOrInlineList(value);
      continue;
    }

    const list: string[] = [];
    while (index + 1 < lines.length) {
      const nextLine = lines[index + 1];
      const listMatch = /^\s+-\s+(.+)$/.exec(nextLine);
      if (!listMatch) {
        break;
      }
      list.push(unquote(listMatch[1].trim()));
      index += 1;
    }

    data[key] = list;
  }

  return data;
}

function parseYamlScalarOrInlineList(value: string): string | string[] {
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) {
      return [];
    }
    return inner.split(",").map((item) => unquote(item.trim()));
  }

  return unquote(value);
}

function unquote(value: string): string {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function validateRuntimeTest(
  filePath: string,
  source: string,
  repositoryRoot = process.cwd(),
): RuntimeTest {
  const { frontmatter, body } = parseFrontmatter(source);
  const errors: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (!(field in frontmatter)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  const expect = normalizeStringList(frontmatter.expect);
  const tags = normalizeStringList(frontmatter.tags);
  const fixture = optionalString(frontmatter.fixture);
  const workspaceAssertions = optionalString(
    frontmatter.workspace_assertions,
  );
  const replayPath = optionalString(frontmatter.replay);
  let workspace: FixtureWorkspaceSpec | undefined;
  let replay: RuntimeReplaySpec | undefined;

  if (typeof frontmatter.id !== "string" || !frontmatter.id.trim()) {
    errors.push("Field id must be a non-empty string");
  }

  if (typeof frontmatter.title !== "string" || !frontmatter.title.trim()) {
    errors.push("Field title must be a non-empty string");
  }

  if (typeof frontmatter.stage !== "string" || !frontmatter.stage.trim()) {
    errors.push("Field stage must be a non-empty string");
  }

  if (typeof frontmatter.prompt !== "string" || !frontmatter.prompt.trim()) {
    errors.push("Field prompt must be a non-empty string");
  }

  if (expect.length === 0) {
    errors.push("Field expect must contain at least one expectation");
  }

  if (!body) {
    errors.push("Test body must describe the conversation or scenario");
  }

  if (
    "fixture" in frontmatter &&
    (typeof frontmatter.fixture !== "string" ||
      !frontmatter.fixture.trim())
  ) {
    errors.push("Field fixture must be a non-empty string");
  }

  if (
    "workspace_assertions" in frontmatter &&
    (typeof frontmatter.workspace_assertions !== "string" ||
      !frontmatter.workspace_assertions.trim())
  ) {
    errors.push("Field workspace_assertions must be a non-empty string");
  }

  if (
    "replay" in frontmatter &&
    (typeof frontmatter.replay !== "string" ||
      !frontmatter.replay.trim())
  ) {
    errors.push("Field replay must be a non-empty string");
  }

  if (fixture && !workspaceAssertions) {
    errors.push(
      "Field workspace_assertions is required when fixture is declared",
    );
  }

  if (!fixture && workspaceAssertions) {
    errors.push("Field fixture is required when workspace_assertions is declared");
  }

  if (fixture && workspaceAssertions) {
    try {
      workspace = loadFixtureWorkspaceSpec(
        repositoryRoot,
        fixture,
        workspaceAssertions,
      );
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (replayPath) {
    try {
      replay = loadRuntimeReplaySpec(
        repositoryRoot,
        replayPath,
        Boolean(fixture),
      );
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return {
    filePath,
    id: frontmatter.id as string,
    title: frontmatter.title as string,
    stage: frontmatter.stage as string,
    prompt: frontmatter.prompt as string,
    expect,
    tags,
    body,
    workspace,
    replay,
  };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function normalizeStringList(value: unknown): string[] {
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function loadRuntimeTests(
  testsDir: string,
  repositoryRoot = process.cwd(),
): TestResult[] {
  const files = findMarkdownFiles(testsDir);

  if (files.length === 0) {
    return [
      {
        filePath: testsDir,
        id: "runtime-tests-discovery",
        title: "Runtime tests directory discovery",
        stage: "runtime",
        status: "PARTIAL",
        details: [`No markdown tests found in ${testsDir}`],
      },
    ];
  }

  return files.map((filePath) => {
    try {
      const test = validateRuntimeTest(
        filePath,
        readFileSync(filePath, "utf8"),
        repositoryRoot,
      );
      const turns = runtimeTurns(test);
      return {
        filePath,
        id: test.id,
        title: test.title,
        stage: test.stage,
        status: "PASS",
        fixtureBacked: Boolean(test.workspace),
        turnCount: turns.length,
        details: [
          `${runtimeExpectationLabels(test).length} expectation(s), ${turns.length} turn(s), stage: ${test.stage}${test.workspace ? ", fixture-backed workspace" : ""}`,
        ],
      };
    } catch (error) {
      return {
        filePath,
        id: path.basename(filePath),
        title: "Invalid runtime test",
        stage: "unknown",
        status: "FAIL",
        details: [error instanceof Error ? error.message : String(error)],
      };
    }
  });
}

function loadValidRuntimeTests(testsDir: string): { tests: RuntimeTest[]; results: TestResult[] } {
  const files = findMarkdownFiles(testsDir);

  if (files.length === 0) {
    return {
      tests: [],
      results: loadRuntimeTests(testsDir),
    };
  }

  const tests: RuntimeTest[] = [];
  const results: TestResult[] = [];

  for (const filePath of files) {
    try {
      tests.push(validateRuntimeTest(filePath, readFileSync(filePath, "utf8")));
    } catch (error) {
      results.push({
        filePath,
        id: path.basename(filePath),
        title: "Invalid runtime test",
        stage: "unknown",
        status: "FAIL",
        details: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  return { tests, results };
}

class HarnessRuntimeJudge implements RuntimeJudge {
  constructor(private readonly harness: RuntimeHarness) {}

  async judge(test: RuntimeTest): Promise<TestResult> {
    const evaluation = await this.harness.evaluate(test);

    return {
      filePath: test.filePath,
      id: test.id,
      title: test.title,
      stage: test.stage,
      status: evaluation.status,
      fixtureBacked: Boolean(test.workspace),
      turnCount: runtimeTurns(test).length,
      details: [
        `${runtimeExpectationLabels(test).length} expectation(s), ${runtimeTurns(test).length} turn(s), stage: ${test.stage}`,
        ...evaluation.details,
      ],
      evaluation,
    };
  }
}

async function runLlmJudgedTests(
  testsDir: string,
  judge: RuntimeJudge,
  selection: RuntimeTestSelection = {},
  callbacks: RuntimeTestCallbacks = {},
): Promise<TestResult[]> {
  const { tests, results } = loadValidRuntimeTests(testsDir);

  if (tests.length === 0 || results.some((result) => result.status === "FAIL")) {
    return results;
  }

  const selectedTests = selectRuntimeTests(tests, selection);
  if (selectedTests.length === 0) {
    return [
      ...results,
      {
        filePath: testsDir,
        id: "runtime-tests-selection",
        title: "Runtime test selection",
        stage: "runtime",
        status: "PARTIAL",
        details: ["No runtime scenarios matched the requested id and tag filters."],
      },
    ];
  }

  const judgedResults: TestResult[] = [];
  for (const [index, test] of selectedTests.entries()) {
    callbacks.onScenarioStart?.(test, index, selectedTests.length);
    judgedResults.push(await judge.judge(test));
  }

  return [...results, ...judgedResults];
}

function selectRuntimeTests(
  tests: RuntimeTest[],
  selection: RuntimeTestSelection = {},
): RuntimeTest[] {
  const ids = selection.ids ?? [];
  const tags = selection.tags ?? [];
  const selected = tests.filter((test) => {
    const matchesId = ids.length === 0 || ids.includes(test.id);
    const matchesTags =
      tags.length === 0 || tags.every((tag) => test.tags.includes(tag));
    return matchesId && matchesTags;
  });

  return selection.maxTests ? selected.slice(0, selection.maxTests) : selected;
}

function summarize(results: TestResult[]): TestStatus {
  if (results.some((result) => result.status === "FAIL")) {
    return "FAIL";
  }

  if (results.some((result) => result.status === "PARTIAL")) {
    return "PARTIAL";
  }

  return "PASS";
}

function countStatuses(results: TestResult[]): Record<TestStatus, number> {
  return {
    PASS: results.filter((result) => result.status === "PASS").length,
    FAIL: results.filter((result) => result.status === "FAIL").length,
    PARTIAL: results.filter((result) => result.status === "PARTIAL").length,
  };
}

function buildResultsJson(
  results: TestResult[],
  mode: RuntimeTestMode = "scenario-structure",
): object {
  const counts = countStatuses(results);
  const run = buildRunMetadata(results, mode);

  return {
    generatedAt: new Date().toISOString(),
    run,
    summary: {
      status: summarize(results),
      total: results.length,
      pass: counts.PASS,
      fail: counts.FAIL,
      partial: counts.PARTIAL,
    },
    tests: results.map((result) => ({
      id: result.id,
      title: result.title,
      stage: result.stage,
      status: result.status,
      filePath: result.filePath,
      fixtureBacked: Boolean(result.fixtureBacked),
      turnCount: result.turnCount,
      details: result.details,
      evaluation: result.evaluation,
    })),
  };
}

function buildSummaryMarkdown(
  results: TestResult[],
  mode: RuntimeTestMode = "scenario-structure",
): string {
  const counts = countStatuses(results);
  const run = buildRunMetadata(results, mode);
  const lines = [
    `# Runtime Test Summary: ${run.label}`,
    "",
    `- Mode: ${run.label}`,
    `- Assurance: ${run.assurance}`,
    `- Fixture-backed scenarios: ${run.fixtureBackedScenarios}`,
    `- Replay scenarios: ${run.replayScenarios}`,
    `- Runtime turns: ${run.runtimeTurns}`,
    `- Workspace mutations evaluated: ${run.validatesWorkspaceMutations ? "Yes" : "No"}`,
    `- Total tests: ${results.length}`,
    `- Pass: ${counts.PASS}`,
    `- Fail: ${counts.FAIL}`,
    `- Partial: ${counts.PARTIAL}`,
    "",
    "| ID | Title | Stage | Status | Evaluation |",
    "| --- | --- | --- | --- | --- |",
    ...results.map(
      (result) =>
        `| ${escapeMarkdownTable(result.id)} | ${escapeMarkdownTable(result.title)} | ${escapeMarkdownTable(result.stage)} | ${result.status} | ${result.evaluation ? `evaluations/${evaluationFileName(result.id)}` : ""} |`,
    ),
    "",
  ];

  return lines.join("\n");
}

function buildRunMetadata(
  results: TestResult[],
  mode: RuntimeTestMode,
): RuntimeTestRun {
  const fixtureBackedScenarios = results.filter(
    (result) => result.fixtureBacked,
  ).length;
  const replayScenarios = results.filter(
    (result) => (result.turnCount ?? 0) > 1,
  ).length;
  const declaredRuntimeTurns = results.reduce(
    (total, result) => total + (result.turnCount ?? 0),
    0,
  );

  return {
    ...RUN_MODES[mode],
    fixtureBackedScenarios,
    replayScenarios,
    runtimeTurns: declaredRuntimeTurns,
    validatesWorkspaceMutations:
      mode === "runtime-judge" && fixtureBackedScenarios > 0,
  };
}

function escapeMarkdownTable(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function writeResultArtifacts(
  results: TestResult[],
  outputDir = "test-results/latest",
  mode: RuntimeTestMode = "scenario-structure",
): void {
  mkdirSync(outputDir, { recursive: true });
  const evaluationsDir = path.join(outputDir, "evaluations");
  rmSync(evaluationsDir, { recursive: true, force: true });

  for (const result of results) {
    if (!result.evaluation) {
      continue;
    }

    mkdirSync(evaluationsDir, { recursive: true });
    writeFileSync(
      path.join(evaluationsDir, evaluationFileName(result.id)),
      `${JSON.stringify(
        {
          ...result.evaluation,
          id: result.id,
          title: result.title,
          stage: result.stage,
          status: result.status,
          filePath: result.filePath,
          details: result.details,
        },
        null,
        2,
      )}\n`,
    );
  }

  writeFileSync(path.join(outputDir, "summary.md"), buildSummaryMarkdown(results, mode));
  writeFileSync(
    path.join(outputDir, "results.json"),
    `${JSON.stringify(buildResultsJson(results, mode), null, 2)}\n`,
  );
}

function evaluationFileName(id: string): string {
  return `${id.replaceAll(/[^a-zA-Z0-9._-]/g, "_")}.json`;
}

function printResults(results: TestResult[], mode: RuntimeTestMode): void {
  const summary = summarize(results);
  const run = buildRunMetadata(results, mode);

  console.log(`Mode: ${run.label}`);
  console.log(`Assurance: ${run.assurance}`);
  console.log(`Fixture-backed scenarios: ${run.fixtureBackedScenarios}`);
  console.log(`Replay scenarios: ${run.replayScenarios}`);
  console.log(`Runtime turns: ${run.runtimeTurns}`);
  console.log(
    `Workspace mutations evaluated: ${run.validatesWorkspaceMutations ? "Yes" : "No"}`,
  );
  console.log("");

  for (const result of results) {
    console.log(`${result.status} ${result.id} - ${result.title}`);
    for (const detail of result.details) {
      console.log(`  ${detail}`);
    }
  }

  console.log("");
  console.log(`${run.label} summary: ${summary} (${results.length} test file(s))`);
}

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    let results: TestResult[];

    if (options.dry) {
      results = loadRuntimeTests(options.testsDir);
    } else {
      assertBehavioralRunAuthorized(options);

      const executorOptions = {
        adapterName:
          options.engine === "ollama"
            ? `ollama:${options.model}`
            : undefined,
        executable: options.codexCommand,
        localProvider: options.localProvider,
        model: options.model,
        studioOsRoot: process.cwd(),
        timeoutMs: options.timeoutMs,
      };
      const judgeOptions = {
        adapterName:
          options.engine === "ollama"
            ? `ollama:${options.judgeModel ?? options.model}`
            : undefined,
        executable: options.codexCommand,
        localProvider: options.localProvider,
        model: options.judgeModel ?? options.model,
        timeoutMs: options.timeoutMs,
      };
      const executorRunner =
        options.engine === "ollama"
          ? new OllamaPromptRunner({
              model: options.model as string,
              studioOsRoot: process.cwd(),
              timeoutMs: options.timeoutMs,
            })
          : undefined;
      const judgeRunner =
        options.engine === "ollama"
          ? new OllamaPromptRunner({
              model: (options.judgeModel ?? options.model) as string,
              studioOsRoot: process.cwd(),
              timeoutMs: options.timeoutMs,
            })
          : undefined;
      const harness = new RuntimeHarness(
        new CodexCliRuntimeExecutor(executorOptions, executorRunner),
        new CodexCliResponseJudge(judgeOptions, judgeRunner),
      );
      results = await runLlmJudgedTests(
        options.testsDir,
        new HarnessRuntimeJudge(harness),
        {
          ids: options.ids,
          maxTests: options.maxTests,
          tags: options.tags,
        },
        {
          onScenarioStart(test, index, total) {
            console.log(
              `RUN ${index + 1}/${total} ${test.id} (${runtimeTurns(test).length} turn(s))`,
            );
          },
        },
      );
    }

    const mode: RuntimeTestMode = options.dry ? "scenario-structure" : "runtime-judge";

    printResults(results, mode);
    writeResultArtifacts(results, "test-results/latest", mode);

    const summary = summarize(results);
    process.exitCode =
      summary === "FAIL" || (!options.dry && summary !== "PASS") ? 1 : 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}

export {
  assertBehavioralRunAuthorized,
  findMarkdownFiles,
  buildResultsJson,
  buildSummaryMarkdown,
  HarnessRuntimeJudge,
  loadRuntimeTests,
  parseArgs,
  parseFrontmatter,
  parseMinimalYaml,
  runLlmJudgedTests,
  selectRuntimeTests,
  summarize,
  validateRuntimeTest,
  writeResultArtifacts,
};
