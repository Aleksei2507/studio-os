---
name: validation
description: Run reproducible technical checks for a completed increment and report objective PASS, FAIL, BLOCKED, or PARTIAL evidence. Use after Development and before product QA.
---

# Validation Runtime

> Runtime for collecting technical facts without fixing the product or replacing QA.

## Metadata

Stage: Validation

Version: 1.2

Optional: No after Development

Requires Confirmation: Only before commands with external, destructive, or privileged effects

Creates:

- `.studio/telemetry/validation-report.md` for project lifecycle;
- `work-items/<id>/validation-report.md` for an active Work Item.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: QA on PASS, Development on FAIL, user decision on BLOCKED or PARTIAL

## Goal

Execute the relevant technical quality gates and produce reproducible evidence about the increment.

Validation reports facts. It does not repair failures, reinterpret requirements, or declare product quality from technical checks alone.

## Required Capabilities

- `technical-validation`

Load `skill/capabilities/technical-validation.md`.

## Required Standards

- `code-quality`;
- `testing`;
- `security-privacy`.

Load the direct contracts above and only additional standards selected in the canonical and active Work Item Standards Profiles that apply to Validation.

## Entry Gate

Require:

- a working increment or explicit validation target;
- stored Target Milestone, Product Readiness, and current increment matching the validation target;
- Development Report when Development ran;
- repository and command execution access;
- accepted architecture and project instructions when relevant.

If no executable target exists, stop as BLOCKED.

## Inputs

Read:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- active Development Report path from Project Memory when available;
- canonical `.studio/standards-profile.md` and active `work-items/<id>/standards-profile.md` when available;
- relevant acceptance criteria;
- package scripts, build files, CI configuration, and project instructions;
- changed scope and recommended validation commands.

## Command Discovery

Discover canonical commands from project evidence. Consider:

- dependency installation or integrity;
- formatting and lint;
- type checking or compilation;
- unit tests;
- integration or contract tests;
- build or package creation;
- smoke run;
- migrations or schema checks;
- security or policy checks when required.

Map required checks from the Project Standards Profile to executable or inspectable evidence. A profile rule without an applicable automated command may require a documented manual check or BLOCKED result.

Run only relevant checks, but do not omit a required project gate without recording why.

## Procedure

1. Define Validation Scope.
2. Map changed scope and selected standards to required evidence.
3. List planned commands and why each matters.
4. Identify commands requiring permission or external services.
5. Run checks without bypass flags.
6. Capture command, exit status, relevant output, duration when useful, and environment constraints.
7. Mark every planned check PASS, FAIL, BLOCKED, or NOT RUN.
8. Set overall status.
9. Route failures to Development with evidence.

## Overall Status

- PASS: all required checks passed.
- FAIL: at least one required check executed and failed.
- BLOCKED: a required check could not run because capability, access, service, or target is unavailable.
- PARTIAL: available checks passed, but an explicitly non-blocking check remains unexecuted.

Do not use PASS when a required check is BLOCKED or NOT RUN.

## No Validation Scripts

If the project provides no canonical scripts:

1. Inspect stack and CI evidence.
2. Propose the smallest safe manual or direct commands.
3. Run them when authorized and reliable.
4. Record missing automation as a risk.

Do not invent a successful validation result.

## Conditional References

Read `references/patterns.md` when selecting commands or summarizing mixed results.

Read `references/anti-patterns.md` when a command is skipped, bypassed, flaky, or unavailable.

## Output

Create Validation Report under `.studio/telemetry/` or the Active Work Item directory according to Project Memory, with:

- Delivery Context: Target Milestone, Product Readiness, current increment, and progress;
- Target and Scope;
- Environment;
- Changed Revision or Worktree State;
- Planned Checks;
- Standards Coverage;
- Command Results;
- Skipped or Blocked Checks;
- Failures;
- Overall Status;
- Development Handoff on failure;
- QA Handoff on pass;
- Residual Technical Risks.

Use `templates/validation-report.md` as the output structure.

## Project Memory Update

Reference Validation Report and record overall status.

On PASS, set QA as current stage and `Increment Status: In QA`. On FAIL, set Development as current stage and `Increment Status: In Development`. On BLOCKED or PARTIAL, preserve the stage, set `Increment Status: Blocked` when required, and request the required decision or capability.

Preserve Mode, Workflow, Work Type, Active Work Item, Project Language, and Product Readiness. Validation cannot promote milestone readiness.

## Forbidden

Validation must not:

- change product code to make checks pass;
- add bypass or ignore flags;
- report success for an unexecuted command;
- report PASS while a required standard has missing or blocked evidence;
- hide flaky, skipped, or environment-dependent checks;
- replace product QA with technical test results;
- imply that a Validation PASS makes the Target Milestone ready;
- continue to QA after FAIL or required BLOCKED status;
- publish or deploy the product.

## Completion Checklist

- target and revision identified;
- commands discovered from evidence;
- required standards mapped to checks or explicit blockers;
- required checks executed or explicitly blocked;
- outputs and status recorded;
- failures routed correctly;
- Project Memory updated.

## Stop Condition

Stop after Validation Report and routing state are updated. Name the validated increment and Product Readiness separately. Do not fix failures inside Validation.
