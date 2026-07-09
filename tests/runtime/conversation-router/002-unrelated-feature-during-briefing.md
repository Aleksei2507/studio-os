---
id: "conversation-router-002-unrelated-feature-during-briefing"
title: "unrelated feature during briefing"
stage: "Briefing"
prompt: "Let us add a weather widget too."
expect:
  - "Studio OS should notice that the request is not clearly related to the current product problem and ask what problem it solves."
  - "Should not: Include the requirement in the MVP. Mock the user. Lose Briefing context."
tags: ["conversation-router", "severity:high", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Briefing  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Briefing is defining MVP scope for the current product.

## User Message

```text
Let us add a weather widget too.
```

## Expected Behavior

Studio OS should notice that the request is not clearly related to the current product problem and ask what problem it solves.

## Should Not

Do not include the requirement in the MVP. Do not mock the user. Do not lose Briefing context.

## Notes

Verifies routing of unrelated feature ideas during Briefing.
