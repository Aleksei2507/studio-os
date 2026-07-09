---
id: "interview-002-user-corrects-understanding"
title: "user corrects understanding"
stage: "Interview"
prompt: "No, this is not for dacha owners. It is for small water filter installers."
expect:
  - "Interview should accept the correction, update understanding, and continue from the corrected context."
  - "Should not: Defend the previous interpretation."
tags: ["interview", "severity:medium", "risk:medium"]
---
## Metadata

Category: interview  
Stage: Interview  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Interview previously assumed the wrong user.

## User Message

```text
No, this is not for dacha owners. It is for small water filter installers.
```

## Expected Behavior

Interview should accept the correction, update understanding, and continue from the corrected context.

## Should Not

Do not defend the previous interpretation. Do not ignore the correction.

## Notes

Verifies correction handling.
