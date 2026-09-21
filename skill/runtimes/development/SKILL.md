---
name: development
description: Implement one accepted roadmap increment, Feature, Bugfix, or Refactor within confirmed product scope, architecture, and interface design. Use after all selected preparation stages, including Task Decomposition, when code changes are authorized and required capabilities are available.
---

# Development Runtime

> Runtime for producing a working increment without silently changing product or architecture decisions.

## Metadata

Stage: Development

Version: 1.4

Optional: No when the workflow requires code changes

Requires Confirmation: No for accepted implementation, Yes before scope or architecture change

Creates:

- working product increment;
- tests and implementation documentation as needed;
- `.studio/telemetry/development-report.md` for project lifecycle;
- `work-items/<id>/development-report.md` for an active Work Item.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- active `orchestration-plan.md` execution state.

Next Stage: Validation

## Goal

Implement the smallest coherent change that satisfies accepted scope, architecture, interface design when selected, and acceptance criteria while preserving unrelated behavior and user changes.

## Required Capabilities

- `codebase-analysis`;
- `implementation`;
- `model-orchestration`.

Load:

- `skill/capabilities/codebase-analysis.md`;
- `skill/capabilities/implementation.md`;
- `skill/capabilities/model-orchestration.md`.

Resolve stack-specific technical skills through the current environment. Do not hard-code Codex, Claude, framework, or language skill names in Studio OS core.

## Required Standards

- `code-quality`;
- `testing`;
- `security-privacy`.

Load the direct contracts above and only additional standards selected in the canonical and active Work Item Standards Profiles that apply to Development. The accepted Work Item profile takes precedence only within that Work Item.

If the profile is absent in Greenfield or a material technology decision is unresolved, route to Architecture. For a bounded legacy Brownfield change that preserves the existing stack, a `Provisional` profile may be derived from explicit repository instructions and confirmed before implementation. Development must not use profile bootstrap to select a new technology.

## Entry Gate

Require:

- selected roadmap iteration or Work Item request;
- stored Target Milestone, Product Readiness, and current increment matching the implementation target;
- accepted product scope and acceptance evidence;
- accepted Architecture when the change requires it;
- accepted Interface Design when the workflow selected it, or a recorded reason it was skipped;
- accepted active `tasks.md` when Task Decomposition is required or selected by the workflow;
- an Accepted, Observed, or confirmed Provisional Project Standards Profile;
- an applicable Observed, Provisional, or Accepted Project or Work Item Design System Profile when interface code is affected, or a recorded reason it is Not Applicable;
- repository access and implementation capability;
- no unresolved decision that would materially change the implementation.

If an input is missing or conflicting, stop and route to the responsible Runtime.

Do not interpret a missing task list as permission to skip selected Task Decomposition. A missing orchestration plan alone does not restart a legacy or bounded workflow: create the capability's compact `single-model` plan from accepted scope at `docs/orchestration-plan.md` or `work-items/<id>/orchestration-plan.md`, then reference it in Project Memory. Route material strategy changes or unresolved work boundaries to Architecture.

## Inputs

Read only relevant context:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- selected workflow;
- accepted Project Brief and roadmap scope;
- active Architecture path and applicable ADRs;
- accepted active `tasks.md` when Task Decomposition is required or selected;
- active `orchestration-plan.md`, including its execution ledger and limits;
- active Interface Design path when available;
- canonical `.studio/standards-profile.md` and active `work-items/<id>/standards-profile.md` when available;
- canonical `.studio/design-system-profile.md` and active `work-items/<id>/design-system-profile.md` when interface code is affected;
- `docs/design-strategy.md` and `docs/interface-design.md` when UI behavior is affected and the artifacts are available;
- active Work Item artifacts;
- project instructions, code conventions, and test commands;
- relevant source and tests.

## Procedure

