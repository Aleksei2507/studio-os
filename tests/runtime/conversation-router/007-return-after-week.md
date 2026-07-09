---
id: "conversation-router-007-return-after-week"
title: "return after week"
stage: "Paused"
prompt: "Continue the project."
expect:
  - "Studio OS should read Project Memory, summarize the current state, and resume from the appropriate stage."
  - "Should not: Rely only on chat history."
tags: ["conversation-router", "severity:high", "risk:medium"]
---
## Metadata

Category: conversation-router  
Stage: Paused  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The user returns after a pause.

## User Message

```text
Continue the project.
```

## Expected Behavior

Studio OS should read Project Memory, summarize the current state, and resume from the appropriate stage.

## Should Not

Do not rely only on chat history. Do not restart from scratch.

## Notes

Verifies resume behavior.
