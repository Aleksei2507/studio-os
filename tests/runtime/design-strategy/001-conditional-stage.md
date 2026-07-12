---
id: design-strategy-001-conditional-stage
title: design strategy runs only when experience decisions matter
stage: Design Strategy
prompt: Decide whether the project needs a Design Strategy stage.
expect:
  - runs when interaction, trust, accessibility, device, or positioning materially affects the product
  - skips with a recorded reason when existing conventions are sufficient
  - does not run merely because the product has a user interface
tags: [design-strategy, workflow, conditional]
---

# Scenario

The workflow must decide whether Design Strategy will change Planning or Architecture.

The stage should be selected from product impact rather than from a fixed assumption that every interface needs a separate design process.
