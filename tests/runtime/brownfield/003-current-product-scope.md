---
id: "brownfield-003-current-product-scope"
title: "current product scope for production projects"
stage: "Briefing"
prompt: "PriceBot is already running in production. Run Brownfield Briefing."
expect:
  - "Brownfield Briefing should use Current Product Scope for a production project."
  - "Should not: Use MVP Scope or try to invent the product again."
tags: ["brownfield", "briefing", "severity:critical", "risk:high"]
---
## Metadata

Category: brownfield  
Stage: Briefing  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The existing PriceBot project is already running in production.

Brownfield Onboarding is completed and Project Memory has been created.

## User Message

```text
PriceBot is already running in production. Run Brownfield Briefing.
```

## Expected Behavior

Briefing should capture Current Product Scope, Stable Areas, Legacy Areas, Product Boundaries, Technical Boundaries, and Product Decisions.

Acceptance Criteria should describe user value.

## Should Not

Do not use MVP Scope. Do not redefine the MVP. Do not describe acceptance criteria through internal implementation details such as "the worker runs".

## Notes

Verifies the separation between Greenfield and Brownfield product terminology.
