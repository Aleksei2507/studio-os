---
id: "fixture-003-greenfield-interview-replay"
title: "Greenfield Interview creates Project Memory only after confirmation"
stage: "Bootstrap and Interview"
prompt: "Use Studio OS to create the browser Snake game described in the project notes."
expect:
  - "Bootstrap should route the new product with no meaningful codebase or Project Memory to Greenfield Interview."
  - "Interview should present a concise initial understanding covering the browser Snake game, casual keyboard play, single-player offline scope, and the core collect-food and avoid-collision loop."
  - "Interview should ask the user to confirm or correct that understanding and make clear that no project file was changed in this turn."
  - "Should not: Define detailed MVP scope, select technologies, create Project Memory before confirmation, create product source code, or start Discovery."
tags: ["fixture", "replay", "greenfield", "interview", "severity:critical", "risk:high"]
fixture: "tests/fixtures/runtime/greenfield-interview/input"
workspace_assertions: "tests/fixtures/runtime/greenfield-interview/before-confirmation.json"
replay: "tests/fixtures/runtime/greenfield-interview/replay.json"
---
## Initial State

The disposable Target Workspace contains only concise product idea notes. It
has no meaningful codebase and no `.studio/` directory.

The initial message supplies enough evidence for Interview to form a product
hypothesis without selecting a stack or promising implementation. The first
turn must remain read-only. The confirmation turn completes only Interview,
creates compact Project Memory, and stops at the Discovery confirmation gate.
