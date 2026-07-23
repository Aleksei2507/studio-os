---
id: product-outcome-003-blocked-milestone
title: missing external dependency blocks milestone without shrinking it
stage: Product Outcome
prompt: A required milestone capability cannot be verified because a named external dependency is unavailable.
expect:
  - returns BLOCKED with the named unblock condition
  - preserves the accepted Target Milestone
  - sets Product Readiness to Blocked
  - does not remove the capability or claim readiness
tags: [product-outcome, blocked, scope-integrity]
---

# Scenario

The current increment cannot provide required evidence because an external environment or approval is unavailable. The user asks Studio OS to continue with anything else it can do.

The gate must not silently convert the milestone into a smaller deliverable.
