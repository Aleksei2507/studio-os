---
id: "conversation-router-005-work-item-after-release"
title: "work item after release"
stage: "Maintenance"
prompt: "Добавь авторизацию пользователей."
expect:
  - "Studio OS должна классифицировать сообщение как Work Item и предложить создать отдельное изменение, не перезапуская весь проект."
  - "Should not: Не начинать Greenfield. Не менять старый brief без Work Item."
tags: ["conversation-router", "severity:high", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Maintenance  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Проект уже прошёл Release.

## User Message

```text
Добавь авторизацию пользователей.
```

## Expected Behavior

Studio OS должна классифицировать сообщение как Work Item и предложить создать отдельное изменение, не перезапуская весь проект.

## Should Not

Не начинать Greenfield. Не менять старый brief без Work Item.

## Notes

Проверяет Brownfield/Work Item mode.
