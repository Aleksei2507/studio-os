import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawnSync } from "node:child_process";

interface PackageManifest {
  name: string;
  version: string;
}

interface PackageLock {
  name: string;
  version: string;
  packages: {
    "": {
      name: string;
      version: string;
    };
  };
}

interface PluginManifest {
  name: string;
  version: string;
}

interface Marketplace {
  name: string;
  plugins: Array<{
    name: string;
    source: {
      source: string;
      url?: string;
      repo?: string;
      ref?: string;
    };
  }>;
}

export interface ReleaseMetadata {
  packageName: string;
  packageVersion: string;
  packageLockName: string;
  packageLockVersion: string;
  packageLockRootVersion: string;
  pluginName: string;
  pluginVersion: string;
  marketplaceName: string;
  marketplacePluginName: string;
  marketplaceSource: string;
  marketplaceUrl?: string;
  marketplaceRef?: string;
  claudePluginName: string;
  claudePluginVersion: string;
  claudeMarketplaceName: string;
  claudeMarketplacePluginName: string;
  claudeMarketplaceSource: string;
  claudeMarketplaceUrl?: string;
  claudeMarketplaceRef?: string;
}

export interface ReleaseArtifacts {
  archivePath: string;
  checksumPath: string;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const REQUIRED_RELEASE_FILES = [
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".gitattributes",
  "LICENSE",
  "README.md",
  "adapters/universal/BOOTSTRAP.md",
  "package.json",
  "skill/SKILL.md",
  "skills/studio-os/SKILL.md",
] as const;

export function expectedReleaseTag(version: string): string {
  assert.match(
    version,
    /^\d+\.\d+\.\d+(?:-[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)*)?$/,
    `Invalid release version: ${version}`,
  );

  return `v${version}`;
}

export function validateReleaseMetadata(metadata: ReleaseMetadata): string {
  assert.equal(metadata.packageName, "studio-os", "Unexpected package name");
  assert.equal(
    metadata.packageLockName,
    metadata.packageName,
    "Package lock name must match package name",
  );
  assert.equal(
    metadata.packageLockVersion,
    metadata.packageVersion,
    "Package lock version must match package version",
  );
  assert.equal(
    metadata.packageLockRootVersion,
    metadata.packageVersion,
    "Package lock root version must match package version",
  );
  assert.equal(
    metadata.pluginName,
    metadata.packageName,
    "Plugin name must match package name",
  );
  assert.equal(
    metadata.pluginVersion,
    metadata.packageVersion,
    "Plugin version must match package version",
  );
  assert.equal(
    metadata.marketplaceName,
    metadata.packageName,
    "Marketplace name must match package name",
  );
  assert.equal(
    metadata.marketplacePluginName,
    metadata.pluginName,
    "Marketplace plugin name must match plugin name",
  );
  assert.equal(
    metadata.marketplaceSource,
    "url",
    "Plugin source must use the Git repository root",
  );
  assert.equal(
    metadata.marketplaceUrl,
    "https://github.com/Aleksei2507/studio-os.git",
    "Marketplace must use the canonical GitHub repository",
  );

  const tag = expectedReleaseTag(metadata.packageVersion);
  assert.equal(
    metadata.marketplaceRef,
    tag,
    "Marketplace ref must match the release tag",
  );
  assert.equal(
    metadata.claudePluginName,
    metadata.packageName,
    "Claude plugin name must match package name",
  );
  assert.equal(
    metadata.claudePluginVersion,
    metadata.packageVersion,
    "Claude plugin version must match package version",
  );
  assert.equal(
    metadata.claudeMarketplaceName,
    metadata.packageName,
    "Claude marketplace name must match package name",
  );
  assert.equal(
    metadata.claudeMarketplacePluginName,
    metadata.claudePluginName,
    "Claude marketplace plugin name must match Claude plugin name",
  );
  assert.equal(
    metadata.claudeMarketplaceSource,
    "url",
    "Claude plugin source must use an explicit HTTPS URL",
  );
  assert.equal(
    metadata.claudeMarketplaceUrl,
    "https://github.com/Aleksei2507/studio-os.git",
    "Claude marketplace must use the canonical HTTPS GitHub repository",
  );
  assert.equal(
    metadata.claudeMarketplaceRef,
    tag,
    "Claude marketplace ref must match the release tag",
  );

  return tag;
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8")) as T;
}

export function readReleaseMetadata(): ReleaseMetadata {
  const packageManifest = readJson<PackageManifest>("package.json");
  const packageLock = readJson<PackageLock>("package-lock.json");
  const pluginManifest = readJson<PluginManifest>(".codex-plugin/plugin.json");
  const marketplace = readJson<Marketplace>(".agents/plugins/marketplace.json");
  const claudePluginManifest = readJson<PluginManifest>(
    ".claude-plugin/plugin.json",
  );
  const claudeMarketplace = readJson<Marketplace>(
    ".claude-plugin/marketplace.json",
  );
  const marketplacePlugin = marketplace.plugins.find(
    (plugin) => plugin.name === pluginManifest.name,
  );
  const claudeMarketplacePlugin = claudeMarketplace.plugins.find(
    (plugin) => plugin.name === claudePluginManifest.name,
  );

  assert.ok(marketplacePlugin, `Marketplace is missing ${pluginManifest.name}`);
  assert.ok(
    claudeMarketplacePlugin,
    `Claude marketplace is missing ${claudePluginManifest.name}`,
  );

  return {
    packageName: packageManifest.name,
    packageVersion: packageManifest.version,
    packageLockName: packageLock.name,
    packageLockVersion: packageLock.version,
    packageLockRootVersion: packageLock.packages[""].version,
    pluginName: pluginManifest.name,
    pluginVersion: pluginManifest.version,
    marketplaceName: marketplace.name,
    marketplacePluginName: marketplacePlugin.name,
    marketplaceSource: marketplacePlugin.source.source,
    marketplaceUrl: marketplacePlugin.source.url,
    marketplaceRef: marketplacePlugin.source.ref,
    claudePluginName: claudePluginManifest.name,
    claudePluginVersion: claudePluginManifest.version,
    claudeMarketplaceName: claudeMarketplace.name,
    claudeMarketplacePluginName: claudeMarketplacePlugin.name,
    claudeMarketplaceSource: claudeMarketplacePlugin.source.source,
    claudeMarketplaceUrl: claudeMarketplacePlugin.source.url,
    claudeMarketplaceRef: claudeMarketplacePlugin.source.ref,
  };
}

function runGit(repoRoot: string, args: string[]): string {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }

