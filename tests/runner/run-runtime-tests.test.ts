import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  findMarkdownFiles,
  loadRuntimeTests,
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

  it("LLM mode returns partial while judge implementation is pending", async () => {
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

    const results = await runLlmJudgedTests(directory);

    assert.equal(results[0].status, "PARTIAL");
    assert.equal(summarize(results), "PARTIAL");
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
    const summary = readFileSync(summaryPath, "utf8");
    const results = JSON.parse(readFileSync(resultsPath, "utf8"));

    assert.equal(existsSync(summaryPath), true);
    assert.equal(existsSync(resultsPath), true);
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
  });
});
