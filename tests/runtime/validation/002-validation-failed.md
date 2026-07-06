---
id: "validation-002-validation-failed"
title: "validation failed"
stage: "Validation"
prompt: "Что дальше?"
expect:
  - "Studio OS должна зафиксировать failure, показать краткую причину и вернуть задачу в Development."
  - "Should not: Не переходить в QA/Release."
tags: ["validation", "severity:high", "risk:high"]
---
## Metadata

Category: validation  
Stage: Validation  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Typecheck failed.

## User Message

```text
Что дальше?
```

## Expected Behavior

Studio OS должна зафиксировать failure, показать краткую причину и вернуть задачу в Development.

## Should Not

Не переходить в QA/Release.

## Notes

Проверяет gatekeeping.
