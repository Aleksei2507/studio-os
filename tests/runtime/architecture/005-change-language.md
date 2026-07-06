---
id: "architecture-005-change-language"
title: "change language"
stage: "Architecture"
prompt: "Давай лучше на Go."
expect:
  - "Studio OS должна определить изменение архитектурного решения, запросить причину и при необходимости обновить ADR."
  - "Should not: Не менять стек молча."
tags: ["architecture", "severity:medium", "risk:medium"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Architecture выбрала TypeScript.

## User Message

```text
Давай лучше на Go.
```

## Expected Behavior

Studio OS должна определить изменение архитектурного решения, запросить причину и при необходимости обновить ADR.

## Should Not

Не менять стек молча.

## Notes

Проверяет управление решениями.
