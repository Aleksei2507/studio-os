# Technical Validation Capability

## Purpose

Run objective project checks and capture reproducible results.

## Procedure

1. Discover canonical commands from package scripts, build files, CI, and project instructions.
2. Select checks relevant to changed scope and the Project Standards Profile.
3. Run commands without bypass flags.
4. Capture command, exit status, relevant output, and environment limitations.
5. Mark skipped checks with a reason.
6. Route failures back to Development instead of fixing them inside Validation.

## Evidence

- Exact commands.
- PASS, FAIL, BLOCKED, or NOT RUN status for each check.
- Failure details sufficient for diagnosis.
- Standards-to-evidence coverage.
- Overall validation decision.
