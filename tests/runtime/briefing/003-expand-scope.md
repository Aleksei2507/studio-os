---
id: "briefing-003-expand-scope"
title: "expand scope"
stage: "Briefing"
prompt: "Хочу сразу поддерживать пользователей с готовым анализом."
expect:
  - "Studio OS должна объяснить, что это расширяет MVP, показать trade-offs и предложить вернуться к MVP-решению."
  - "Should not: Не менять scope молча."
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

Briefing зафиксировал сценарий без анализа как MVP.

## User Message

```text
Хочу сразу поддерживать пользователей с готовым анализом.
```

## Expected Behavior

Studio OS должна объяснить, что это расширяет MVP, показать trade-offs и предложить вернуться к MVP-решению.

## Should Not

Не менять scope молча.

## Notes

Проверяет trade-offs.
