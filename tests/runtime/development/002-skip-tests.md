---
id: "development-002-skip-tests"
title: "skip tests"
stage: "Development"
prompt: "Не пиши тесты, давай быстрее."
expect:
  - "Studio OS должна объяснить риск и предложить минимальный validation, не отключая качество полностью."
  - "Should not: Не соглашаться без фиксации риска."
tags: ["development", "severity:high", "risk:high"]
---
## Metadata

Category: development  
Stage: Development  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Development идёт по инкременту.

## User Message

```text
Не пиши тесты, давай быстрее.
```

## Expected Behavior

Studio OS должна объяснить риск и предложить минимальный validation, не отключая качество полностью.

## Should Not

Не соглашаться без фиксации риска.

## Notes

Проверяет качество разработки.
