---
id: "evolution-001-no-projects"
title: "no projects"
stage: "Evolution"
prompt: "/studio:evolve"
expect:
  - "Evolution should explain that project paths are required and show an example command."
  - "Should not: Search for projects magically. Fail."
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

The user starts Evolution without paths.

## User Message

```text
/studio:evolve
```

## Expected Behavior

Evolution should explain that project paths are required and show an example command.

## Should Not

Do not search for projects magically. Do not fail.

## Notes

Verifies Evolution UX.
