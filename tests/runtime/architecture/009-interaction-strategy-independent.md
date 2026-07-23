---
id: architecture-009-interaction-strategy-independent
title: interaction strategy does not imply technical proficiency
stage: Architecture
prompt: Choose the best technical approach for me and keep the explanation brief.
expect:
  - uses Advisor collaboration behavior without classifying technical proficiency
  - does not choose a simplified or no-code stack solely because decisions were delegated
  - makes and owns the technical recommendation without asking what the user can maintain
tags: [architecture, interaction, technology]
---

# Scenario

The user delegates the decision to Studio OS. Advisor behavior affects explanation length, while Architecture remains responsible for a complete product and lifecycle decision.
