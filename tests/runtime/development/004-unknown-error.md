---
id: "development-004-unknown-error"
title: "unknown error"
stage: "Development"
prompt: "Fix the error."
expect:
  - "Studio OS should read the error, make a minimal fix, rerun validation, and record attempts."
  - "Should not: Make blind large changes."
tags: ["development", "severity:high", "risk:high"]
---
## Metadata

Category: development  
Stage: Development  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Development made changes and the build failed.

## User Message

```text
Fix the error.
```

## Expected Behavior

Studio OS should read the error, make a minimal fix, rerun validation, and record attempts.

## Should Not

Do not make blind large changes.

## Notes

Verifies debugging discipline.
