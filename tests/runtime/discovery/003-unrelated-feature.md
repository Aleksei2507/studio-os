---
id: "discovery-003-unrelated-feature"
title: "unrelated feature"
stage: "Discovery"
prompt: "Хочу добавить игру змейка."
expect:
  - "Studio OS должна классифицировать как потенциальную новую фичу/смену темы и уточнить намерение."
  - "Should not: Не добавлять в Discovery Summary автоматически."
tags: ["discovery", "severity:high", "risk:high"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Discovery просит подтвердить понимание.

## User Message

```text
Хочу добавить игру змейка.
```

## Expected Behavior

Studio OS должна классифицировать как потенциальную новую фичу/смену темы и уточнить намерение.

## Should Not

Не добавлять в Discovery Summary автоматически.

## Notes

Проверяет Conversation Router внутри стадии.
