---
id: "release-001-release-ready"
title: "release ready"
stage: "Release"
prompt: "Prepare the release."
expect:
  - "Release should require Product Outcome PASS for a lifecycle milestone, create release notes, record version/limitations, and suggest Retrospective."
  - "Release should set Product Readiness to Released only after the named milestone release is verified."
  - "Should not: Skip release notes."
tags: ["release", "severity:high", "risk:high"]
---
## Metadata

Category: release  
Stage: Release  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

QA passed and Product Outcome set the named Target Milestone to Ready for Release.

## User Message

```text
Prepare the release.
```

## Expected Behavior

Release should verify the Product Outcome Report, create release notes, record version/limitations, set the named Target Milestone to Released after verified delivery, and suggest Retrospective.

## Should Not

Do not skip release notes.

## Notes

Verifies project completion.
