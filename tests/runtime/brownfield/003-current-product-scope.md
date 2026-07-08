---
id: "brownfield-003-current-product-scope"
title: "current product scope for production projects"
stage: "Briefing"
prompt: "PriceBot уже работает в production. Проведи Brownfield Briefing."
expect:
  - "Brownfield Briefing должен использовать Current Product Scope для production-проекта."
  - "Should not: Не использовать MVP Scope и не пытаться заново придумать продукт."
tags: ["brownfield", "briefing", "severity:critical", "risk:high"]
---
## Metadata

Category: brownfield  
Stage: Briefing  
Severity: Critical  
Regression Risk: High

## Goal

Проверить, что Brownfield Briefing использует лексику существующего production-продукта.

## Initial State

Существующий проект PriceBot уже работает в production.

Brownfield Onboarding завершён, Project Memory создана.

## User Message

```text
PriceBot уже работает в production. Проведи Brownfield Briefing.
```

## Expected Behavior

Briefing должен фиксировать Current Product Scope, Stable Areas, Legacy Areas, Product Boundaries, Technical Boundaries и Product Decisions.

Acceptance Criteria должны описывать пользовательскую ценность.

## Should Not

Не использовать MVP Scope. Не переопределять MVP. Не описывать acceptance criteria через внутреннюю реализацию вроде "worker запускается".

## Notes

Проверяет разделение Greenfield и Brownfield продуктовой лексики.
