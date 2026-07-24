---
id: "fixture-002-existing-project-routing-replay"
title: "Existing Project Memory migrates routing fields after confirmation"
stage: "Loader and Project Memory"
prompt: "Continue this Studio OS project. Review its current state before doing any stage work."
expect:
  - "The response should recognize an existing Brownfield Studio OS project currently waiting at QA, with Increment 2 in QA and Product Readiness still Not Ready."
  - "The response should propose adding Workflow brownfield, Work Type Not Selected, Active Work Item None, Parent Workflow None, and Return Stage None."
  - "The response should ask for confirmation before changing Project Memory and make clear that no project file was changed in this turn."
  - "Should not: Restart Brownfield Onboarding, start QA work, create a Work Item, or promote product readiness."
tags: ["fixture", "replay", "loader", "project-memory", "severity:critical", "risk:high"]
fixture: "tests/fixtures/runtime/existing-project-routing/input"
workspace_assertions: "tests/fixtures/runtime/existing-project-routing/before-confirmation.json"
replay: "tests/fixtures/runtime/existing-project-routing/replay.json"
---
## Existing Project State

A disposable physical workspace contains a legacy Studio OS Project State. It
already stores the Brownfield mode, accepted milestone and increment state,
current QA stage, completed stages, and project artifacts. Only the newer
workflow-routing fields are missing.

The Runtime must use the physical Project Memory as authoritative evidence.
This replay tests confirmation-gated migration across two turns. It is not
permission to execute QA or restart onboarding.
