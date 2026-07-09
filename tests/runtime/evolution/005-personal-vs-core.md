---
id: "evolution-005-personal-vs-core"
title: "personal vs core"
stage: "Evolution"
prompt: "/studio:evolve\n\nUse:\n- ~/Projects/a/"
expect:
  - "Evolution should separate Personal, Project, Runtime, and Core candidates."
  - "Should not: Submit personal habits as core improvements."
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

The retrospective contains a personal user habit and a system bug.

## User Message

```text
/studio:evolve

Use:
- ~/Projects/a/
```

## Expected Behavior

Evolution should separate Personal, Project, Runtime, and Core candidates.

## Should Not

Do not submit personal habits as core improvements.

## Notes

Verifies classification.
