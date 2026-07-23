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
  capabilities: string[];
  standards: string[];
}

interface WorkflowRegistry {
  version: number;
  runtimeRoot: string;
  runtimes: Record<string, RuntimeDefinition>;
  workflows: WorkflowDefinition[];
}

interface CapabilityRegistry {
  version: number;
  capabilities: Record<string, { path: string }>;
}

interface StandardDefinition {
  path: string;
  kind: "core" | "domain" | "stack";
  appliesTo: string[];
}

interface StandardRegistry {
  version: number;
  baseline: string[];
  standards: Record<string, StandardDefinition>;
}

const root = process.cwd();
const read = (filePath: string): string =>
  readFileSync(path.join(root, filePath), "utf8");
const registry = JSON.parse(
  read("skill/workflows/registry.json"),
) as WorkflowRegistry;
const capabilityRegistry = JSON.parse(
  read("skill/capabilities/registry.json"),
) as CapabilityRegistry;
const standardRegistry = JSON.parse(
  read("skill/standards/registry.json"),
) as StandardRegistry;

describe("Studio OS progressive skill layout", () => {
  it("uses the canonical universal Bootstrap from the root skill", () => {
    const rootSkill = read("skill/SKILL.md");

    assert.match(rootSkill, /^---\nname: studio-os\n/);
    assert.match(rootSkill, /adapters\/universal\/BOOTSTRAP\.md/);
    assert.doesNotMatch(rootSkill, /`skill\/LOADER\.md`/);
    assert.doesNotMatch(rootSkill, /read all Studio OS files/i);
  });

  it("routes packaged host adapters through the universal Bootstrap", () => {
    const bootstrap = read("adapters/universal/BOOTSTRAP.md");
    const hostSkill = read("skills/studio-os/SKILL.md");
    const codexMetadata = read("skills/studio-os/agents/openai.yaml");
    const codexPlugin = JSON.parse(read(".codex-plugin/plugin.json")) as {
      name: string;
      skills: string;
    };
    const claudePlugin = JSON.parse(read(".claude-plugin/plugin.json")) as {
      name: string;
      displayName: string;
      version: string;
      skills: string;
    };
    const claudeMarketplace = JSON.parse(
      read(".claude-plugin/marketplace.json"),
    ) as {
      name: string;
      plugins: Array<{
        name: string;
        source: {
          source: string;
          url: string;
          ref: string;
        };
      }>;
    };
    const packageManifest = JSON.parse(read("package.json")) as {
      version: string;
    };

    assert.equal(codexPlugin.name, "studio-os");
    assert.equal(codexPlugin.skills, "./skills/");
    assert.equal(claudePlugin.name, "studio-os");
    assert.equal(claudePlugin.displayName, "Studio OS");
    assert.equal(claudePlugin.version, packageManifest.version);
    assert.equal(claudePlugin.skills, "./skills/");
    assert.equal(claudeMarketplace.name, "studio-os");
    assert.equal(claudeMarketplace.plugins[0]?.name, "studio-os");
    assert.deepEqual(claudeMarketplace.plugins[0]?.source, {
      source: "url",
      url: "https://github.com/Aleksei2507/studio-os.git",
      ref: `v${packageManifest.version}`,
    });
    assert.match(hostSkill, /^---\nname: studio-os\n/);
    assert.match(hostSkill, /universal\/BOOTSTRAP\.md/);
    assert.doesNotMatch(hostSkill, /\bCodex\b/);
    assert.match(codexMetadata, /allow_implicit_invocation: true/);
    assert.match(bootstrap, /skill\/core\/LOADER\.md/);
    assert.match(bootstrap, /skill\/core\/INVARIANTS\.md/);
    assert.match(bootstrap, /skill\/workflows\/registry\.json/);
    assert.match(bootstrap, /skill\/core\/INTERACTION\.md/);
    assert.match(bootstrap, /Do not plan or implement the product before Loader/);
    assert.match(bootstrap, /Do not load README or user documentation at startup/);
  });

  it("keeps public documentation out of mandatory startup loading", () => {
    const loader = read("skill/core/LOADER.md");

    assert.match(loader, /skill\/core\/INVARIANTS\.md/);
    assert.match(loader, /skill\/workflows\/registry\.json/);
    assert.match(loader, /skill\/standards\/registry\.json/);
    assert.match(loader, /selected workflow Markdown file/);
    assert.match(loader, /active Runtime `SKILL\.md`/);
    assert.doesNotMatch(loader, /docs\/HOW_IT_WORKS\.md/);
    assert.doesNotMatch(loader, /docs\/NAVIGATOR\.md/);
    assert.doesNotMatch(loader, /docs\/PRINCIPLES\.md/);
    assert.doesNotMatch(loader, /skill\/standards\/domains\/mobile\.md/);
  });

  it("resolves every workflow and Runtime path in the registry", () => {
    assert.equal(registry.version, 1);
    assert.equal(registry.runtimeRoot, "skill/runtimes");

    const workflowIds = registry.workflows.map((workflow) => workflow.id);
    assert.equal(new Set(workflowIds).size, workflowIds.length);

    for (const runtime of Object.values(registry.runtimes)) {
      assert.equal(existsSync(path.join(root, runtime.path)), true, runtime.path);
      assert.ok(["active", "planned"].includes(runtime.status), runtime.status);

      for (const capabilityId of runtime.capabilities) {
        assert.ok(capabilityId in capabilityRegistry.capabilities, capabilityId);
      }

      for (const standardId of runtime.standards) {
        assert.ok(standardId in standardRegistry.standards, standardId);
      }
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

  it("resolves capability contracts declared by active Runtimes", () => {
    assert.equal(capabilityRegistry.version, 1);

    for (const [capabilityId, capability] of Object.entries(
      capabilityRegistry.capabilities,
    )) {
      assert.equal(existsSync(path.join(root, capability.path)), true, capability.path);

      const consumers = Object.values(registry.runtimes).filter((runtime) =>
        runtime.capabilities.includes(capabilityId),
      );
      assert.ok(consumers.length > 0, capabilityId);

      for (const runtime of consumers) {
        assert.ok(read(runtime.path).includes(`\`${capabilityId}\``), capabilityId);
      }
    }
  });

  it("resolves progressive standards declared by active Runtimes", () => {
    assert.equal(standardRegistry.version, 1);

    for (const standardId of standardRegistry.baseline) {
      assert.ok(standardId in standardRegistry.standards, standardId);
      assert.equal(standardRegistry.standards[standardId]?.kind, "core", standardId);
    }

    for (const [standardId, standard] of Object.entries(
      standardRegistry.standards,
    )) {
      assert.equal(existsSync(path.join(root, standard.path)), true, standard.path);
      assert.ok(["core", "domain", "stack"].includes(standard.kind), standardId);
      assert.ok(standard.appliesTo.length > 0, standardId);

      for (const runtimeId of standard.appliesTo) {
        assert.ok(runtimeId in registry.runtimes, `${standardId}:${runtimeId}`);
      }
    }

    for (const [runtimeId, runtime] of Object.entries(registry.runtimes)) {
      const source = read(runtime.path);

      for (const standardId of runtime.standards) {
        assert.ok(source.includes(`\`${standardId}\``), `${runtimeId}:${standardId}`);
      }
    }

    const architecture = read("skill/runtimes/architecture/SKILL.md");
    assert.match(architecture, /skill\/standards\/STANDARD_SPEC\.md/);
    assert.match(architecture, /skill\/standards\/TECHNOLOGY_SELECTION\.md/);
    assert.match(architecture, /templates\/standards-profile\.md/);

    const profileTemplate = read("templates/standards-profile.md");
    assert.match(profileTemplate, /Scope: Project \| Work Item/);
    assert.match(profileTemplate, /Status: Observed \| Provisional \| Accepted/);
    assert.match(profileTemplate, /Studio Delivery, Operations, And Support Model/);
    assert.match(profileTemplate, /Approved Deviations/);

    const technologySelection = read("skill/standards/TECHNOLOGY_SELECTION.md");
    assert.match(technologySelection, /user is the product owner and client/i);
    assert.match(technologySelection, /Do not ask what languages or frameworks/i);
    assert.match(technologySelection, /continued support/i);
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

  it("resolves output templates referenced by Runtime contracts", () => {
    for (const runtime of Object.values(registry.runtimes)) {
      const source = read(runtime.path);
      const templates = source.matchAll(/`(templates\/[a-z0-9-]+\.md)`/g);

      for (const match of templates) {
        assert.equal(existsSync(path.join(root, match[1])), true, match[1]);
      }
    }
  });

  it("places conditional Interface Design after Architecture and before Development", () => {
    assert.ok("interface-design" in registry.runtimes);

    for (const workflowId of [
      "greenfield",
      "brownfield",
      "work-item-feature",
    ]) {
      const workflow = registry.workflows.find((item) => item.id === workflowId);
      assert.ok(workflow, workflowId);

      const runtimeIds = workflow.stages.map((stage) => stage.runtime);
      const architectureIndex = runtimeIds.indexOf("architecture");
      const interfaceDesignIndex = runtimeIds.indexOf("interface-design");
      const developmentIndex = runtimeIds.indexOf("development");

      assert.ok(interfaceDesignIndex > architectureIndex, workflowId);
      assert.ok(interfaceDesignIndex < developmentIndex, workflowId);
      assert.equal(
        workflow.stages[interfaceDesignIndex]?.policy,
        "conditional",
        workflowId,
      );
    }
  });

  it("places Product Outcome after QA and before milestone Release", () => {
    assert.ok("product-outcome" in registry.runtimes);

    for (const workflowId of [
      "greenfield",
      "brownfield",
      "work-item-feature",
    ]) {
      const workflow = registry.workflows.find((item) => item.id === workflowId);
      assert.ok(workflow, workflowId);

      const runtimeIds = workflow.stages.map((stage) => stage.runtime);
      const qaIndex = runtimeIds.indexOf("qa");
      const productOutcomeIndex = runtimeIds.indexOf("product-outcome");
      const releaseIndex = runtimeIds.indexOf("release");

      assert.ok(productOutcomeIndex > qaIndex, workflowId);
      assert.ok(productOutcomeIndex < releaseIndex, workflowId);
      assert.equal(
        workflow.stages[productOutcomeIndex]?.policy,
        "required",
        workflowId,
      );
    }

    const runtime = read("skill/runtimes/product-outcome/SKILL.md");
    const template = read("templates/product-outcome-report.md");
    const projectMemory = read("skill/core/PROJECT_MEMORY.md");
    const router = read("skill/core/CONVERSATION_ROUTER.md");
    const greenfield = read("skill/workflows/greenfield.md");
    const release = read("skill/runtimes/release/SKILL.md");

    assert.match(runtime, /PASS/);
    assert.match(runtime, /CONTINUE/);
    assert.match(runtime, /BLOCKED/);
    assert.match(runtime, /RE-SCOPE/);
    assert.match(runtime, /Only Product Outcome may set `Product Readiness: Ready for Release`/);
    assert.match(template, /Evidence Matrix/);
    assert.match(projectMemory, /Target Milestone:/);
    assert.match(projectMemory, /Product Readiness:/);
    assert.match(projectMemory, /Current Increment:/);
    assert.match(projectMemory, /Increment Progress:/);
    assert.match(router, /Defect Versus Planned Scope/);
    assert.match(greenfield, /`CONTINUE` -> select the next incomplete roadmap increment/);
    assert.match(release, /Product Outcome `PASS`/);
  });

  it("keeps Interface Design platform-aware without taking technology ownership", () => {
    const runtime = read("skill/runtimes/interface-design/SKILL.md");
    const web = read("skill/runtimes/interface-design/references/web.md");
    const mobile = read("skill/runtimes/interface-design/references/mobile.md");
    const desktop = read("skill/runtimes/interface-design/references/desktop.md");

    assert.match(runtime, /Architecture owns technology selection/);
    assert.match(runtime, /docs\/interface-design\.md/);
    assert.match(runtime, /references\/web\.md/);
    assert.match(runtime, /references\/mobile\.md/);
    assert.match(runtime, /references\/desktop\.md/);
    assert.doesNotMatch(runtime, /default to (HTML|Tailwind)/i);

    assert.match(web, /Next\.js/);
    assert.match(web, /Nuxt UI/);
    assert.match(web, /Three\.js/);
    assert.match(mobile, /SwiftUI/);
    assert.match(mobile, /Jetpack Compose/);
    assert.match(mobile, /React Native/);
    assert.match(mobile, /Flutter/);
    assert.match(desktop, /JavaFX/);
    assert.match(desktop, /WinUI 3/);
    assert.match(desktop, /Avalonia/);
    assert.match(desktop, /Uno Platform/);
  });

  it("captures and progressively consumes the project design system", () => {
    const template = read("templates/design-system-profile.md");
    const invariants = read("skill/core/INVARIANTS.md");
    const projectMemory = read("skill/core/PROJECT_MEMORY.md");
    const loader = read("skill/core/LOADER.md");
    const brownfield = read("skill/runtimes/brownfield/SKILL.md");
    const designStrategy = read("skill/runtimes/design-strategy/SKILL.md");
    const architecture = read("skill/runtimes/architecture/SKILL.md");
    const interfaceDesign = read("skill/runtimes/interface-design/SKILL.md");
    const development = read("skill/runtimes/development/SKILL.md");
    const qa = read("skill/runtimes/qa/SKILL.md");

    assert.match(template, /Status: Observed \| Provisional \| Accepted/);
    assert.match(template, /Applicability: Active \| Not Applicable \| Unknown/);
    assert.match(template, /Preservation Policy/);
    assert.match(template, /Evidence/);
    assert.match(template, /System Boundaries/);
    assert.match(template, /Conflicts And Unknowns/);

    assert.match(invariants, /Project Design System Profile is the source of truth/);
    assert.match(projectMemory, /\.studio\/design-system-profile\.md/);
    assert.match(loader, /Project Design System Profile/);
    assert.match(loader, /active Runtime needs design-system evidence/);
    assert.match(brownfield, /templates\/design-system-profile\.md/);
    assert.match(brownfield, /Status: Observed/);
    assert.match(brownfield, /multiple design systems/i);
    assert.match(designStrategy, /\.studio\/design-system-profile\.md/);
    assert.match(architecture, /\.studio\/design-system-profile\.md/);
    assert.match(interfaceDesign, /\.studio\/design-system-profile\.md/);
    assert.match(development, /\.studio\/design-system-profile\.md/);
    assert.match(qa, /\.studio\/design-system-profile\.md/);
  });

  it("keeps persisted project file references portable", () => {
    const bootstrap = read("adapters/universal/BOOTSTRAP.md");
    const invariants = read("skill/core/INVARIANTS.md");
    const projectMemory = read("skill/core/PROJECT_MEMORY.md");
    const runtimeSpec = read("skill/core/RUNTIME_SPEC.md");
    const brownfield = read("skill/runtimes/brownfield/SKILL.md");

    assert.match(bootstrap, /project-relative paths/);
    assert.match(invariants, /machine-specific absolute filesystem paths/);
    assert.match(projectMemory, /Project-Local Reference Contract/);
    assert.match(projectMemory, /Downloads/);
    assert.match(projectMemory, /parent traversal/);
    assert.match(projectMemory, /stable external URLs/i);
    assert.match(runtimeSpec, /Artifact Portability Gate/);
    assert.match(brownfield, /outside the Target Workspace/);
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
      "skill/INTERFACE_DESIGN.md": "skill/runtimes/interface-design/SKILL.md",
      "skill/ARCHITECTURE.md": "skill/runtimes/architecture/SKILL.md",
      "skill/DEVELOPMENT.md": "skill/runtimes/development/SKILL.md",
      "skill/VALIDATION.md": "skill/runtimes/validation/SKILL.md",
      "skill/QA.md": "skill/runtimes/qa/SKILL.md",
      "skill/PRODUCT_OUTCOME.md": "skill/runtimes/product-outcome/SKILL.md",
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
