---
id: "brownfield-001-create-project-memory"
title: "create initial project memory"
stage: "Brownfield Onboarding"
prompt: "Проанализируй существующий проект через Studio OS."
expect:
  - "Brownfield Runtime должен создать .studio/project-state.md, .studio/active-context.md и docs/discovery-summary.md."
  - "Should not: Не менять код, не писать roadmap, не писать architecture и не начинать Briefing автоматически."
tags: ["brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: brownfield  
Stage: Brownfield Onboarding  
Severity: Critical  
Regression Risk: High

## Goal

Проверить создание первоначальной Project Memory для существующего проекта.

## Initial State

В проекте есть существующий код и документация, но нет `.studio/`.

## User Message

```text
Проанализируй существующий проект через Studio OS.
```

## Expected Behavior

Brownfield Runtime должен создать `.studio/project-state.md`, `.studio/active-context.md` и `docs/discovery-summary.md`.

`project-state.md` должен содержать Mode: Brownfield, Previous Stage: Brownfield Onboarding, Current Stage: Briefing и Status: Waiting Confirmation.

`docs/discovery-summary.md` должен завершаться Recommended Next Step: Briefing.

## Should Not

Не менять код. Не выполнять рефакторинг. Не писать roadmap. Не писать architecture. Не делать planning. Не начинать Briefing автоматически.

## Notes

Проверяет границы Brownfield Runtime.
