---
id: "conversation-router-004-new-project-mid-stage"
title: "new project mid stage"
stage: "Discovery"
prompt: "Хочу сделать CRM для автосервиса."
expect:
  - "Studio OS должна спросить, хочет ли пользователь начать новый проект или это случайная идея, и предупредить, что текущий проект будет сохранён/поставлен на паузу."
  - "Should not: Не перезаписывать текущую .studio. Не смешивать продукты."
tags: ["conversation-router", "severity:critical", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Discovery  
Severity: Critical  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Есть активный проект в Discovery.

## User Message

```text
Хочу сделать CRM для автосервиса.
```

## Expected Behavior

Studio OS должна спросить, хочет ли пользователь начать новый проект или это случайная идея, и предупредить, что текущий проект будет сохранён/поставлен на паузу.

## Should Not

Не перезаписывать текущую .studio. Не смешивать продукты.

## Notes

Проверяет безопасность переключения проектов.
