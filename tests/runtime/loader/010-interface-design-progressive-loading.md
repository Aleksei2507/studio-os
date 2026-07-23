---
id: loader-010-interface-design-progressive-loading
title: loader loads only the selected interface design platform context
stage: Loader
prompt: Resume Interface Design for the accepted Web project.
expect:
  - loads the selected workflow Interface Design Runtime and its three capability contracts
  - loads direct and profile-selected standards applicable to Interface Design
  - loads the canonical and active Work Item Design System Profiles when available
  - loads the web reference and accepted stack adapter only
  - does not preload mobile desktop or unrelated Runtime references
tags: [loader, interface-design, progressive-loading]
---

# Scenario

Project Memory sets Interface Design as current stage. Architecture accepted a Next.js Web surface and an Accepted Standards Profile. Brownfield Onboarding recorded an Observed Design System Profile.
