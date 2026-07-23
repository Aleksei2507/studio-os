---
id: "fixture-001-brownfield-project-memory"
title: "Brownfield onboarding mutates only Project Memory artifacts"
stage: "Bootstrap and Brownfield Onboarding"
prompt: "Use Studio OS to onboard this existing product."
expect:
  - "The response should state that Brownfield Onboarding is complete and briefly summarize the product purpose, current delivery surface or stack, observed interface system, and an important risk or unknown."
  - "The response should offer to proceed to Briefing and wait for user confirmation."
  - "The response should name created artifacts with project-relative paths and must not expose an absolute or temporary workspace path."
  - "Should not: Claim that Briefing, planning, architecture, or implementation has already started."
tags: ["fixture", "brownfield", "severity:critical", "risk:high"]
fixture: "tests/fixtures/runtime/brownfield-web/input"
workspace_assertions: "tests/fixtures/runtime/brownfield-web/assertions.json"
---
## Initial State

A disposable copy of a small existing web product is mounted as the real Target
Workspace. It has meaningful source and product documentation but no `.studio/`
directory.

The Runtime must inspect the physical workspace. This scenario body is context
for the test, not a replacement for repository evidence.
