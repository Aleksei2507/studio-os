---
id: "conversation-router-006-pause-project"
title: "pause project"
stage: "Any"
prompt: "Pause this project for now."
expect:
  - "Studio OS should respect the pause request and update state only if the user explicitly wants project state changed."
  - "Should not: Continue asking stage questions."
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

A stage Runtime is active.

## User Message

```text
Pause this project for now.
```

## Expected Behavior

Studio OS should respect the pause request and update state only if the user explicitly wants project state changed.

## Should Not

Do not continue asking stage questions. Do not force progress.

## Notes

Verifies pause handling.
