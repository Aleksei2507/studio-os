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
  readReleaseMetadata,
  validateReleaseMetadata,
} from "../../scripts/build-release.ts";

const root = process.cwd();
const read = (relativePath: string): string =>
  readFileSync(path.join(root, relativePath), "utf8");

const releaseFixtureFiles: Record<string, string> = {
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
    "",
  ].join("\n"),
  ".github/workflows/release.yml": "name: Release\n",
  ".gitignore": "dist/\n",
  "LICENSE": "MIT\n",
  "README.md": "# Studio OS\n",
  "adapters/universal/BOOTSTRAP.md": "# Universal Bootstrap\n",
  "package-lock.json": "{}\n",
  "package.json": "{}\n",
  "scripts/build-release.ts": "export {};\n",
  "skill/SKILL.md": "# Studio OS Core\n",
  "skills/studio-os/SKILL.md": "# Studio OS Adapter\n",
  "tests/release.test.ts": "export {};\n",
};

function git(repoRoot: string, args: string[]): void {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
}

function createReleaseFixture(omit: string[] = []): string {
  const repoRoot = mkdtempSync(path.join(tmpdir(), "studio-os-release-"));

  for (const [relativePath, source] of Object.entries(releaseFixtureFiles)) {
    if (omit.includes(relativePath)) {
      continue;
    }

    const filePath = path.join(repoRoot, relativePath);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, source);
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
  git(repoRoot, ["tag", "v0.5.0-alpha.1"]);

  return repoRoot;
}

function listZipEntries(archivePath: string): string[] {
  const archive = readFileSync(archivePath);
  const minimumOffset = Math.max(0, archive.length - 65_557);
  let endOfDirectoryOffset = -1;

  for (let offset = archive.length - 22; offset >= minimumOffset; offset -= 1) {
    if (archive.readUInt32LE(offset) === 0x06054b50) {
      endOfDirectoryOffset = offset;
      break;
    }
  }

  assert.notEqual(endOfDirectoryOffset, -1, "ZIP end-of-directory record is missing");

  const entryCount = archive.readUInt16LE(endOfDirectoryOffset + 10);
  let offset = archive.readUInt32LE(endOfDirectoryOffset + 16);
  const entries: string[] = [];

  for (let index = 0; index < entryCount; index += 1) {
    assert.equal(archive.readUInt32LE(offset), 0x02014b50, "Invalid ZIP directory entry");

    const nameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    entries.push(archive.toString("utf8", offset + 46, offset + 46 + nameLength));
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
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

    assert.match(attributes, /^\.github export-ignore$/m);
    assert.match(attributes, /^scripts export-ignore$/m);
    assert.match(attributes, /^tests export-ignore$/m);
    assert.doesNotMatch(attributes, /^adapters export-ignore$/m);
    assert.doesNotMatch(attributes, /^skill export-ignore$/m);
    assert.doesNotMatch(attributes, /^skills export-ignore$/m);
  });

  it("builds a checksummed archive only from a clean tagged checkout", () => {
    const repoRoot = createReleaseFixture();

    const artifacts = buildReleaseArchive(repoRoot, "v0.5.0-alpha.1");
    const archiveName = path.basename(artifacts.archivePath);
    const prefix = "studio-os-v0.5.0-alpha.1/";
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
    assert.ok(entries.includes(`${prefix}README.md`));
    assert.ok(entries.includes(`${prefix}LICENSE`));
    assert.ok(!entries.includes(`${prefix}.gitattributes`));
    assert.ok(!entries.includes(`${prefix}.github/workflows/release.yml`));
    assert.ok(!entries.includes(`${prefix}package.json`));
    assert.ok(!entries.includes(`${prefix}package-lock.json`));
    assert.ok(!entries.includes(`${prefix}scripts/build-release.ts`));
    assert.ok(!entries.includes(`${prefix}tests/release.test.ts`));

    writeFileSync(
      path.join(repoRoot, "adapters", "universal", "BOOTSTRAP.md"),
      "# Changed Bootstrap\n",
    );
    assert.throws(
      () => buildReleaseArchive(repoRoot, "v0.5.0-alpha.1"),
      /clean Git checkout/,
    );
  });

  it("rejects a tagged release tree with a missing runtime entry point", () => {
    const repoRoot = createReleaseFixture([".codex-plugin/plugin.json"]);

    assert.throws(
      () => buildReleaseArchive(repoRoot, "v0.5.0-alpha.1"),
      /Required release file is missing: \.codex-plugin\/plugin\.json/,
    );
  });

  it("rejects a tagged release tree with a missing Claude entry point", () => {
    const repoRoot = createReleaseFixture([".claude-plugin/plugin.json"]);

    assert.throws(
      () => buildReleaseArchive(repoRoot, "v0.5.0-alpha.1"),
      /Required release file is missing: \.claude-plugin\/plugin\.json/,
    );
  });
});
