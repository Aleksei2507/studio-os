# Testing Standard

## Goal

Provide evidence proportional to behavior, risk, and change impact.

## Rules

- Trace accepted behavior and failure modes to tests or explicit manual checks.
- Add regression coverage for a confirmed bug when practical.
- Test public behavior at the lowest reliable level; do not couple tests unnecessarily to implementation details.
- Cover critical boundaries, permissions, data changes, and recovery paths.
- Keep tests deterministic and isolate external systems or document required environments.
- Use integration or contract tests where component boundaries create material risk.
- Use end-to-end checks for critical user flows, not as a replacement for focused tests.
- Do not delete, skip, weaken, or broadly mock a failing gate merely to obtain PASS.
- Record unavailable or flaky checks as risk with ownership.

## Evidence

- acceptance-to-check mapping;
- exact commands and outcomes;
- regression evidence for corrected behavior;
- explicit skipped or blocked checks;
- residual coverage risk.
