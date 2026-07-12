# Validation Anti-Patterns

## Green By Omission

Failure: reporting PASS after skipping the check most likely to reveal the defect.

Recovery: mark BLOCKED or PARTIAL and state what remains unknown.

## Validation Fixes Code

Failure: modifying source during the evidence stage.

Recovery: record failure and route to Development with the exact command and output.

## Bypass Flags

Failure: using force, ignore, no-verify, or equivalent options to make a gate complete.

Recovery: run the canonical command or report why it cannot pass.

## Flaky Means Pass

Failure: rerunning until a flaky check passes and hiding earlier failure.

Recovery: report all relevant runs, classify flakiness, and assess whether it blocks QA.
