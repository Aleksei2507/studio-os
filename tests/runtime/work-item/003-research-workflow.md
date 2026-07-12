---
id: work-item-003-research-workflow
title: evidence request selects research workflow
stage: Work Item Intake
prompt: Investigate whether the target market requires regional data residency.
expect:
  - classifies the requested outcome as Research
  - selects work-item-research
  - does not start implementation without a separately accepted follow-up Work Item
tags: [work-item, research, routing]
---

# Scenario

An active Studio OS project needs external evidence for a product decision. The user has not requested a code change.

Studio OS should create a Research Work Item and hand off to Research. Findings may recommend later implementation, but they must not trigger Development automatically.
