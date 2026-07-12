---
id: work-item-001-feature-workflow
title: feature request selects feature workflow
stage: Work Item Intake
prompt: Add a saved filters capability to the existing product.
expect:
  - classifies the requested outcome as a Feature
  - selects work-item-feature without restarting project onboarding
  - records affected product artifacts and acceptance evidence before Development
tags: [work-item, feature, routing]
---

# Scenario

The project already has `.studio/project-state.md` and accepted product artifacts. The user requests a bounded user-visible capability.

Studio OS should initialize a Feature Work Item. Briefing, Planning, and Architecture remain conditional based on scope clarity, number of steps, and architecture impact.
