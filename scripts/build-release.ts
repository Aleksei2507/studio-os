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

export interface ReleaseManifest {
  version: number;
  includeTrees: string[];
  includeFiles: string[];
  requiredFiles: string[];
  forbiddenPrefixes: string[];
}

interface ReleaseTree {
  files: string[];
  pathspecs: string[];
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

export const RELEASE_MANIFEST_PATH = "scripts/release-manifest.json";

const REQUIRED_RELEASE_SOURCE_FILES = [
  ".gitattributes",
  "package.json",
  "package-lock.json",
  RELEASE_MANIFEST_PATH,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readStringArray(
  record: Record<string, unknown>,
  key: keyof ReleaseManifest,
): string[] {
  const value = record[key];
  assert.ok(Array.isArray(value), `Release manifest ${key} must be an array`);
  assert.ok(
    value.every((entry) => typeof entry === "string"),
    `Release manifest ${key} must contain only strings`,
  );
  return value as string[];
}

function isWithinPath(candidate: string, prefix: string): boolean {
  return candidate === prefix || candidate.startsWith(`${prefix}/`);
}

function assertSafeManifestPath(value: string, label: string): void {
  assert.ok(value.length > 0, `${label} must not be empty`);
  assert.equal(
    value,
    value.trim(),
    `${label} must not contain outer whitespace`,
  );
  assert.equal(value.includes("\\"), false, `${label} must use POSIX separators`);
  assert.equal(value.includes("\0"), false, `${label} must not contain NUL`);
  assert.equal(path.posix.isAbsolute(value), false, `${label} must be relative`);
  assert.equal(/^[A-Za-z]:\//.test(value), false, `${label} must be relative`);
  assert.equal(
    value.split("/").includes(".."),
    false,
    `${label} must not contain traversal`,
  );
  assert.equal(path.posix.normalize(value), value, `${label} must be normalized`);
  assert.notEqual(value, ".", `${label} must identify a project path`);
  assert.equal(value.endsWith("/"), false, `${label} must not end with a slash`);
  assert.equal(
    /[*?[\]]/.test(value),
    false,
    `${label} must not contain pathspec patterns`,
  );
}

function assertUnique(values: string[], label: string): void {
  assert.equal(
    new Set(values).size,
    values.length,
    `Release manifest ${label} must not contain duplicates`,
  );
}

export function validateReleaseManifest(manifest: ReleaseManifest): string[] {
  assert.equal(manifest.version, 1, "Unsupported release manifest version");

  for (const [label, values] of [
    ["includeTrees", manifest.includeTrees],
    ["includeFiles", manifest.includeFiles],
    ["requiredFiles", manifest.requiredFiles],
    ["forbiddenPrefixes", manifest.forbiddenPrefixes],
  ] as const) {
    assert.ok(values.length > 0, `Release manifest ${label} must not be empty`);
    assertUnique(values, label);
    for (const value of values) {
      assertSafeManifestPath(value, `Release manifest ${label} entry`);
    }
  }

  for (let index = 0; index < manifest.includeTrees.length; index += 1) {
    for (
      let other = index + 1;
      other < manifest.includeTrees.length;
      other += 1
    ) {
      const left = manifest.includeTrees[index];
      const right = manifest.includeTrees[other];
      assert.equal(
        isWithinPath(left, right) || isWithinPath(right, left),
        false,
        `Release manifest includeTrees overlap: ${left} and ${right}`,
      );
    }
  }

  for (const file of manifest.includeFiles) {
    assert.equal(
      manifest.includeTrees.some((tree) => isWithinPath(file, tree)),
      false,
      `Release manifest includeFiles entry is already covered by a tree: ${file}`,
    );
  }

  const included = (file: string): boolean =>
    manifest.includeFiles.includes(file) ||
    manifest.includeTrees.some((tree) => isWithinPath(file, tree));
  const forbidden = (file: string): boolean =>
    manifest.forbiddenPrefixes.some((prefix) => isWithinPath(file, prefix));

  for (const pathspec of [...manifest.includeTrees, ...manifest.includeFiles]) {
    assert.equal(
      forbidden(pathspec),
      false,
      `Release manifest includes forbidden path: ${pathspec}`,
    );
  }

  for (const requiredFile of manifest.requiredFiles) {
    assert.ok(
      included(requiredFile),
      `Required release file is not included by the manifest: ${requiredFile}`,
    );
    assert.equal(
      forbidden(requiredFile),
      false,
      `Required release file is forbidden by the manifest: ${requiredFile}`,
    );
  }

  return [...manifest.includeTrees, ...manifest.includeFiles].sort();
}

export function parseReleaseManifest(source: string): ReleaseManifest {
  const value: unknown = JSON.parse(source);
  assert.ok(isRecord(value), "Release manifest must be an object");
  assert.deepEqual(
    Object.keys(value).sort(),
    [
      "forbiddenPrefixes",
      "includeFiles",
      "includeTrees",
      "requiredFiles",
      "version",
    ],
    "Release manifest contains unknown or missing fields",
  );
  assert.equal(
    typeof value.version,
    "number",
    "Release manifest version must be a number",
  );

  const manifest: ReleaseManifest = {
    version: value.version,
    includeTrees: readStringArray(value, "includeTrees"),
    includeFiles: readStringArray(value, "includeFiles"),
    requiredFiles: readStringArray(value, "requiredFiles"),
    forbiddenPrefixes: readStringArray(value, "forbiddenPrefixes"),
  };
  validateReleaseManifest(manifest);
  return manifest;
}

export function readReleaseManifest(repoRoot = root): ReleaseManifest {
  return parseReleaseManifest(
    readFileSync(path.join(repoRoot, RELEASE_MANIFEST_PATH), "utf8"),
  );
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

function resolveReleaseTree(repoRoot: string, tag: string): ReleaseTree {
  const taggedFiles = runGit(repoRoot, ["ls-tree", "-r", "--name-only", tag])
    .split("\n")
    .filter(Boolean);
  const taggedFileSet = new Set(taggedFiles);

  for (const requiredFile of REQUIRED_RELEASE_SOURCE_FILES) {
    assert.ok(
      taggedFileSet.has(requiredFile),
      `Required release source file is missing: ${requiredFile}`,
    );
  }

  const manifest = parseReleaseManifest(
    runGit(repoRoot, ["show", `${tag}:${RELEASE_MANIFEST_PATH}`]),
  );
  const pathspecs = validateReleaseManifest(manifest);
  const included = (file: string): boolean =>
    manifest.includeFiles.includes(file) ||
    manifest.includeTrees.some((tree) => isWithinPath(file, tree));
  const forbidden = (file: string): boolean =>
    manifest.forbiddenPrefixes.some((prefix) => isWithinPath(file, prefix));

  for (const tree of manifest.includeTrees) {
    assert.ok(
      taggedFiles.some((file) => isWithinPath(file, tree)),
      `Included release tree is missing: ${tree}`,
    );
  }
  for (const requiredFile of manifest.requiredFiles) {
    assert.ok(
      taggedFileSet.has(requiredFile),
      `Required release file is missing: ${requiredFile}`,
    );
  }
  for (const file of manifest.includeFiles) {
    assert.ok(
      taggedFileSet.has(file),
      `Included release file is missing: ${file}`,
    );
  }

  const files = taggedFiles.filter(included).sort();
  assert.ok(files.length > 0, "Release manifest resolves to no files");
  for (const file of files) {
    assert.equal(
      forbidden(file),
      false,
      `Forbidden release file resolved: ${file}`,
    );
  }

  return { files, pathspecs };
}

export function listZipEntries(archivePath: string): string[] {
  const archive = readFileSync(archivePath);
  const minimumOffset = Math.max(0, archive.length - 65_557);
  let endOfDirectoryOffset = -1;

  for (let offset = archive.length - 22; offset >= minimumOffset; offset -= 1) {
    if (archive.readUInt32LE(offset) === 0x06054b50) {
      endOfDirectoryOffset = offset;
      break;
    }
  }

  assert.notEqual(
    endOfDirectoryOffset,
    -1,
    "ZIP end-of-directory record is missing",
  );

  const entryCount = archive.readUInt16LE(endOfDirectoryOffset + 10);
  let offset = archive.readUInt32LE(endOfDirectoryOffset + 16);
  const entries: string[] = [];

  for (let index = 0; index < entryCount; index += 1) {
    assert.equal(
      archive.readUInt32LE(offset),
      0x02014b50,
      "Invalid ZIP directory entry",
    );

    const nameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    entries.push(
      archive.toString("utf8", offset + 46, offset + 46 + nameLength),
    );
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

export function buildReleaseArchive(
  repoRoot: string,
  tag: string,
): ReleaseArtifacts {
  assertReleaseCheckout(repoRoot, tag);
  const releaseTree = resolveReleaseTree(repoRoot, tag);

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
      "--",
      ...releaseTree.pathspecs,
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );

  if (archive.status !== 0) {
    throw new Error(archive.stderr.trim() || "git archive failed");
  }

  const prefix = `studio-os-${tag}/`;
  const archiveFiles = listZipEntries(archivePath)
    .filter((entry) => !entry.endsWith("/"))
    .map((entry) => {
      assert.ok(entry.startsWith(prefix), `Unexpected archive entry: ${entry}`);
      return entry.slice(prefix.length);
    })
    .sort();
  assert.deepEqual(
    archiveFiles,
    releaseTree.files,
    "Release archive contents do not match the manifest",
  );

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
  readReleaseManifest();
  const command = process.argv[2] ?? "--check";

  if (command === "--check") {
    console.log(`Release metadata and manifest are consistent for ${tag}`);
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
