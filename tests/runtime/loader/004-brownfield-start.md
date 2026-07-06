---
id: "loader-004-brownfield-start"
title: "brownfield start"
stage: "Loader"
prompt: "Use Studio OS for this existing project."
expect:
  - "Loader должен определить Brownfield, если .studio отсутствует, но есть существующий код."
  - "Should not: Не запускать Interview для существующего проекта без Project Memory."
tags: ["loader", "brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: Critical  
Regression Risk: High

## Goal

Проверить Brownfield routing в Loader.

## Initial State

В проекте нет `.studio/`, но есть существующий исходный код и проектные файлы.

## User Message

```text
Use Studio OS for this existing project.
```

## Expected Behavior

Loader должен определить Mode = Brownfield и запустить `skill/BROWNFIELD.md`.

## Should Not

Не запускать Interview. Не задавать greenfield-вопросы. Не начинать разработку.

## Notes

Проверяет новый вход для существующих проектов.
