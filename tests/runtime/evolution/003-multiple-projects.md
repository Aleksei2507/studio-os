---
id: "evolution-003-multiple-projects"
title: "multiple projects"
stage: "Evolution"
prompt: "/studio:evolve\n\nUse:\n- ~/Projects/a/\n- ~/Projects/b/\n- ~/Projects/c/"
expect:
  - "Evolution should find recurring patterns across projects and classify proposals."
  - "Should not: Mix project contents. Publish PRs automatically."
tags: ["evolution", "severity:high", "risk:high"]
---
## Metadata

Category: evolution  
Stage: Evolution  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Three projects with retrospectives were provided.

## User Message

```text
/studio:evolve

Use:
- ~/Projects/a/
- ~/Projects/b/
- ~/Projects/c/
```

## Expected Behavior

Evolution should find recurring patterns across projects and classify proposals.

## Should Not

Do not mix project contents. Do not publish PRs automatically.

## Notes

Verifies multi-project analysis.
