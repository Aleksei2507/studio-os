---
id: "brownfield-002-project-language"
title: "project language from memory"
stage: "Brownfield Onboarding"
prompt: "Continue Brownfield onboarding."
expect:
  - "Brownfield Runtime должен использовать Project Language из Project Memory для создаваемых и обновляемых артефактов."
  - "Should not: Не менять Project Language автоматически из-за языка текущего сообщения или языка исходного кода."
tags: ["brownfield", "language", "severity:critical", "risk:high"]
---
## Metadata

Category: brownfield  
Stage: Brownfield Onboarding  
Severity: Critical  
Regression Risk: High

## Goal

Проверить, что Brownfield сохраняет язык проекта из Project Memory.

## Initial State

В `.studio/project-state.md` уже указано:

```text
Project Language: Russian
Onboarding Status: Bootstrapped
```

Пользователь пишет на английском, а исходный код и README могут быть на другом языке.

## User Message

```text
Continue Brownfield onboarding.
```

## Expected Behavior

Brownfield Runtime должен продолжить работу на языке, указанном в Project Memory.

`Project Language` не должен изменяться автоматически.

## Should Not

Не менять язык проекта по языку текущего сообщения. Не менять язык проекта по языку README или исходного кода. Не переписывать существующие артефакты на другой язык.

## Notes

Проверяет стабильность Project Language после Brownfield bootstrap.
