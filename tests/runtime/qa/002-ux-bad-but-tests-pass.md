---
id: "qa-002-ux-bad-but-tests-pass"
title: "ux bad but tests pass"
stage: "QA"
prompt: "Тесты зелёные, релизим?"
expect:
  - "Studio OS должна сказать, что QA может не пройти из-за UX/acceptance criteria, даже если тесты зелёные."
  - "Should not: Не релизить только из-за зелёных тестов."
tags: ["qa", "severity:high", "risk:medium"]
---
## Metadata

Category: qa  
Stage: QA  
Severity: High  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Validation passed, но текст результата непонятен пользователю.

## User Message

```text
Тесты зелёные, релизим?
```

## Expected Behavior

Studio OS должна сказать, что QA может не пройти из-за UX/acceptance criteria, даже если тесты зелёные.

## Should Not

Не релизить только из-за зелёных тестов.

## Notes

Проверяет продуктовый QA.
