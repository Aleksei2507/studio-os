---
id: "loader-005-mode-detection-priority"
title: "mode detection priority"
stage: "Loader"
prompt: "Use Studio OS for this existing project."
expect:
  - "Loader должен применить первый совпавший приоритет: если `.studio` существует, это Continue Existing Project, даже если в проекте есть исходный код."
  - "Should not: Не запускать Brownfield Runtime для проекта с существующей `.studio`."
tags: ["loader", "brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: Critical  
Regression Risk: High

## Goal

Проверить приоритет определения режима.

## Initial State

В проекте есть `.studio/project-state.md`, а также существующий исходный код и проектные файлы.

## User Message

```text
Use Studio OS for this existing project.
```

## Expected Behavior

Loader должен выбрать Continue Existing Project, прочитать Project Memory и передать управление текущему Runtime.

Existing Studio OS Project всегда имеет больший приоритет, чем Brownfield.

## Should Not

Не запускать Brownfield Runtime. Не создавать новую Project Memory поверх существующей. Не запускать Interview.

## Notes

Проверяет правило first matching rule wins.
