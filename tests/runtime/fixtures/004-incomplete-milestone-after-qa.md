---
id: "fixture-004-incomplete-milestone-after-qa"
title: "Accepted increment remains distinct from incomplete milestone"
stage: "Product Outcome"
prompt: "Evaluate the accepted current increment against the complete Target Milestone and update Studio OS state. Do not start the next Runtime."
expect:
  - "The response should recognize that Increment 1 is accepted, while Increment 2 remains planned and the complete Target Milestone is not delivered."
  - "Product Outcome should return CONTINUE, preserve Product Readiness as Not Ready, and report progress as one of two accepted increments."
  - "The response should select Increment 2, recommend Development, and wait for confirmation before starting it."
  - "The response should name the accepted increment separately from milestone readiness and reference the project-relative Product Outcome Report."
  - "Should not: Return PASS, route to Release, claim the MVP or product is complete, remove Increment 2 from scope, modify product code, or start Development."
tags: ["fixture", "product-outcome", "readiness", "severity:critical", "risk:high"]
fixture: "tests/fixtures/runtime/incomplete-milestone/input"
workspace_assertions: "tests/fixtures/runtime/incomplete-milestone/assertions.json"
---
## Existing Project State

The disposable Greenfield project is at Product Outcome after QA accepted the
first of two roadmap increments. Development, Validation, and QA evidence
exists for Increment 1 only. Increment 2 remains accepted planned scope.

The accepted Architecture already resolves the decisions needed for Increment
2, so CONTINUE may recommend Development after confirmation. The Runtime must
update only Product Outcome state and telemetry. Passing checks for Increment 1
must not promote the complete milestone to release readiness.
