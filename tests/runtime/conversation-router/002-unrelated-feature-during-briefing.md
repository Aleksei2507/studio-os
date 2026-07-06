---
id: "conversation-router-002-unrelated-feature-during-briefing"
title: "unrelated feature during briefing"
stage: "Briefing"
prompt: "Хочу, чтобы сервис умел отличать мальчика от девочки."
expect:
  - "Studio OS должна заметить, что требование не связано с текущим Briefing, и уточнить намерение или мягко вернуть к текущему решению."
  - "Should not: Не включать требование в MVP. Не высмеивать пользователя. Не терять Briefing-контекст."
tags: ["conversation-router", "severity:high", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Briefing  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Briefing фиксирует MVP сервиса водоподготовки.

## User Message

```text
Хочу, чтобы сервис умел отличать мальчика от девочки.
```

## Expected Behavior

Studio OS должна заметить, что требование не связано с текущим Briefing, и уточнить намерение или мягко вернуть к текущему решению.

## Should Not

Не включать требование в MVP. Не высмеивать пользователя. Не терять Briefing-контекст.

## Notes

Проверяет защиту scope.