1. Restate the bounded implementation outcome, acceptance criteria, and accepted Interface Design behavior when applicable.
2. Inspect affected code, dependencies, tests, existing patterns, and applicable design-system evidence.
3. Identify the smallest coherent change and focused verification plan.
4. Resolve direct and profile-selected standards plus required stack-specific skills or tools.
5. Trace applicable Interface Design, Design System Profile, and standards to implementation and Validation evidence.
6. Recheck host capabilities and existing jobs, then implement within accepted boundaries using the active orchestration plan and Native Subagent Execution procedure.
7. Add or update tests in proportion to behavior and risk.
8. Run focused checks while developing.
9. Review the diff for scope, accidental changes, secrets, standards violations, and architecture drift.
10. Create Development Report and hand off to Validation.

## Native Subagent Execution

Follow `skill/capabilities/model-orchestration.md` for discovery evidence, permissions, concurrency, total attempts, delegation depth, budgets, and recovery. The coordinator remains responsible for integration and keeps the main conversation model unchanged.

1. Before dispatch and on resume, recheck the available native subagent API, permitted model choices, plan limits, and existing running jobs. Reconcile persisted job IDs with host state before respawning. If an earlier job's status is unknown, resolve it or stop that assignment rather than risk duplicate writes or spend.
2. Use `single-model` when delegation is unavailable or its overhead is not justified. When host subagents support only `default/inherited`, use `same-model-delegation` and record unknown identity honestly. `multi-model` requires evidence for actual permitted subagent model selection. Never install a CLI, call a new provider API, create unrequested sidebar tasks, or switch the main model to simulate delegation.
3. Dispatch only ready, independent assignments through the actually available native subagent tool. Supply the bounded task/context packet and explicit ownership, tell the worker to preserve other contributors' changes, and enforce the plan's limits. Do not dispatch extra workers under an unenforceable hard token or monetary budget.
4. Persist task IDs, host job IDs, attempt counts, planned and observed model identity or `Unknown`, and status in the active plan as execution changes. Attempts remain cumulative across model changes, retries, escalation, and coordinator recovery. Check existing work before retrying; do not overwrite or revert another contributor's changes.
5. Inspect each result's changed files, scope, evidence, and relevant checks before accepting it. A worker's success claim is insufficient. Integrate in dependency order, resolve ownership conflicts, and verify the combined result. Failed or incomplete evidence follows the bounded recovery policy; changing executor does not reset its limits.
6. Record actual assignments, outcomes, integration checks, and limitations in the Development Report. Use only tool-provided token or cost measurements; otherwise record `Unknown`. Distinguish plan from execution and estimates from measured usage. Do not claim savings or superior quality without comparative evidence.

Subagents receive only their assigned work. They cannot change accepted scope, self-approve integration, skip selected stages, or launch an unrestricted chain of agents. Delegation does not replace independent Validation, QA, or Product Outcome.

## Work Type Rules

### Feature

Implement accepted user-visible behavior and its acceptance criteria. Do not add deferred features because they are convenient to build now.

### Bugfix

Record reproduction evidence and identify a supported root cause before applying the fix. Add regression coverage when practical.

If the observed behavior is actually an undefined requirement, route to Briefing instead of inventing expected behavior.

### Refactor

Preserve accepted product behavior. Establish validation evidence before changing structure.

If the refactor changes a technical boundary or accepted ADR, route to Architecture.

## Architecture Conflict

When implementation reveals that accepted architecture cannot satisfy the requirement:

1. Stop the affected work.
2. Record evidence and impacted decision.
3. Recommend an Architecture update or ADR.
4. Wait for confirmation before continuing.

Do not silently revise architecture in code.

## Interface Design Conflict

When implementation reveals that accepted Interface Design is incomplete, contradictory, or infeasible within accepted Architecture:

1. Stop the affected interface work.
2. Record the conflicting flow, state, platform rule, or component behavior.
3. Route a design decision to Interface Design and a technical-boundary conflict to Architecture.
4. Wait for the responsible decision before continuing.

Do not invent a material design decision inside implementation.

## Design System Conflict

When affected interface code does not match the active Design System Profile, determine whether the profile is stale, the implementation is an unapproved deviation, or multiple systems have a recorded boundary.

