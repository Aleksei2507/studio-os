# Retrospective

## Executive Summary

This retrospective covers the period from the v0.5.0 release (2026-08-07) to the v0.6.0 release (2026-08-13): the `admin-panel-task-tracing` Work Item (Task Decomposition Runtime, Traceability ID, admin panel) plus the v0.6.0 release cycle itself. The process reached Release and was confirmed by the user at every publication step. The main value the user named was transparency about what is and is not worth building. The main friction was the density of technical language.

## Project Context

- Milestone: `v0.5 Distribution And Delivery Assurance` (released) -> post-release Work Item `2026-08-07-admin-panel-task-tracing` -> release `v0.6.0`.
- Mode: Brownfield, Workflow: `work-item-feature`.
- Work Item trigger: the user compared Studio OS to an internal spec-driven tool (`sp`) and saw no clear productivity gain; Briefing recorded two concrete gaps (task-level decomposition/traceability, ease of reading artifacts).

## Stages Completed

Work Item Intake -> Briefing (Planning skipped, reason recorded) -> Architecture -> Task Decomposition -> Development (5 increments/addenda) -> Validation (x2, PASS) -> QA (PASS) -> Product Outcome (PASS, all AC verified) -> Release (v0.6.0, published).

Retrospective had never run before this project's lifetime — this is the first pass.

## Objective Observations

- Documentation was written in English instead of the stored Project Language (Russian) twice — both times caught by the user, not by automation. Result: an explicit completion-check line was added to `skill/core/INVARIANTS.md`.
- The admin panel's scope was expanded by the user mid-work (not just this checkout, but installed plugin copies too) — required rewriting `server.ts` -> `server.js` and introducing `--workspace`.
- A real bug (`isMainModule` breaking on a symlinked path) was found only through manual end-to-end testing, not the initial automated test.
- A real bug (`.gitattributes` `export-ignore` not overridable for a nested path when the parent is export-ignored) was found only by a real `release:build` run in CI on the first `v0.6.0` tag — locally only `release:check` (a structural check) had been run before the first tag push, not the full archive build.
- The user never allowed a commit or push without explicit confirmation; once a choice between two options (force-move the tag vs. cut v0.6.1) was handed to the user via a structured question.
- One clarifying question ("here?" — where exactly to build the prototype) was declined by the user, who then asked an unrelated question about the release — a signal that the question landed at the wrong point in the conversation.
- The manifest-driven, fail-closed RC gate caught a real problem before publication twice in this period: the admin panel/commands carve-out in the manifest, and the `.gitattributes` bug.

## User Feedback

1. **Most useful:** reasoning about what is and is not worth adding (named explicitly by the user) — for example, the monetization/traceability-gap analysis with an honest risk assessment, not just a list of "let's build everything."
2. **What was annoying:** too much unfamiliar/technical language. The user wants explanations a non-technical person could follow.
3. **What to change:** the user did not name a specific thing ("seems fine as is") — no further change was explicitly requested.

## Friction Points

- Dense technical jargon in explanations got in the way even when the actual work was going smoothly.
- Twice, the user had to intervene manually to catch a Project Language violation.
- Both real bugs (symlink, gitattributes) were found late — during a manual or CI run, not by automated tests written in advance.

## Helpful Behaviors

- Explicitly separating "worth doing" from "not worth doing" with reasoning for each point — named directly by the user as the most valuable part.
- The fail-closed RC gate: a structural manifest check caught two real problems before they reached the user or a public release.
- Explicit confirmation before every irreversible/public action (commit, push, tag, force-push) — the process never advanced without the user's consent.
- Dogfooding the new Runtime (`task-decomposition`) on the very Work Item that built it went smoothly.

## Repeated Issues

- Project Language violation (English instead of Russian) — recurred twice within one Work Item before it was closed with a systemic rule.
- The gap between "the structural check passed" (`--dry`/`--check`) and "the real build passed" (`release:build`) — the source of both bugs found in this session.

## Candidate Improvements

- Explanations and status updates for the user use too much technical jargon without plain-language translation — candidate for Evolution: default to simpler wording in statuses/summaries, especially for a non-technical reader.
- There is no automated Project Language check at write time (relied on an `INVARIANTS.md` prose rule that failed twice before being made explicit).
- `release:check` (structural, `--dry`-like) and `release:build` (the real build) can be mistaken for "already verified" — candidate: make `RELEASING.md` state more explicitly what each command actually guarantees.

## Notes For Evolution

There is no explicit user request for immediate changes ("seems fine as is" on question 3). The one explicitly named candidate is simplifying explanation language. Evolution should decide on its own whether to turn this and the other Candidate Improvements into proposals; Retrospective does not propose that itself.
