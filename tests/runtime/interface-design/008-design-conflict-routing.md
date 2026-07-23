---
id: interface-design-008-design-conflict-routing
title: interface design routes conflicts to the owning stage
stage: Interface Design
prompt: Resolve a conflict between the requested screen and accepted product or architecture decisions.
expect:
  - stops the conflicting interface decision
  - routes product experience conflicts to Design Strategy or Briefing
  - routes stack boundary or technical feasibility conflicts to Architecture
  - does not silently change accepted decisions
tags: [interface-design, routing, conflict]
---

# Scenario

A requested interaction requires a product behavior and technical boundary that were not accepted by earlier stages.
