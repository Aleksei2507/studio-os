---
id: "regression-003-active-context-size"
title: "active context size"
stage: "All"
prompt: "Update Project Memory."
expect:
  - "active-context.md should remain compact and contain only current useful context."
  - "Should not: Copy the entire project-brief/roadmap into active-context.md."
tags: ["regression", "severity:medium", "risk:medium"]
---
## Metadata

Category: regression  
Stage: All  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Project Memory needs an update after a stage.

## User Message

```text
Update Project Memory.
```

## Expected Behavior

active-context.md should remain compact and contain only current useful context.

## Should Not

Do not copy the entire project-brief/roadmap into active-context.md.

## Notes

Verifies compact memory.
