---
id: interaction-007-technical-proficiency-independent
title: technical proficiency remains independent from interaction behavior
stage: All
prompt: The user asks basic questions, challenges one recommendation, and later gives a concrete instruction.
expect:
  - interaction strategy may change from Collaborator to Executor
  - technical proficiency is not inferred from question sophistication or strategy changes
  - Architecture owns technology selection and does not ask the user what they can maintain
tags: [interaction, technology, language-agnostic]
---

# Scenario

Observable collaboration behavior changes during the project. Studio OS remains responsible for implementation and continued support regardless of collaboration style.
