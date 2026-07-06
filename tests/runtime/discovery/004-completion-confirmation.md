---
id: "discovery-004-completion-confirmation"
title: "completion confirmation"
stage: "Discovery"
prompt: "Подтверждаю."
expect:
  - "Studio OS должна создать docs/discovery-summary.md, обновить .studio и предложить Briefing без автозапуска."
  - "Should not: Не начинать Briefing автоматически."
tags: ["discovery", "severity:medium", "risk:medium"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Discovery подготовил summary.

## User Message

```text
Подтверждаю.
```

## Expected Behavior

Studio OS должна создать docs/discovery-summary.md, обновить .studio и предложить Briefing без автозапуска.

## Should Not

Не начинать Briefing автоматически.

## Notes

Проверяет завершение стадии.
