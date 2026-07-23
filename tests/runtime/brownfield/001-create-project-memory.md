---
id: "brownfield-001-create-project-memory"
title: "create initial project memory"
stage: "Brownfield Onboarding"
prompt: "Analyze the existing project through Studio OS."
expect:
  - "Brownfield Runtime should create .studio/project-state.md, .studio/active-context.md, .studio/standards-profile.md, .studio/design-system-profile.md, and docs/discovery-summary.md."
  - "Standards profile should be Observed and must not replace the existing stack."
  - "Design System Profile should be Observed and must record evidence-bounded applicability without replacing the current interface system."
  - "Project State should initialize Target Milestone and increment readiness fields without claiming release readiness."
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

Brownfield Runtime should create `.studio/project-state.md`, `.studio/active-context.md`, `.studio/standards-profile.md`, `.studio/design-system-profile.md`, and `docs/discovery-summary.md`.

`standards-profile.md` should have Observed status and record repository evidence without selecting a replacement stack or classifying the user.

`design-system-profile.md` should have Observed status and record Active, Not Applicable, or Unknown applicability from repository and design evidence without selecting a replacement system.

`project-state.md` should contain Mode: Brownfield, Previous Stage: Brownfield Onboarding, Current Stage: Briefing, and Status: Waiting Confirmation.

`docs/discovery-summary.md` should end with Recommended Next Step: Briefing.

## Should Not

Do not change code. Do not refactor. Do not write roadmap. Do not write architecture. Do not do planning. Do not start Briefing automatically.

## Notes

Verifies Brownfield Runtime boundaries.
