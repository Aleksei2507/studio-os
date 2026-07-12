---
name: validation
description: Run reproducible technical checks for a completed increment and report objective PASS, FAIL, BLOCKED, or PARTIAL evidence. Use after Development and before product QA.
---

# Validation Runtime

> Runtime for collecting technical facts without fixing the product or replacing QA.

## Metadata

Stage: Validation

Version: 1.0

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

## Entry Gate

Require:

- a working increment or explicit validation target;
- Development Report when Development ran;
- repository and command execution access;
- accepted architecture and project instructions when relevant.

If no executable target exists, stop as BLOCKED.

## Inputs

Read:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- active Development Report path from Project Memory when available;
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

Run only relevant checks, but do not omit a required project gate without recording why.

## Procedure

1. Define Validation Scope.
2. List planned commands and why each matters.
3. Identify commands requiring permission or external services.
4. Run checks without bypass flags.
5. Capture command, exit status, relevant output, duration when useful, and environment constraints.
6. Mark every planned check PASS, FAIL, BLOCKED, or NOT RUN.
7. Set overall status.
8. Route failures to Development with evidence.

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

- Target and Scope;
- Environment;
- Changed Revision or Worktree State;
- Planned Checks;
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

On PASS, set QA as current stage. On FAIL, set Development as current stage. On BLOCKED or PARTIAL, preserve the stage and request the required decision or capability.

Preserve Mode, Workflow, Work Type, Active Work Item, and Project Language.

## Forbidden

Validation must not:

- change product code to make checks pass;
- add bypass or ignore flags;
- report success for an unexecuted command;
- hide flaky, skipped, or environment-dependent checks;
- replace product QA with technical test results;
- continue to QA after FAIL or required BLOCKED status;
- publish or deploy the product.

## Completion Checklist

- target and revision identified;
- commands discovered from evidence;
- required checks executed or explicitly blocked;
- outputs and status recorded;
- failures routed correctly;
- Project Memory updated.

## Stop Condition

Stop after Validation Report and routing state are updated. Do not fix failures inside Validation.
