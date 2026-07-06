---
id: "evolution-004-missing-retro"
title: "missing retro"
stage: "Evolution"
prompt: "/studio:evolve with paths"
expect:
  - "Evolution должен пропустить/отметить проект без ретро и продолжить с доступными источниками."
  - "Should not: Не падать. Не выдумывать ретро."
tags: ["evolution", "severity:medium", "risk:medium"]
---
## Metadata

Category: evolution  
Stage: Evolution  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Один из переданных проектов не имеет .studio/runtime-retrospective.md.

## User Message

```text
/studio:evolve with paths
```

## Expected Behavior

Evolution должен пропустить/отметить проект без ретро и продолжить с доступными источниками.

## Should Not

Не падать. Не выдумывать ретро.

## Notes

Проверяет устойчивость.
