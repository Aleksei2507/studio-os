# ADR-0002: Task Decomposition Runtime And Traceability ID Scheme

Status: Accepted

Date: 2026-08-07

## Context

Between an accepted Roadmap iteration or Architecture decision and Development, Studio OS today has no bounded, estimable artifact. Development reads iteration-level acceptance criteria directly and self-decomposes implementation with no recorded trace back to the requirement it satisfies. This was identified as a concrete gap relative to an internal spec-driven tool (`sp`) already in production use, which produces an hour-bounded, requirement-traced `tasks.md` that plugs into a ticket tracker.

`skill/` contains no concept of task decomposition or cross-artifact traceability IDs (verified: no matches for these concepts across `skill/`).

## Decision

Add a new Runtime stage, `task-decomposition`, registered `active` in `skill/workflows/registry.json`, positioned between Architecture and Development. It produces `docs/tasks.md` or `work-items/<id>/tasks.md`: a list of tasks bounded to ≤8 hours each, every task carrying an ID and an explicit reference to the Acceptance Criterion it satisfies.

Introduce a shared Traceability ID scheme used across four existing Runtimes and the new one:

- Briefing numbers each Acceptance Criterion `AC1`, `AC2`, ... in `docs/project-brief.md` / `work-items/<id>/brief.md`.
- Planning numbers each Roadmap iteration `IT1`, `IT2`, ... in `docs/roadmap.md` / `work-items/<id>/roadmap.md`, and records which `AC<n>` each iteration advances.
- Task Decomposition assigns `T<iteration>.<n>` per task (e.g. `T1.1`, `T1.2`), each recording `Satisfies: AC<n>[, AC<m>]`.
- Development Report records `Tasks Completed: T<x>.<y>[, ...]`.
- Validation evidence records `Acceptance Criteria Verified: AC<n>[, ...]` and the `T<x>.<y>` tasks that produced that evidence.

Workflow wiring:

- `greenfield`, `brownfield`: `task-decomposition` stage policy `required`, positioned after `architecture` and before `development`.
- `work-item-feature`: `task-decomposition` stage policy `conditional` — run when the Feature needs multiple estimable units; skip for a single trivial change and record the reason, mirroring how `planning` and `architecture` are already conditional in that workflow.
- `work-item-bugfix`, `work-item-research`, `work-item-refactor`: not added — these workflows are already small-bounded by construction (a Bugfix or single Refactor rarely needs sub-decomposition); Task Decomposition may be added later if evidence shows otherwise.

The ID scheme does not retrofit onto already-completed artifacts (e.g. the released `v0.5` roadmap/reports keep their existing unqualified references).

## Alternatives

- **Decompose inside Development itself** — rejected: keeps the same problem (no artifact a human can review/estimate/hand out before implementation starts) and mixes "what must be true" with "how it is implemented."
- **A separate tool outside `skill/` that generates tasks.md from Architecture** — rejected: would create a second source of workflow logic outside the canonical `skill/` tree, which `.studio/standards-profile.md` explicitly designates as the only canonical Runtime implementation location.
- **Free-form IDs chosen ad hoc per project** — rejected: traceability requires a predictable, greppable format; an explicit scheme is cheap to define once and enforce structurally.

## Consequences

- `skill/workflows/registry.json` gains one new Runtime entry and three workflow files gain one stage each — additive, no existing stage removed or renamed.
- `skill/runtimes/briefing/SKILL.md`, `planning/SKILL.md`, `development/SKILL.md`, `validation/SKILL.md` gain an ID-numbering requirement in their Output sections — a small, backward-compatible addition (existing unqualified artifacts remain valid; the requirement applies going forward).
- Development and Validation gain a light bookkeeping duty (record which `T<x>.<y>` / `AC<n>` were addressed) in exchange for end-to-end traceability that did not exist before.

## Affected Scope

`skill/workflows/registry.json`, `skill/workflows/greenfield.md`, `skill/workflows/brownfield.md`, `skill/workflows/work-item-feature.md`, new `skill/runtimes/task-decomposition/SKILL.md`, `skill/runtimes/briefing/SKILL.md`, `skill/runtimes/planning/SKILL.md`, `skill/runtimes/development/SKILL.md`, `skill/runtimes/validation/SKILL.md`, `templates/`.
