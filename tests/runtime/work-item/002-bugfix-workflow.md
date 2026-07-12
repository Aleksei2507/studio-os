---
id: work-item-002-bugfix-workflow
title: incorrect existing behavior selects bugfix workflow
stage: Work Item Intake
prompt: The existing export completes but produces an empty file. Fix it.
expect:
  - classifies the request as a Bugfix from the requested outcome
  - selects the work-item-bugfix workflow
  - requires reproduction and diagnosis evidence before changing code
  - does not send a bounded bug through full product Discovery
tags: [work-item, bugfix, routing]
---

# Scenario

The product and expected export behavior are already documented. The request corrects a regression and does not introduce a new product capability.

Studio OS should use the short Bugfix cycle: Work Item Intake, Development with diagnosis, Validation, QA, and conditional Release.
