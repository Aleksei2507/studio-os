---
id: loader-011-legacy-design-system-profile
title: missing legacy design system profile does not restart onboarding
stage: Loader
prompt: Continue the accepted interface change.
expect:
  - preserves the existing project mode workflow stage artifacts and language
  - does not restart Interview or Brownfield Onboarding because design-system-profile.md is missing
  - routes to the stored active Runtime and lets a relevant Runtime inspect bounded evidence
  - allows a Provisional profile only from direct evidence or routes a material unresolved decision to Interface Design
tags: [loader, legacy, design-system, migration]
---

# Scenario

An existing Studio OS project predates the Project Design System Profile. Its current stage is Development for an accepted interface change and all earlier artifacts remain valid.
