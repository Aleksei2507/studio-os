---
id: "evolution-002-one-project"
title: "one project"
stage: "Evolution"
prompt: "/studio:evolve\n\nUse:\n- ~/Projects/water-filter/"
expect:
  - "Evolution should analyze the retrospective and create local proposals only when justified."
  - "Should not: Change Runtime automatically."
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

One project with .studio/runtime-retrospective.md was provided.

## User Message

```text
/studio:evolve

Use:
- ~/Projects/water-filter/
```

## Expected Behavior

Evolution should analyze the retrospective and create local proposals only when justified.

## Should Not

Do not change Runtime automatically.

## Notes

Verifies basic Evolution.
