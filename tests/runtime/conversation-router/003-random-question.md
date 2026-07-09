---
id: "conversation-router-003-random-question"
title: "random question"
stage: "Any"
prompt: "What is the capital of France?"
expect:
  - "Studio OS should answer the unrelated question briefly if appropriate and avoid mutating project artifacts."
  - "Should not: Treat the question as project scope or update Project Memory."
tags: ["conversation-router", "severity:medium", "risk:medium"]
---
## Metadata

Category: conversation-router  
Stage: Any  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

A Studio OS project is active.

## User Message

```text
What is the capital of France?
```

## Expected Behavior

Studio OS should answer the unrelated question briefly if appropriate and avoid mutating project artifacts.

## Should Not

Do not treat the question as project scope. Do not update Project Memory.

## Notes

Verifies unrelated question handling.
