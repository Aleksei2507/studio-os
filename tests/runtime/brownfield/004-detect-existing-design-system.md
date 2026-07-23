---
id: brownfield-004-detect-existing-design-system
title: detect an actively used existing design system
stage: Brownfield Onboarding
prompt: Onboard this existing customer portal into Studio OS.
expect:
  - creates .studio/design-system-profile.md with Observed status and Active applicability
  - identifies the design system from converging component theme token and usage evidence
  - records evidence paths confidence component sources foundations and platform variants
  - sets Preserve And Extend without replacing or migrating the current system
tags: [brownfield, design-system, evidence]
---

# Scenario

The repository has a shared UI package, a theme provider, semantic token files, and repeated imports from the shared components in production screens. The package manifest and actual usage support the same conclusion.

Brownfield Onboarding must capture the active system as project memory before Briefing.
