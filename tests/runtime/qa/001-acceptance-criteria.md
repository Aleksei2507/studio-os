---
id: "qa-001-acceptance-criteria"
title: "acceptance criteria"
stage: "QA"
prompt: "Начинай QA."
expect:
  - "QA должен проверить продуктовые acceptance criteria, а не только тесты."
  - "Should not: Не подменять QA техническим build passed."
tags: ["qa", "severity:high", "risk:high"]
---
## Metadata

Category: qa  
Stage: QA  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Validation passed. Есть project-brief acceptance criteria.

## User Message

```text
Начинай QA.
```

## Expected Behavior

QA должен проверить продуктовые acceptance criteria, а не только тесты.

## Should Not

Не подменять QA техническим build passed.

## Notes

Проверяет отличие QA от Validation.
