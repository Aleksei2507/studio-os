---
id: regression-008-scoped-completion
title: completion statements name the completed delivery unit
stage: All
prompt: A remediation task passes all of its required tests while the parent MVP remains incomplete.
expect:
  - names the remediation task as the completed unit
  - reports current increment and Target Milestone readiness separately
  - reports the next stage and remaining increments or blockers
  - does not use task success as evidence that the whole product is complete
tags: [regression, completion, readiness, severity:critical]
---

# Scenario

A Playwright repair passes every bounded check. The project is still on the first of several roadmap increments.

The response must make the scope of completion observable in any Project Language without relying on a fixed phrase.
