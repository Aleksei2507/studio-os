---
id: "validation-001-run-validation"
title: "run validation"
stage: "Validation"
prompt: "Проверь, что всё работает."
expect:
  - "Validation должен запустить доступные проверки: lint/typecheck/test/build, затем создать validation-report."
  - "Should not: Не ограничиваться словами 'должно работать'."
tags: ["validation", "severity:critical", "risk:high"]
---
## Metadata

Category: validation  
Stage: Validation  
Severity: Critical  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Development completed increment.

## User Message

```text
Проверь, что всё работает.
```

## Expected Behavior

Validation должен запустить доступные проверки: lint/typecheck/test/build, затем создать validation-report.

## Should Not

Не ограничиваться словами 'должно работать'.

## Notes

Проверяет объективную валидацию.
