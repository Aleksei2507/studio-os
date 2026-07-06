import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type TestStatus = "PASS" | "FAIL" | "PARTIAL";

interface RuntimeTest {
  filePath: string;
  id: string;
  title: string;
  stage: string;
  prompt: string;
  expect: string[];
  tags: string[];
  body: string;
}

interface TestResult {
  filePath: string;
  id: string;
  title: string;
  stage: string;
  status: TestStatus;
  details: string[];
}

interface RuntimeJudge {
  judge(test: RuntimeTest): Promise<TestResult>;
}

interface CliOptions {
  dry: boolean;
  testsDir: string;
}

const REQUIRED_FIELDS = ["id", "title", "stage", "prompt", "expect"] as const;

function parseArgs(argv: string[]): CliOptions {
  let dry = false;
  let testsDir = "tests/runtime";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry") {
      dry = true;
      continue;
    }

    if (arg === "--tests-dir") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--tests-dir requires a path");
      }
      testsDir = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { dry, testsDir };
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

function validateRuntimeTest(filePath: string, source: string): RuntimeTest {
  const { frontmatter, body } = parseFrontmatter(source);
  const errors: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (!(field in frontmatter)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  const expect = normalizeStringList(frontmatter.expect);
  const tags = normalizeStringList(frontmatter.tags);

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
  };
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

function loadRuntimeTests(testsDir: string): TestResult[] {
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
      const test = validateRuntimeTest(filePath, readFileSync(filePath, "utf8"));
      return {
        filePath,
        id: test.id,
        title: test.title,
        stage: test.stage,
        status: "PASS",
        details: [`${test.expect.length} expectation(s), stage: ${test.stage}`],
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

class TodoRuntimeJudge implements RuntimeJudge {
  async judge(test: RuntimeTest): Promise<TestResult> {
    return {
      filePath: test.filePath,
      id: test.id,
      title: test.title,
      stage: test.stage,
      status: "PARTIAL",
      details: [
        `${test.expect.length} expectation(s), stage: ${test.stage}`,
        "LLM judge is not implemented yet. Replace TodoRuntimeJudge with an API-backed judge.",
      ],
    };
  }
}

async function runLlmJudgedTests(
  testsDir: string,
  judge: RuntimeJudge = new TodoRuntimeJudge(),
): Promise<TestResult[]> {
  const { tests, results } = loadValidRuntimeTests(testsDir);

  if (tests.length === 0 || results.some((result) => result.status === "FAIL")) {
    return results;
  }

  return [...results, ...(await Promise.all(tests.map((test) => judge.judge(test))))];
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

function buildResultsJson(results: TestResult[]): object {
  const counts = countStatuses(results);

  return {
    generatedAt: new Date().toISOString(),
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
      details: result.details,
    })),
  };
}

function buildSummaryMarkdown(results: TestResult[]): string {
  const counts = countStatuses(results);
  const lines = [
    "# Runtime Test Summary",
    "",
    `- Total tests: ${results.length}`,
    `- Pass: ${counts.PASS}`,
    `- Fail: ${counts.FAIL}`,
    `- Partial: ${counts.PARTIAL}`,
    "",
    "| ID | Title | Stage | Status |",
    "| --- | --- | --- | --- |",
    ...results.map(
      (result) =>
        `| ${escapeMarkdownTable(result.id)} | ${escapeMarkdownTable(result.title)} | ${escapeMarkdownTable(result.stage)} | ${result.status} |`,
    ),
    "",
  ];

  return lines.join("\n");
}

function escapeMarkdownTable(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function writeResultArtifacts(results: TestResult[], outputDir = "test-results/latest"): void {
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(path.join(outputDir, "summary.md"), buildSummaryMarkdown(results));
  writeFileSync(path.join(outputDir, "results.json"), `${JSON.stringify(buildResultsJson(results), null, 2)}\n`);
}

function printResults(results: TestResult[]): void {
  const summary = summarize(results);

  for (const result of results) {
    console.log(`${result.status} ${result.id} - ${result.title}`);
    for (const detail of result.details) {
      console.log(`  ${detail}`);
    }
  }

  console.log("");
  console.log(`Summary: ${summary} (${results.length} test file(s))`);
}

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    const results = options.dry
      ? loadRuntimeTests(options.testsDir)
      : await runLlmJudgedTests(options.testsDir);

    printResults(results);
    writeResultArtifacts(results);

    const summary = summarize(results);
    process.exitCode = summary === "FAIL" ? 1 : 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}

export {
  findMarkdownFiles,
  buildResultsJson,
  buildSummaryMarkdown,
  loadRuntimeTests,
  parseFrontmatter,
  parseMinimalYaml,
  runLlmJudgedTests,
  summarize,
  TodoRuntimeJudge,
  validateRuntimeTest,
  writeResultArtifacts,
};
