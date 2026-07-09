---
id: "evolution-004-missing-retro"
title: "missing retro"
stage: "Evolution"
prompt: "/studio:evolve\n\nUse:\n- ~/Projects/a/\n- ~/Projects/b/"
expect:
  - "Evolution should skip/mark the project without a retrospective and continue with available sources."
  - "Should not: Fail. Invent a retrospective."
tags: ["evolution", "severity:medium", "risk:medium"]
---
## Metadata

Category: evolution  
Stage: Evolution  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

One of the provided projects has no .studio/runtime-retrospective.md.

## User Message

```text
/studio:evolve

Use:
- ~/Projects/a/
- ~/Projects/b/
```

## Expected Behavior

Evolution should skip/mark the project without a retrospective and continue with available sources.

## Should Not

Do not fail. Do not invent a retrospective.

## Notes

Verifies resilience.
