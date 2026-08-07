import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import {
  buildReleaseArchive,
  expectedReleaseTag,
  listZipEntries,
  parseReleaseManifest,
  readReleaseMetadata,
  readReleaseManifest,
  validateReleaseMetadata,
  validateReleaseManifest,
} from "../../scripts/build-release.ts";

const root = process.cwd();
const read = (relativePath: string): string =>
  readFileSync(path.join(root, relativePath), "utf8");
const currentReleaseTag = expectedReleaseTag(
  readReleaseMetadata().packageVersion,
);

const releaseFixtureManifest = {
  version: 1,
  includeTrees: [
    "adapters/universal",
    "skill",
    "skills/studio-os",
    "templates",
  ],
  includeFiles: [
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
    ".claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
    "CHANGELOG.md",
    "LICENSE",
    "README.md",
    "docs/RELEASING.md",
  ],
  requiredFiles: [
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
    ".claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
    "LICENSE",
    "README.md",
    "adapters/universal/BOOTSTRAP.md",
    "skill/SKILL.md",
    "skills/studio-os/SKILL.md",
    "templates/README.md",
  ],
  forbiddenPrefixes: [
    ".studio",
    ".github",
    "docs/qa-report.md",
    "examples",
    "modules",
    "scripts",
    "test-results",
    "tests",
    "website",
  ],
};

const releaseFixtureFiles: Record<string, string> = {
  ".studio/project-state.md": "Current Stage: Development\n",
  ".agents/plugins/marketplace.json": "{}\n",
  ".claude-plugin/marketplace.json": "{}\n",
  ".claude-plugin/plugin.json": "{}\n",
  ".codex-plugin/plugin.json": "{}\n",
  ".gitattributes": [
    ".gitattributes export-ignore",
    ".github export-ignore",
    ".gitignore export-ignore",
    "scripts export-ignore",
    "tests export-ignore",
    "package.json export-ignore",
    "package-lock.json export-ignore",
    ".studio export-ignore",
    "docs/qa-report.md export-ignore",
    "",
  ].join("\n"),
  ".github/workflows/release.yml": "name: Release\n",
  ".gitignore": "dist/\n",
  "CHANGELOG.md": "# Changelog\n",
  "LICENSE": "MIT\n",
  "README.md": "# Studio OS\n",
  "adapters/universal/BOOTSTRAP.md": "# Universal Bootstrap\n",
  "docs/RELEASING.md": "# Releasing Studio OS\n",
  "docs/architecture.md": "# Architecture\n",
  "docs/delivery-estimate.md": "# Delivery Estimate\n",
  "docs/development-roadmap.md": "# Development Roadmap\n",
  "docs/discovery-summary.md": "# Discovery Summary\n",
  "docs/project-brief.md": "# Project Brief\n",
  "docs/qa-report.md": "# QA Report\n",
  "examples/README.md": "# Examples\n",
  "modules/README.md": "# Modules\n",
  "notes/private.md": "Maintainer notes\n",
  "package-lock.json": "{}\n",
  "package.json": "{}\n",
  "scripts/build-release.ts": "export {};\n",
  "scripts/release-manifest.json":
    `${JSON.stringify(releaseFixtureManifest, null, 2)}\n`,
  "skill/SKILL.md": "# Studio OS Core\n",
  "skills/studio-os/SKILL.md": "# Studio OS Adapter\n",
  "templates/README.md": "# Templates\n",
  "tests/release.test.ts": "export {};\n",
  "website/index.html": "<!doctype html>\n",
};

function git(repoRoot: string, args: string[]): void {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
}

function createReleaseFixture(
  omit: string[] = [],
  overrides: Record<string, string> = {},
): string {
  const repoRoot = mkdtempSync(path.join(tmpdir(), "studio-os-release-"));

  for (const [relativePath, source] of Object.entries(releaseFixtureFiles)) {
    if (omit.includes(relativePath)) {
      continue;
    }

    const filePath = path.join(repoRoot, relativePath);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, overrides[relativePath] ?? source);
  }

  git(repoRoot, ["init"]);
  git(repoRoot, ["add", "."]);
  git(repoRoot, [
    "-c",
    "user.name=Studio OS Tests",
    "-c",
    "user.email=tests@studio-os.local",
    "commit",
    "-m",
    "Create release fixture",
  ]);
  git(repoRoot, ["tag", currentReleaseTag]);

  return repoRoot;
}

