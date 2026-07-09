---
id: "planning-001-build-value-iterations"
title: "build value iterations"
stage: "Planning"
prompt: "Move to Planning."
expect:
  - "Planning should propose a roadmap made of value iterations without returning to MVP definition."
  - "Should not: Ask what we are building. Choose the stack."
tags: ["planning", "severity:high", "risk:high"]
---
## Metadata

Category: planning  
Stage: Planning  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Project Brief is completed.

## User Message

```text
Move to Planning.
```

## Expected Behavior

Planning should propose a roadmap made of value iterations without returning to MVP definition.

## Should Not

Do not ask what we are building. Do not choose the stack.

## Notes

Verifies the essence of Planning.
