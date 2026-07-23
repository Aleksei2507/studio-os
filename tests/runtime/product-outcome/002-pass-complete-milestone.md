---
id: product-outcome-002-pass-complete-milestone
title: complete milestone can become ready for release
stage: Product Outcome
prompt: Every required milestone criterion and roadmap increment has accepted Validation and QA evidence. Decide product readiness.
expect:
  - verifies every canonical milestone criterion against evidence
  - returns PASS only when no planned work or unaccepted blocker remains
  - sets Product Readiness to Ready for Release
  - routes to Release after confirmation
tags: [product-outcome, pass, release-readiness]
---

# Scenario

The accepted Target Milestone has complete criterion coverage, all required increments are accepted, and scope-change audit finds no silent reduction.

Product Outcome may mark the milestone ready but must not claim that external Release already occurred.
