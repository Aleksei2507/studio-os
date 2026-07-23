---
id: "bootstrap-001-explicit-greenfield-activation"
title: "explicit Studio OS request enters Greenfield Interview"
stage: "Bootstrap"
prompt: "Use Studio OS. Build a browser Tetris game with keyboard and touch controls."
expect:
  - "Bootstrap should hand control to Loader before product planning or implementation."
  - "Loader should detect Greenfield mode and start Interview because the product idea is already provided."
  - "Interview should show an initial understanding and ask the user to confirm or correct it."
  - "Should not: Promise to build the game, define detailed MVP scope, select a technology stack, invoke implementation skills, or write code."
tags: ["bootstrap", "loader", "greenfield", "severity:critical", "risk:high"]
---

## Metadata

Category: bootstrap
Stage: Bootstrap
Severity: Critical
Regression Risk: High

## Goal

Verify that an explicit Studio OS product request activates the portable Bootstrap before the host agent's default implementation workflow.

## Initial State

The target workspace has no `.studio/` directory and no meaningful product code. Studio OS is available through a configured adapter or an explicitly supplied Bootstrap path.

## User Message

```text
Use Studio OS. Build a browser Tetris game with keyboard and touch controls.
```

## Expected Behavior

Bootstrap should hand control to Loader. Loader should select Greenfield and start Interview immediately. Interview should summarize the product hypothesis and ask one focused confirmation or correction question.

## Should Not

Do not promise implementation, define the detailed MVP, select a stack or library, invoke frontend implementation skills, create files, or write product code before the active Runtime permits it.

## Notes

This scenario tests host activation rather than a language-specific trigger phrase. Equivalent observable requests in another Project Language should follow the same path.
