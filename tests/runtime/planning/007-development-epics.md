---
id: "planning-007-development-epics"
title: "brownfield development epics"
stage: "Planning"
prompt: "Разбей развитие PriceBot на этапы после Brownfield Briefing."
expect:
  - "Brownfield Planning должен использовать Development Epics вместо Product Iterations."
  - "Should not: Не использовать Product Iterations и не описывать epics через implementation details."
tags: ["planning", "brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: planning  
Stage: Planning  
Severity: Critical  
Regression Risk: High

## Goal

Проверить, что Brownfield Planning мыслит Development Epics.

## Initial State

Существующий production-проект прошел Brownfield Briefing.

Есть Current Product Scope, Stable Areas, Legacy Areas, Product Boundaries и Technical Boundaries.

## User Message

```text
Разбей развитие PriceBot на этапы после Brownfield Briefing.
```

## Expected Behavior

Planning должен использовать Development Epics.

Каждый Epic должен содержать Goal, Business Value, Scope, Output, Acceptance Criteria, Dependencies и Handoff To Architecture.

Каждый Epic должен отвечать, какую новую ценность или снижение риска получает существующий продукт.

## Should Not

Не использовать Product Iterations. Не создавать новый продукт. Не описывать внутреннюю реализацию как acceptance criteria.

## Notes

Проверяет терминологию и структуру Brownfield Planning.
