---
id: "loader-001-greenfield-start"
title: "greenfield start"
stage: "Loader"
prompt: "Используй Studio OS\\n\\nХочу сделать сервис для подбора фильтрации воды на даче."
expect:
  - "Loader должен определить Greenfield, зафиксировать язык проекта и сразу передать управление Interview."
  - "Should not: Не спрашивать лишнее подтверждение 'начинать Interview?'. Не выбирать стек. Не писать код."
tags: ["loader", "severity:critical", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: Critical  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

В папке нет .studio, docs и исходного кода.

## User Message

```text
Используй Studio OS\n\nХочу сделать сервис для подбора фильтрации воды на даче.
```

## Expected Behavior

Loader должен определить Greenfield, зафиксировать язык проекта и сразу передать управление Interview.

## Should Not

Не спрашивать лишнее подтверждение 'начинать Interview?'. Не выбирать стек. Не писать код.

## Notes

Проверяет невидимый Loader.
