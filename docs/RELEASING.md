# Releasing Studio OS

Studio OS uses Git tags and GitHub Releases as its initial distribution channel.

Each release has three consumers:

- Codex installs the plugin from the repository marketplace and the immutable Git tag stored there.
- Claude Code installs the plugin from the repository marketplace and the same immutable Git tag.
- Other filesystem-capable agents use the versioned ZIP and Universal Bootstrap.

For public installation, the GitHub repository must be public. A private repository works only for GitHub users who already have access and whose host environment can authenticate to it. Confirm repository visibility before announcing a release.

## Version Contract

The same version must be stored in:

- `package.json`;
- `package-lock.json`;
- `.codex-plugin/plugin.json`;
- `.agents/plugins/marketplace.json` as `v<version>`;
- `.claude-plugin/plugin.json`;
- `.claude-plugin/marketplace.json` as `v<version>`.

`npm run release:check` enforces this contract. Alpha, beta, and release-candidate tags become GitHub prereleases. Stable semantic versions become the latest release.

There is no separate root `VERSION` file. Adding another version source would duplicate the contract and allow drift.

## Release Archive Contract

`studio-os-v<version>.zip` is the installable runtime distribution. It is not a source checkout and cannot run repository tests.

`scripts/release-manifest.json` is the versioned source of truth for archive contents. It declares included runtime trees, exact public files, required entry points, and forbidden internal prefixes. The release builder reads this manifest from the exact Git tag, resolves its allowlist against the tagged tree, passes only those paths to `git archive`, and then compares the actual ZIP entries with the resolved file set. A missing, extra, or silently ignored file fails the build.

The ZIP must include:

- `.codex-plugin/plugin.json`;
- `.agents/plugins/marketplace.json`;
- `.claude-plugin/plugin.json`;
- `.claude-plugin/marketplace.json`;
- `adapters/universal/BOOTSTRAP.md`;
- `skill/SKILL.md` and the runtime core;
- `skills/studio-os/SKILL.md`;
- `templates/`;
- the changelog, license, and explicitly allowlisted public documentation.

The ZIP intentionally excludes `.studio/`, self-hosting lifecycle artifacts, `.github/`, `.gitattributes`, `.gitignore`, `package.json`, `package-lock.json`, `scripts/`, `tests/`, generated test results, the website, and source-only example or module placeholders. Use a Git clone for development and repository validation.

`.gitattributes` remains a secondary defense for source archives, not the package definition. It must not remove an allowlisted runtime file; the post-build ZIP comparison catches that drift.

## Prepare A Release

1. Choose the next semantic version and update all six version locations.
2. Move completed entries from `Unreleased` into a matching Changelog section.
3. Run the full local verification:

```bash
npm run test:runner
npm run test:runtime:dry
npm run release:check
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/plugin-creator/scripts/validate_plugin.py" .
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" skills/studio-os
claude plugin validate .
claude plugin validate .claude-plugin/plugin.json
```

4. Review and commit the release changes.
5. Create an annotated tag that exactly matches the marketplace ref:

```bash
git tag -a v0.5.0-alpha.4 -m "Studio OS v0.5.0-alpha.4"
```

6. Push the reviewed commit and tag:

```bash
git push origin main
git push origin v0.5.0-alpha.4
```

Pushing the tag starts `.github/workflows/release.yml`. The workflow reruns all required tests, rejects inconsistent release metadata or manifest contents, a mismatched checkout, a tagged tree missing a runtime entry point, or an archive that differs from its allowlist. It then writes a SHA-256 checksum and creates the GitHub release.

Tagging and pushing are publication actions. Perform them only after explicit release approval.

## Smoke Test

After GitHub finishes the release workflow:

1. Confirm that both `studio-os-v<version>.zip` and its `.sha256` file are attached.
2. Confirm that an unauthenticated browser can open the repository when the release is intended for public use.
3. Verify the checksum and inspect the extracted archive for `.codex-plugin/`, `.claude-plugin/`, `skills/`, `skill/`, `templates/`, and `adapters/universal/BOOTSTRAP.md`. Confirm that `.studio/`, `scripts/`, `tests/`, `website/`, package metadata, and self-hosting lifecycle artifacts are absent.
4. Install through the Codex GitHub marketplace from outside this repository.
5. Install through the Claude Code GitHub marketplace from outside this repository.
6. Start fresh Codex and Claude Code sessions and run the Tetris activation scenario from `docs/MANUAL_TESTING.md`.
7. Run the same scenario with a filesystem agent against the extracted archive.

Do not mark the release complete until all three adapter paths reach Loader and Interview without starting implementation early.
