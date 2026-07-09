---
id: "planning-006-brownfield-development-roadmap"
title: "brownfield development roadmap"
stage: "Planning"
prompt: "PriceBot is already in production. Create Planning after Brownfield Briefing."
expect:
  - "Brownfield Planning should create a Development Roadmap for evolving an existing product."
  - "Should not: Create a Product Roadmap or plan a new product."
tags: ["planning", "brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: planning  
Stage: Planning  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The existing PriceBot project is already running in production.

Brownfield Briefing is completed and captured Current Product Scope.

## User Message

```text
PriceBot is already in production. Create Planning after Brownfield Briefing.
```

## Expected Behavior

Planning should create a Development Roadmap aimed at evolving the existing product.

## Should Not

Do not create a Product Roadmap. Do not plan a new product. Do not use Greenfield terminology as the primary language.

## Notes

Verifies the difference between Product Roadmap and Development Roadmap.
