---
id: brownfield-006-multiple-design-systems
title: preserve multiple and legacy design-system boundaries
stage: Brownfield Onboarding
prompt: Onboard this existing multi-surface product into Studio OS.
expect:
  - distinguishes the primary system secondary platform system and legacy interface boundary
  - distinguishes actively used systems from an installed but unused UI dependency
  - records conflicts ownership confidence and evidence for each boundary
  - does not collapse the systems or propose migration during onboarding
tags: [brownfield, design-system, legacy, multi-platform]
---

# Scenario

Most Web screens use a project-owned component library and semantic tokens. A legacy administration area uses older local styles, the mobile client uses native platform components, and one UI dependency is installed but not imported by production code.

Brownfield Onboarding must preserve these distinct facts for later decisions.