describe("Studio OS GitHub distribution", () => {
  it("derives a versioned Git tag from the package version", () => {
    assert.equal(expectedReleaseTag("0.5.0-alpha.1"), "v0.5.0-alpha.1");
    assert.throws(() => expectedReleaseTag("latest"), /Invalid release version/);
  });

  it("keeps package, host plugins, marketplaces, and release tag aligned", () => {
    const metadata = readReleaseMetadata();
    const releaseTag = expectedReleaseTag(metadata.packageVersion);

    assert.equal(validateReleaseMetadata(metadata), releaseTag);
    assert.equal(metadata.packageLockVersion, metadata.packageVersion);
    assert.equal(metadata.packageLockRootVersion, metadata.packageVersion);
    assert.equal(metadata.marketplaceSource, "url");
    assert.equal(
      metadata.marketplaceUrl,
      "https://github.com/Aleksei2507/studio-os.git",
    );
    assert.equal(metadata.claudePluginVersion, metadata.packageVersion);
    assert.equal(metadata.claudeMarketplaceSource, "url");
    assert.equal(
      metadata.claudeMarketplaceUrl,
      "https://github.com/Aleksei2507/studio-os.git",
    );
    assert.equal(metadata.claudeMarketplaceRef, releaseTag);
  });

  it("rejects a package lock version that does not match the package", () => {
    const metadata = readReleaseMetadata();

    assert.throws(
      () =>
        validateReleaseMetadata({
          ...metadata,
          packageLockVersion: "0.4.0-alpha",
        }),
      /Package lock version must match package version/,
    );
  });

  it("rejects a marketplace ref that does not match the release version", () => {
    const metadata = readReleaseMetadata();

    assert.throws(
      () =>
        validateReleaseMetadata({
          ...metadata,
          marketplaceRef: "main",
        }),
      /Marketplace ref must match the release tag/,
    );
  });

  it("rejects a Claude marketplace ref that does not match the release version", () => {
    const metadata = readReleaseMetadata();

    assert.throws(
      () =>
        validateReleaseMetadata({
          ...metadata,
          claudeMarketplaceRef: "main",
        }),
      /Claude marketplace ref must match the release tag/,
    );
  });

  it("rejects a Claude marketplace source that can select SSH transport", () => {
    const metadata = readReleaseMetadata();

    assert.throws(
      () =>
        validateReleaseMetadata({
          ...metadata,
          claudeMarketplaceSource: "github",
          claudeMarketplaceUrl: undefined,
        }),
      /Claude plugin source must use an explicit HTTPS URL/,
    );
  });

  it("runs all required gates before publishing a GitHub release", () => {
    const workflow = read(".github/workflows/release.yml");

    assert.match(workflow, /tags:\n\s+- "v\*"/);
    assert.match(workflow, /npm run test:runner/);
    assert.match(workflow, /npm run test:runtime:dry/);
    assert.match(workflow, /npm run release:check/);
    assert.match(workflow, /npm run release:build/);
    assert.match(workflow, /gh release create/);
    assert.match(workflow, /--prerelease/);
  });

  it("keeps development-only files out of the downloadable archive", () => {
    const attributes = read(".gitattributes");
    const manifest = JSON.parse(read("scripts/release-manifest.json")) as {
      includeTrees: string[];
      includeFiles: string[];
      forbiddenPrefixes: string[];
    };

    assert.match(attributes, /^\.github export-ignore$/m);
    assert.match(attributes, /^scripts export-ignore$/m);
    assert.match(attributes, /^tests export-ignore$/m);
    assert.match(attributes, /^\.studio export-ignore$/m);
    assert.match(attributes, /^docs\/qa-report\.md export-ignore$/m);
    assert.doesNotMatch(attributes, /^adapters export-ignore$/m);
    assert.doesNotMatch(attributes, /^skill export-ignore$/m);
    assert.doesNotMatch(attributes, /^skills export-ignore$/m);
    assert.deepEqual(manifest.includeTrees, [
      "adapters/universal",
      "skill",
      "skills/studio-os",
      "templates",
    ]);
    assert.ok(manifest.includeFiles.includes("docs/RELEASING.md"));
    assert.ok(!manifest.includeFiles.includes("docs/discovery-summary.md"));
    assert.ok(manifest.forbiddenPrefixes.includes(".studio"));
    assert.ok(
      manifest.forbiddenPrefixes.includes("docs/discovery-summary.md"),
    );
    assert.ok(manifest.forbiddenPrefixes.includes("docs/adr"));
    assert.ok(manifest.forbiddenPrefixes.includes("docs/qa-report.md"));
    assert.ok(manifest.forbiddenPrefixes.includes("website"));
  });

  it("ships current installation guidance and complete declared license terms", () => {
    const readme = read("README.md");
    const installation = read("docs/INSTALLATION.md");
    const navigator = read("docs/NAVIGATOR.md");
    const license = read("LICENSE");

    assert.match(readme, /codex plugin marketplace add Aleksei2507\/studio-os/);
    assert.match(installation, /codex plugin add studio-os@studio-os/);
    assert.match(
      installation,
      /\/plugin marketplace add Aleksei2507\/studio-os/,
    );
    assert.match(installation, /\/studio-os:studio-os/);
    assert.match(installation, /adapters\/universal\/BOOTSTRAP\.md/);
    assert.match(navigator, /\/studio-os:studio-os/);
    assert.match(navigator, /adapters\/universal\/BOOTSTRAP\.md/);

    for (const source of [installation, navigator]) {
      assert.doesNotMatch(source, /\/studio:start/);
      assert.doesNotMatch(source, /~\/\.studio-os/);
      assert.doesNotMatch(source, /\.mimo\//);
    }

    assert.match(
      license,
      /^Copyright \(c\) \d{4}(?:-\d{4})? Aleksei2507$/m,
    );
    assert.match(license, /Permission is hereby granted, free of charge/);
    assert.match(license, /The above copyright notice and this permission notice/);
    assert.match(license, /THE SOFTWARE IS PROVIDED "AS IS"/);
    assert.ok(Buffer.byteLength(license, "utf8") > 900);
  });

  it("rejects unsafe or ambiguous release manifests", () => {
    const manifest = readReleaseManifest();

    assert.doesNotThrow(() => validateReleaseManifest(manifest));
    assert.throws(
      () =>
        validateReleaseManifest({
          ...manifest,
          includeFiles: [...manifest.includeFiles, "../private.md"],
        }),
      /must not contain traversal/,
    );
    assert.throws(
      () =>
        validateReleaseManifest({
          ...manifest,
          requiredFiles: [...manifest.requiredFiles, "missing.md"],
        }),
      /Required release file is not included by the manifest/,
    );
    assert.throws(
      () =>
        validateReleaseManifest({
          ...manifest,
          includeFiles: [...manifest.includeFiles, "docs/*.md"],
        }),
      /must not contain pathspec patterns/,
    );
    assert.throws(
      () =>
        validateReleaseManifest({
          ...manifest,
          includeTrees: [...manifest.includeTrees, "skill/core"],
        }),
      /includeTrees overlap/,
    );
    assert.throws(
      () =>
        validateReleaseManifest({
          ...manifest,
          includeFiles: [
            ...manifest.includeFiles,
            ".studio/project-state.md",
          ],
        }),
      /includes forbidden path/,
    );
    assert.throws(
      () =>
        parseReleaseManifest(
          JSON.stringify({
            ...manifest,
            unexpected: true,
          }),
        ),
      /unknown or missing fields/,
    );
  });

  it("builds a checksummed archive only from a clean tagged checkout", () => {
    const repoRoot = createReleaseFixture();

    const artifacts = buildReleaseArchive(repoRoot, currentReleaseTag);
    const archiveName = path.basename(artifacts.archivePath);
    const prefix = `studio-os-${currentReleaseTag}/`;
    const entries = listZipEntries(artifacts.archivePath);
    const digest = createHash("sha256")
      .update(readFileSync(artifacts.archivePath))
      .digest("hex");

    assert.equal(existsSync(artifacts.archivePath), true);
    assert.equal(
      readFileSync(artifacts.checksumPath, "utf8"),
      `${digest}  ${archiveName}\n`,
    );
    assert.ok(entries.includes(`${prefix}.agents/plugins/marketplace.json`));
    assert.ok(entries.includes(`${prefix}.claude-plugin/marketplace.json`));
    assert.ok(entries.includes(`${prefix}.claude-plugin/plugin.json`));
    assert.ok(entries.includes(`${prefix}.codex-plugin/plugin.json`));
    assert.ok(entries.includes(`${prefix}adapters/universal/BOOTSTRAP.md`));
    assert.ok(entries.includes(`${prefix}skill/SKILL.md`));
    assert.ok(entries.includes(`${prefix}skills/studio-os/SKILL.md`));
    assert.ok(entries.includes(`${prefix}templates/README.md`));
    assert.ok(entries.includes(`${prefix}README.md`));
    assert.ok(entries.includes(`${prefix}LICENSE`));
    assert.ok(entries.includes(`${prefix}CHANGELOG.md`));
    assert.ok(entries.includes(`${prefix}docs/RELEASING.md`));
    assert.ok(!entries.includes(`${prefix}.studio/project-state.md`));
    assert.ok(!entries.includes(`${prefix}.gitattributes`));
    assert.ok(!entries.includes(`${prefix}.github/workflows/release.yml`));
    assert.ok(!entries.includes(`${prefix}docs/architecture.md`));
    assert.ok(!entries.includes(`${prefix}docs/delivery-estimate.md`));
    assert.ok(!entries.includes(`${prefix}docs/development-roadmap.md`));
    assert.ok(!entries.includes(`${prefix}docs/discovery-summary.md`));
    assert.ok(!entries.includes(`${prefix}docs/project-brief.md`));
    assert.ok(!entries.includes(`${prefix}docs/qa-report.md`));
    assert.ok(!entries.includes(`${prefix}examples/README.md`));
    assert.ok(!entries.includes(`${prefix}modules/README.md`));
    assert.ok(!entries.includes(`${prefix}notes/private.md`));
    assert.ok(!entries.includes(`${prefix}package.json`));
    assert.ok(!entries.includes(`${prefix}package-lock.json`));
    assert.ok(!entries.includes(`${prefix}scripts/build-release.ts`));
    assert.ok(!entries.includes(`${prefix}scripts/release-manifest.json`));
    assert.ok(!entries.includes(`${prefix}tests/release.test.ts`));
    assert.ok(!entries.includes(`${prefix}website/index.html`));

    writeFileSync(
      path.join(repoRoot, "adapters", "universal", "BOOTSTRAP.md"),
      "# Changed Bootstrap\n",
    );
    assert.throws(
      () => buildReleaseArchive(repoRoot, currentReleaseTag),
      /clean Git checkout/,
    );
  });

  it("rejects an archive when export-ignore removes an allowlisted file", () => {
    const repoRoot = createReleaseFixture([], {
      ".gitattributes": `${releaseFixtureFiles[".gitattributes"]}README.md export-ignore\n`,
    });

    assert.throws(
      () => buildReleaseArchive(repoRoot, currentReleaseTag),
      /Release archive contents do not match the manifest/,
    );
  });

  it("rejects a tagged release tree with a missing runtime entry point", () => {
    const repoRoot = createReleaseFixture([".codex-plugin/plugin.json"]);

    assert.throws(
      () => buildReleaseArchive(repoRoot, currentReleaseTag),
      /Required release file is missing: \.codex-plugin\/plugin\.json/,
    );
  });

  it("rejects a tagged release tree with a missing Claude entry point", () => {
    const repoRoot = createReleaseFixture([".claude-plugin/plugin.json"]);

    assert.throws(
      () => buildReleaseArchive(repoRoot, currentReleaseTag),
      /Required release file is missing: \.claude-plugin\/plugin\.json/,
    );
  });
});
