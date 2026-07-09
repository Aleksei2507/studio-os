---
id: "qa-002-ux-bad-but-tests-pass"
title: "ux bad but tests pass"
stage: "QA"
prompt: "Tests are green, should we release?"
expect:
  - "Studio OS should say QA can fail because of UX/acceptance criteria even when tests are green."
  - "Should not: Release only because tests are green."
tags: ["qa", "severity:high", "risk:medium"]
---
## Metadata

Category: qa  
Stage: QA  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Validation passed, but the result text is unclear to the user.

## User Message

```text
Tests are green, should we release?
```

## Expected Behavior

Studio OS should say QA can fail because of UX/acceptance criteria even when tests are green.

## Should Not

Do not release only because tests are green.

## Notes

Verifies product QA.
