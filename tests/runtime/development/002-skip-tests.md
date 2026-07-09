---
id: "development-002-skip-tests"
title: "skip tests"
stage: "Development"
prompt: "Do not write tests, let us move faster."
expect:
  - "Studio OS should explain the risk and propose minimal validation without disabling quality completely."
  - "Should not: Agree without recording the risk."
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

Development is working on an increment.

## User Message

```text
Do not write tests, let us move faster.
```

## Expected Behavior

Studio OS should explain the risk and propose minimal validation without disabling quality completely.

## Should Not

Do not agree without recording the risk.

## Notes

Verifies development quality.
