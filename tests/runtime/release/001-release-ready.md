---
id: "release-001-release-ready"
title: "release ready"
stage: "Release"
prompt: "Готовим релиз."
expect:
  - "Release должен создать release notes, зафиксировать версию/ограничения и предложить Retrospective."
  - "Should not: Не пропускать release notes."
tags: ["release", "severity:high", "risk:high"]
---
## Metadata

Category: release  
Stage: Release  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

QA passed. Validation passed.

## User Message

```text
Готовим релиз.
```

## Expected Behavior

Release должен создать release notes, зафиксировать версию/ограничения и предложить Retrospective.

## Should Not

Не пропускать release notes.

## Notes

Проверяет завершение проекта.
