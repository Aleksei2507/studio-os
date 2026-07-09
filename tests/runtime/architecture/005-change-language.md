---
id: "architecture-005-change-language"
title: "change language"
stage: "Architecture"
prompt: "Let us use Go instead."
expect:
  - "Studio OS should identify a change to an architectural decision, ask for the reason, and update the ADR if needed."
  - "Should not: Change the stack silently."
tags: ["architecture", "severity:medium", "risk:medium"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Architecture selected TypeScript.

## User Message

```text
Let us use Go instead.
```

## Expected Behavior

Studio OS should identify a change to an architectural decision, ask for the reason, and update the ADR if needed.

## Should Not

Do not change the stack silently.

## Notes

Verifies decision management.
