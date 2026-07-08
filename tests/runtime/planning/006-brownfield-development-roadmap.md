---
id: "planning-006-brownfield-development-roadmap"
title: "brownfield development roadmap"
stage: "Planning"
prompt: "PriceBot уже production. Составь Planning после Brownfield Briefing."
expect:
  - "Brownfield Planning должен создать Development Roadmap для развития существующего продукта."
  - "Should not: Не создавать Product Roadmap и не планировать новый продукт."
tags: ["planning", "brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: planning  
Stage: Planning  
Severity: Critical  
Regression Risk: High

## Goal

Проверить, что Brownfield Planning создает Development Roadmap.

## Initial State

Существующий проект PriceBot уже работает в production.

Brownfield Briefing завершен и зафиксировал Current Product Scope.

## User Message

```text
PriceBot уже production. Составь Planning после Brownfield Briefing.
```

## Expected Behavior

Planning должен создать Development Roadmap, направленный на развитие существующего продукта.

## Should Not

Не создавать Product Roadmap. Не планировать новый продукт. Не использовать Greenfield-лексику как основную.

## Notes

Проверяет различие Product Roadmap и Development Roadmap.
