import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const repositoryRoot = process.cwd();
const read = (relativePath: string): string =>
  readFileSync(path.join(repositoryRoot, relativePath), "utf8");
const normalized = (relativePath: string): string =>
  read(relativePath).replaceAll(/\s+/g, " ");

describe("Studio OS adapter root resolution", () => {
  it("anchors packaged activation to the exact loaded skill path", () => {
    const hostSkill = normalized("skills/studio-os/SKILL.md");
    const simulatedPluginRoot = path.join(
      path.parse(repositoryRoot).root,
      "agent-cache",
      "marketplace",
      "studio-os",
      "studio-os",
      "published-version",
    );
    const loadedSkillPath = path.join(
      simulatedPluginRoot,
      "skills",
      "studio-os",
      "SKILL.md",
    );

    assert.equal(
      path.resolve(path.dirname(loadedSkillPath), "..", ".."),
      simulatedPluginRoot,
    );
    assert.match(hostSkill, /exact absolute path of this loaded `SKILL\.md`/i);
    assert.match(hostSkill, /two parent directories/i);
    assert.match(hostSkill, /Do not reconstruct/i);
    assert.match(hostSkill, /marketplace|cache/i);
    assert.match(hostSkill, /current working directory/i);
  });

  it("verifies the derived root and fails closed when it is invalid", () => {
    const hostSkill = normalized("skills/studio-os/SKILL.md");
    const bootstrap = normalized("adapters/universal/BOOTSTRAP.md");

    for (const marker of [
      "adapters/universal/BOOTSTRAP.md",
      "skill/core/LOADER.md",
      "skill/workflows/registry.json",
    ]) {
      assert.ok(hostSkill.includes(marker));
    }

    assert.match(hostSkill, /adapter\/bootstrap failure/i);
    assert.match(hostSkill, /stop/i);
    assert.match(hostSkill, /must not search|do not search/i);
    assert.match(hostSkill, /must not call|do not call/i);
    assert.match(bootstrap, /confirmed Studio OS Root/i);
  });

  it("resolves Runtime contracts and templates only from the confirmed root", () => {
    const bootstrap = normalized("adapters/universal/BOOTSTRAP.md");
    const loader = normalized("skill/core/LOADER.md");
    const validation = normalized("skill/runtimes/validation/SKILL.md");

    assert.match(bootstrap, /relative to the confirmed Studio OS Root/i);
    assert.match(loader, /relative to the confirmed Studio OS Root/i);
    assert.match(loader, /not relative to the Target Workspace/i);
    assert.match(loader, /package integrity failure/i);
    assert.match(validation, /skill\/standards\/registry\.json/);
    assert.match(validation, /Studio OS Root/i);
    assert.match(validation, /templates\/validation-report\.md/);
  });
});
