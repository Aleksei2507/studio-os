---
id: "planning-007-development-epics"
title: "brownfield development epics"
stage: "Planning"
prompt: "Break PriceBot development into stages after Brownfield Briefing."
expect:
  - "Brownfield Planning should use Development Epics instead of Product Iterations."
  - "Should not: Use Product Iterations or describe epics through implementation details."
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

An existing production project has completed Brownfield Briefing.

Current Product Scope, Stable Areas, Legacy Areas, Product Boundaries, and Technical Boundaries exist.

## User Message

```text
Break PriceBot development into stages after Brownfield Briefing.
```

## Expected Behavior

Planning should use Development Epics.

Each Epic should contain Goal, Business Value, Scope, Output, Acceptance Criteria, Dependencies, and Handoff To Architecture.

Each Epic should explain what new value or risk reduction the existing product gets.

## Should Not

Do not use Product Iterations. Do not create a new product. Do not describe internal implementation as acceptance criteria.

## Notes

Verifies Brownfield Planning terminology and structure.
