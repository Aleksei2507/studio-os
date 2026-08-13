# Proposal 001: gap between "structural check passed" and "real build passed"

Classification: **Core**

## Problem

Structural/`--dry` checks create a false sense of "already verified," even though the real execution can fail differently.

## Evidence

From `.studio/runtime-retrospective.md` (Repeated Issues), two independent cases in one cycle (v0.5.0 -> v0.6.0):

1. A symlink bug in `isMainModule` (`scripts/admin-panel/server.js`) was not caught by the initial automated test — it was found only through a manual end-to-end run through a real child process and a real symlink.
2. A `.gitattributes` bug (`export-ignore` not overridable for a nested path) was not caught by `npm run release:check` (a structural version/manifest consistency check) — it was found only by a real `npm run release:build` run in CI on the first `v0.6.0` tag, because only `release:check` (not the full archive build) had been run locally before the first tag push.

Both times, a "green" structural check did not mean real behavior was correct.

## Affected Runtime Or Docs

- `docs/RELEASING.md` (`## Prepare A Release`) — already lists `release:check` among the steps, but does not explicitly state that it is not a substitute for `release:build`.
- Possibly `skill/runtimes/release/SKILL.md` — if it has a similar "verify and publish" phrasing without distinguishing dry vs. real checks.

## Proposed Change

Explicitly separate, in documentation (and the Release Runtime contract, if applicable), two distinct levels of guarantee:
- a "structural/`--dry`" check — validates format/consistency, does not guarantee that real execution (archive build, real HTTP request, real child process, etc.) will produce the same result;
- a "real" check — required before any irreversible/public action (tag, push, release).

Do not change the gates themselves (they are already fail-closed and worked as intended) — the change is purely documentation/checklist clarity, so a human (or LLM host) does not skip the real run while relying only on the structural one.

## Expected Effect

Lower chance of repeating the same pattern: "I ran `--check`, so it must be fine" before a publication action.

## Risk Of Change

Low. This is a documentation wording clarification, not a logic change.

## Recommendation

Worth reviewing — the pattern recurred twice in one cycle with clear, reproducible evidence.