  return result.stdout.trim();
}

function assertReleaseCheckout(repoRoot: string, tag: string): void {
  const status = runGit(repoRoot, ["status", "--porcelain"]);
  assert.equal(status, "", "Release builds require a clean Git checkout");

  const tags = runGit(repoRoot, ["tag", "--points-at", "HEAD"])
    .split("\n")
    .filter(Boolean);
  assert.ok(tags.includes(tag), `HEAD must have release tag ${tag}`);

  if (process.env.GITHUB_REF_TYPE === "tag") {
    assert.equal(
      process.env.GITHUB_REF_NAME,
      tag,
      "GitHub tag must match package version",
    );
  }
}

function assertReleaseTree(repoRoot: string, tag: string): void {
  const files = new Set(
    runGit(repoRoot, ["ls-tree", "-r", "--name-only", tag])
      .split("\n")
      .filter(Boolean),
  );

  for (const requiredFile of REQUIRED_RELEASE_FILES) {
    assert.ok(
      files.has(requiredFile),
      `Required release file is missing: ${requiredFile}`,
    );
  }
}

export function buildReleaseArchive(
  repoRoot: string,
  tag: string,
): ReleaseArtifacts {
  assertReleaseCheckout(repoRoot, tag);
  assertReleaseTree(repoRoot, tag);

  const distPath = path.join(repoRoot, "dist");
  const archiveName = `studio-os-${tag}.zip`;
  const archivePath = path.join(distPath, archiveName);
  const checksumPath = `${archivePath}.sha256`;

  rmSync(distPath, { recursive: true, force: true });
  mkdirSync(distPath, { recursive: true });

  const archive = spawnSync(
    "git",
    [
      "archive",
      "--format=zip",
      `--prefix=studio-os-${tag}/`,
      `--output=${archivePath}`,
      tag,
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );

  if (archive.status !== 0) {
    throw new Error(archive.stderr.trim() || "git archive failed");
  }

  const digest = createHash("sha256")
    .update(readFileSync(archivePath))
    .digest("hex");
  writeFileSync(
    checksumPath,
    `${digest}  ${archiveName}\n`,
    "utf8",
  );

  return { archivePath, checksumPath };
}

function main(): void {
  const metadata = readReleaseMetadata();
  const tag = validateReleaseMetadata(metadata);
  const command = process.argv[2] ?? "--check";

  if (command === "--check") {
    console.log(`Release metadata is consistent for ${tag}`);
    return;
  }

  if (command === "--build") {
    const artifacts = buildReleaseArchive(root, tag);
    console.log(`Built dist/${path.basename(artifacts.archivePath)}`);
    console.log(`Built dist/${path.basename(artifacts.checksumPath)}`);
    return;
  }

  throw new Error(`Unknown release command: ${command}`);
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined;

if (entryPath === fileURLToPath(import.meta.url)) {
  main();
}
