---
id: brownfield-005-no-design-system-evidence
title: do not invent a design system without interface evidence
stage: Brownfield Onboarding
prompt: Onboard this existing service into Studio OS.
expect:
  - creates an Observed Design System Profile with Not Applicable for a project without a user-facing interface
  - uses Unknown when an interface may exist but evidence is insufficient or contradictory
  - records the evidence limitation instead of fabricating tokens components or visual rules
  - does not route the absence to a framework replacement or migration
tags: [brownfield, design-system, unknowns]
---

# Scenario

The repository contains an API service, database migrations, and operational tooling. It has no user-facing interface, shared UI components, theme resources, or design artifacts.

Brownfield Onboarding must record the absence precisely rather than manufacture a design system.