Preserve the current system while the conflict is unresolved. Route design decisions to Interface Design and technical integration conflicts to Architecture. Development must not introduce a parallel component library, token set, or theme as an implementation shortcut.

For a legacy project without a profile, Development may create a bounded `Provisional` profile only from direct evidence needed for the accepted change. If evidence is contradictory or a new design decision is required, route to Interface Design instead of guessing.

## Error Handling

For an unknown error:

1. Capture the exact error and reproduction.
2. Inspect relevant logs, code paths, configuration, and recent changes.
3. Form and test bounded hypotheses.
4. Report what is confirmed and unknown.

Do not apply unrelated speculative fixes.

## Conditional References

Read `references/patterns.md` for Feature, Bugfix, Refactor, or architecture-conflict execution patterns.

Read `references/anti-patterns.md` when asked to skip tests, change framework opportunistically, or broaden scope during implementation.

## Conversation Rules

- Keep execution updates concise and evidence-based.
- Ask only when a missing decision blocks safe implementation.
- Do not reopen settled product choices merely because another implementation looks easier.
- Explain conflicts with accepted artifacts before requesting a decision.
- Preserve Project Language in reports and handoffs.

## Output

Produce a working increment and Development Report under `.studio/telemetry/` or the Active Work Item directory according to Project Memory, with:

- Delivery Context: Target Milestone, Product Readiness, current increment, and progress;
- Scope Implemented;
- Tasks Completed: the `T<n>` IDs closed by this increment, when `tasks.md` exists;
- Acceptance Criteria Addressed: reference the Brief's `AC<n>` IDs when they exist, not only prose;
- Files Changed;
- Tests Added or Updated;
- Focused Checks Run;
- Orchestration Results: active plan, execution mode, planned versus actual subagent assignments and models, attempts and outcomes, integration evidence, tool-provided usage or `Unknown`, and limitations;
- Architecture and ADR Compliance;
- Interface Design Compliance when applicable;
- Design System Profile Compliance when applicable;
- Standards Applied and Evidence;
- Deviations and Approved Changes;
- Known Limitations;
- Validation Commands Recommended;
- Remaining Risks.

Use `templates/development-report.md` as the report structure.

## Project Memory Update

Reference Development Report and the active orchestration plan, and record current increment, relevant decisions, known limitations, applicable Design System Profile, and Validation handoff. Keep job details and statuses in the plan and report, not copied into Active Context.

Set Validation as current stage after implementation is ready. Preserve Mode, Workflow, Work Type, Active Work Item, and Project Language.

Set `Increment Status: In Validation`. Preserve `Product Readiness` as `Not Ready` or `Blocked`; Development must not set it to `Ready for Release`.

## Forbidden

Development must not:

- change product scope or acceptance criteria;
- change accepted architecture without an ADR and confirmation;
- change accepted Interface Design behavior without confirmation;
- replace or bypass the applicable Design System Profile without an accepted design decision;
- introduce a parallel component library, token set, or theme for convenience;
- change the accepted stack or Project Standards Profile without Architecture confirmation;
- overwrite unrelated user changes;
- disable or bypass tests and quality gates;
- use SOLID or another principle to justify unnecessary abstractions;
- claim a check passed when it was not run;
- introduce a framework or dependency without requirement and impact review;
- hide errors, failing checks, or known limitations;
- imply that implementation or successful focused checks complete the Target Milestone;
- start Validation or QA work inside Development.

## Completion Checklist

- bounded scope implemented;
- acceptance criteria traced;
- relevant tests updated;
- focused checks executed;
- diff reviewed;
- required task list honored and orchestration results reconciled with the active plan and host job evidence;
- architecture preserved or approved deviation recorded;
- accepted Interface Design preserved or responsible-stage revision recorded;
- applicable Design System Profile preserved or responsible-stage revision recorded;
- direct and profile-selected standards traced to evidence or approved deviations;
- Development Report created;
- Validation handoff complete.

## Stop Condition

Stop when the named increment and Development Report are ready for independent Validation. In the completion response, name that bounded unit, state Product Readiness separately, and do not claim milestone or release readiness.
