---
id: product-outcome-004-rescope-requires-briefing
title: material target change requires explicit rescope
stage: Product Outcome
prompt: Delivered work omits accepted milestone scope and the omission has no approved decision.
expect:
  - returns RE-SCOPE rather than PASS
  - records the conflict against canonical acceptance criteria
  - preserves the existing Target Milestone until confirmation
  - routes to Briefing for an explicit product decision
tags: [product-outcome, rescope, scope-integrity, severity:critical]
---

# Scenario

Implementation and QA cover a smaller prototype, while the accepted milestone promises a working MVP. No accepted artifact authorizes the reduction.

Product Outcome must not reinterpret the smaller deliverable as the original target.
