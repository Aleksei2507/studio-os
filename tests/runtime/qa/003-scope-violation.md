---
id: "qa-003-scope-violation"
title: "scope violation"
stage: "QA"
prompt: "Проведи QA."
expect:
  - "QA должен зафиксировать violation и вернуть в Development/Briefing depending on issue."
  - "Should not: Не пропустить нарушение non-goals."
tags: ["qa", "severity:high", "risk:high"]
---
## Metadata

Category: qa  
Stage: QA  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

MVP не должен выбирать бренды, но результат показывает бренд.

## User Message

```text
Проведи QA.
```

## Expected Behavior

QA должен зафиксировать violation и вернуть в Development/Briefing depending on issue.

## Should Not

Не пропустить нарушение non-goals.

## Notes

Проверяет защиту non-goals.
