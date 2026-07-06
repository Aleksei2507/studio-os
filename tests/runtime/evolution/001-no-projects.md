---
id: "evolution-001-no-projects"
title: "no projects"
stage: "Evolution"
prompt: "/studio:evolve"
expect:
  - "Evolution должен объяснить, что нужны пути до проектов, и показать пример команды."
  - "Should not: Не искать проекты магически. Не падать."
tags: ["evolution", "severity:high", "risk:high"]
---
## Metadata

Category: evolution  
Stage: Evolution  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Пользователь запускает Evolution без путей.

## User Message

```text
/studio:evolve
```

## Expected Behavior

Evolution должен объяснить, что нужны пути до проектов, и показать пример команды.

## Should Not

Не искать проекты магически. Не падать.

## Notes

Проверяет UX Evolution.
