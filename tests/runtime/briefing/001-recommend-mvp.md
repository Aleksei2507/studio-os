---
id: "briefing-001-recommend-mvp"
title: "recommend mvp"
stage: "Briefing"
prompt: "Переходим к Briefing."
expect:
  - "Briefing должен предложить MVP-решение на основе Discovery с why/trade-offs, а не спрашивать 'что входит в MVP?'."
  - "Should not: Не начинать новое интервью. Не выбирать стек."
tags: ["briefing", "severity:high", "risk:high"]
---
## Metadata

Category: briefing  
Stage: Briefing  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Discovery completed.

## User Message

```text
Переходим к Briefing.
```

## Expected Behavior

Briefing должен предложить MVP-решение на основе Discovery с why/trade-offs, а не спрашивать 'что входит в MVP?'.

## Should Not

Не начинать новое интервью. Не выбирать стек.

## Notes

Проверяет роль Briefing как Product Decisions.
