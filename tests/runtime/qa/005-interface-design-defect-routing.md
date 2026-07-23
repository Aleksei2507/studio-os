---
id: qa-005-interface-design-defect-routing
title: qa routes interface defects to the owning stage
stage: QA
prompt: Classify and route the failed interface scenario.
expect:
  - compares the implementation with accepted Interface Design and product criteria
  - checks observable conformance with the applicable Design System Profile and approved deviations
  - routes implementation divergence to Development
  - routes a defective accepted detailed design to Interface Design
  - routes experience strategy or acceptance conflicts to Design Strategy or Briefing
tags: [qa, interface-design, routing]
---

# Scenario

The validated build fails an important user scenario and also differs from the active design-system component and token rules.

QA must distinguish whether the build violates the accepted design or faithfully implements a design decision that is itself defective.
