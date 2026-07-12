import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

interface WorkflowStage {
  runtime: string;
  policy: "required" | "conditional";
}

interface WorkflowDefinition {
  id: string;
  file: string;
  entryRuntime: string;
  stages: WorkflowStage[];
}

interface RuntimeDefinition {
  path: string;
  status: "active" | "planned";
}

interface WorkflowRegistry {
  version: number;
  runtimeRoot: string;
  runtimes: Record<string, RuntimeDefinition>;
  workflows: WorkflowDefinition[];
}

const root = process.cwd();
const read = (filePath: string): string =>
  readFileSync(path.join(root, filePath), "utf8");
const registry = JSON.parse(
  read("skill/workflows/registry.json"),
) as WorkflowRegistry;

describe("Studio OS progressive skill layout", () => {
  it("uses the canonical progressive Loader from the root skill", () => {
    const rootSkill = read("skill/SKILL.md");

    assert.match(rootSkill, /^---\nname: studio-os\n/);
    assert.match(rootSkill, /skill\/core\/LOADER\.md/);
    assert.doesNotMatch(rootSkill, /`skill\/LOADER\.md`/);
    assert.doesNotMatch(rootSkill, /read all Studio OS files/i);
  });

  it("keeps public documentation out of mandatory startup loading", () => {
    const loader = read("skill/core/LOADER.md");

    assert.match(loader, /skill\/core\/INVARIANTS\.md/);
    assert.match(loader, /skill\/workflows\/registry\.json/);
    assert.match(loader, /selected workflow Markdown file/);
    assert.match(loader, /active Runtime `SKILL\.md`/);
    assert.doesNotMatch(loader, /docs\/HOW_IT_WORKS\.md/);
    assert.doesNotMatch(loader, /docs\/NAVIGATOR\.md/);
    assert.doesNotMatch(loader, /docs\/PRINCIPLES\.md/);
  });

  it("resolves every workflow and Runtime path in the registry", () => {
    assert.equal(registry.version, 1);
    assert.equal(registry.runtimeRoot, "skill/runtimes");

    const workflowIds = registry.workflows.map((workflow) => workflow.id);
    assert.equal(new Set(workflowIds).size, workflowIds.length);

    for (const runtime of Object.values(registry.runtimes)) {
      assert.equal(existsSync(path.join(root, runtime.path)), true, runtime.path);
      assert.ok(["active", "planned"].includes(runtime.status), runtime.status);
    }

    for (const workflow of registry.workflows) {
      assert.equal(existsSync(path.join(root, workflow.file)), true, workflow.file);
      assert.equal(workflow.stages[0]?.runtime, workflow.entryRuntime);

      for (const stage of workflow.stages) {
        assert.ok(stage.runtime in registry.runtimes, stage.runtime);
        assert.ok(["required", "conditional"].includes(stage.policy), stage.policy);
      }
    }
  });

  it("gives every canonical Runtime valid skill metadata", () => {
    for (const [runtimeId, runtime] of Object.entries(registry.runtimes)) {
      const source = read(runtime.path);

      assert.match(source, /^---\nname: [a-z0-9-]+\n/);
      assert.match(source, /\ndescription: .+\n---\n/);
      assert.match(source, /^# .+Runtime/m, runtimeId);

      if (runtime.status === "active") {
        assert.match(source, /^#+ Goal$/m, runtimeId);
        assert.match(source, /^#+ Stop Condition$/m, runtimeId);
      } else {
        assert.match(source, /Status: Work in progress\./, runtimeId);
      }
    }
  });

  it("keeps optional Runtime references one level deep and resolvable", () => {
    for (const runtime of Object.values(registry.runtimes)) {
      const source = read(runtime.path);
      const runtimeDir = path.dirname(path.join(root, runtime.path));
      const references = source.matchAll(/`(references\/[a-z0-9-]+\.md)`/g);

      for (const match of references) {
        assert.equal(existsSync(path.join(runtimeDir, match[1])), true, match[1]);
      }
    }
  });

  it("preserves legacy Runtime entries as small compatibility pointers", () => {
    const compatibilityEntries: Record<string, string> = {
      "skill/LOADER.md": "skill/core/LOADER.md",
      "skill/CONVERSATION_ROUTER.md": "skill/core/CONVERSATION_ROUTER.md",
      "skill/INTERACTION.md": "skill/core/INTERACTION.md",
      "skill/RUNTIME_SPEC.md": "skill/core/RUNTIME_SPEC.md",
      "skill/INTERVIEW.md": "skill/runtimes/interview/SKILL.md",
      "skill/DISCOVERY.md": "skill/runtimes/discovery/SKILL.md",
      "skill/BRIEFING.md": "skill/runtimes/briefing/SKILL.md",
      "skill/BROWNFIELD.md": "skill/runtimes/brownfield/SKILL.md",
      "skill/PLANNING.md": "skill/runtimes/planning/SKILL.md",
      "skill/RESEARCH.md": "skill/runtimes/research/SKILL.md",
      "skill/DESIGN_STRATEGY.md": "skill/runtimes/design-strategy/SKILL.md",
      "skill/ARCHITECTURE.md": "skill/runtimes/architecture/SKILL.md",
      "skill/DEVELOPMENT.md": "skill/runtimes/development/SKILL.md",
      "skill/VALIDATION.md": "skill/runtimes/validation/SKILL.md",
      "skill/QA.md": "skill/runtimes/qa/SKILL.md",
      "skill/RELEASE.md": "skill/runtimes/release/SKILL.md",
      "skill/RETROSPECTIVE.md": "skill/runtimes/retrospective/SKILL.md",
      "skill/EVOLUTION.md": "skill/runtimes/evolution/SKILL.md",
      "skill/WORK_ITEM.md": "skill/runtimes/work-item/SKILL.md",
    };

    for (const [entryPath, canonicalPath] of Object.entries(compatibilityEntries)) {
      const source = read(entryPath);

      assert.match(source, /# Compatibility Entry/);
      assert.match(source, new RegExp(canonicalPath.replaceAll("/", "\\/")));
      assert.ok(source.split("\n").length <= 12, entryPath);
    }
  });

  it("keeps Briefing prohibitions mandatory and details conditional", () => {
    const briefing = read("skill/runtimes/briefing/SKILL.md");

    assert.match(briefing, /# Forbidden/);
    assert.match(briefing, /choose stack/);
    assert.match(briefing, /write code/);
    assert.match(briefing, /references\/patterns\.md/);
    assert.match(briefing, /references\/anti-patterns\.md/);
  });
});
