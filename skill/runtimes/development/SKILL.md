---
name: development
description: Implement one accepted roadmap increment, Feature, Bugfix, or Refactor within confirmed product scope and architecture. Use after Architecture or Work Item Intake when code changes are authorized and required capabilities are available.
---

# Development Runtime

> Runtime for producing a working increment without silently changing product or architecture decisions.

## Metadata

Stage: Development

Version: 1.0

Optional: No when the workflow requires code changes

Requires Confirmation: No for accepted implementation, Yes before scope or architecture change

Creates:

- working product increment;
- tests and implementation documentation as needed;
- `.studio/telemetry/development-report.md` for project lifecycle;
- `work-items/<id>/development-report.md` for an active Work Item.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Validation

## Goal

Implement the smallest coherent change that satisfies accepted scope, architecture, and acceptance criteria while preserving unrelated behavior and user changes.

## Required Capabilities

- `codebase-analysis`;
- `implementation`.

Load:

- `skill/capabilities/codebase-analysis.md`;
- `skill/capabilities/implementation.md`.

Resolve stack-specific technical skills through the current environment. Do not hard-code Codex, Claude, framework, or language skill names in Studio OS core.

## Entry Gate

Require:

- selected roadmap iteration or Work Item request;
- accepted product scope and acceptance evidence;
- accepted Architecture when the change requires it;
- repository access and implementation capability;
- no unresolved decision that would materially change the implementation.

If an input is missing or conflicting, stop and route to the responsible Runtime.

## Inputs

Read only relevant context:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- selected workflow;
- accepted Project Brief and roadmap scope;
- active Architecture path and applicable ADRs;
- `docs/design-strategy.md` when UI behavior is affected;
- active Work Item artifacts;
- project instructions, code conventions, and test commands;
- relevant source and tests.

## Procedure

1. Restate the bounded implementation outcome and acceptance criteria.
2. Inspect affected code, dependencies, tests, and existing patterns.
3. Identify the smallest coherent change and focused verification plan.
4. Resolve required stack-specific skills or tools.
5. Implement within accepted boundaries.
6. Add or update tests in proportion to behavior and risk.
7. Run focused checks while developing.
8. Review the diff for scope, accidental changes, secrets, and architecture drift.
9. Create Development Report and hand off to Validation.

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

- Scope Implemented;
- Acceptance Criteria Addressed;
- Files Changed;
- Tests Added or Updated;
- Focused Checks Run;
- Architecture and ADR Compliance;
- Deviations and Approved Changes;
- Known Limitations;
- Validation Commands Recommended;
- Remaining Risks.

Use `templates/development-report.md` as the report structure.

## Project Memory Update

Reference Development Report and record current increment, relevant decisions, known limitations, and Validation handoff.

Set Validation as current stage after implementation is ready. Preserve Mode, Workflow, Work Type, Active Work Item, and Project Language.

## Forbidden

Development must not:

- change product scope or acceptance criteria;
- change accepted architecture without an ADR and confirmation;
- overwrite unrelated user changes;
- disable or bypass tests and quality gates;
- claim a check passed when it was not run;
- introduce a framework or dependency without requirement and impact review;
- hide errors, failing checks, or known limitations;
- start Validation or QA work inside Development.

## Completion Checklist

- bounded scope implemented;
- acceptance criteria traced;
- relevant tests updated;
- focused checks executed;
- diff reviewed;
- architecture preserved or approved deviation recorded;
- Development Report created;
- Validation handoff complete.

## Stop Condition

Stop when the working increment and Development Report are ready for independent Validation. Do not claim release readiness.
