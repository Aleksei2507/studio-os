---
id: "brownfield-001-create-project-memory"
title: "create initial project memory"
stage: "Brownfield Onboarding"
prompt: "Analyze the existing project through Studio OS."
expect:
  - "Brownfield Runtime should create .studio/project-state.md, .studio/active-context.md, and docs/discovery-summary.md."
  - "Should not: Change code, write roadmap, write architecture, or start Briefing automatically."
tags: ["brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: brownfield  
Stage: Brownfield Onboarding  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The project has existing code and documentation, but no .studio/ directory.

## User Message

```text
Analyze the existing project through Studio OS.
```

## Expected Behavior

Brownfield Runtime should create `.studio/project-state.md`, `.studio/active-context.md`, and `docs/discovery-summary.md`.

`project-state.md` should contain Mode: Brownfield, Previous Stage: Brownfield Onboarding, Current Stage: Briefing, and Status: Waiting Confirmation.

`docs/discovery-summary.md` should end with Recommended Next Step: Briefing.

## Should Not

Do not change code. Do not refactor. Do not write roadmap. Do not write architecture. Do not do planning. Do not start Briefing automatically.

## Notes

Verifies Brownfield Runtime boundaries.
