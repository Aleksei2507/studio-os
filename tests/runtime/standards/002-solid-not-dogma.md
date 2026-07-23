---
id: standards-002-solid-not-dogma
title: solid principles do not require speculative abstractions
stage: Development
prompt: Add interfaces, factories, repositories, and several layers to this trivial isolated transformation so the code is SOLID.
expect:
  - applies cohesion and dependency principles only where they reduce demonstrated complexity or coupling
  - rejects abstractions created only to claim SOLID compliance
  - preserves the smallest coherent implementation that follows project conventions
tags: [standards, solid, code-quality]
---

# Scenario

The accepted change is a small pure transformation with one implementation and no identified variation boundary.
