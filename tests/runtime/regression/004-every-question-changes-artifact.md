---
id: "regression-004-every-question-changes-artifact"
title: "every question changes artifact"
stage: "All"
prompt: "Продолжай."
expect:
  - "Before asking, Runtime should ensure the answer changes the next artifact."
  - "Should not: Не задавать любопытные, но бесполезные вопросы."
tags: ["regression", "severity:high", "risk:high"]
---
## Metadata

Category: regression  
Stage: All  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Runtime собирается задать вопрос.

## User Message

```text
Продолжай.
```

## Expected Behavior

Before asking, Runtime should ensure the answer changes the next artifact.

## Should Not

Не задавать любопытные, но бесполезные вопросы.

## Notes

Проверяет главный принцип.
