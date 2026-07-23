---
id: release-006-merge-design-system-profile
title: merge design system changes only after successful release
stage: Release
prompt: Complete the accepted interface Work Item release.
expect:
  - verifies the Work Item Design System Profile against implementation and QA evidence
  - keeps the canonical Project Design System Profile unchanged while release is blocked or not executed
  - merges the accepted Work Item profile only after the changed interface system is successfully released
  - preserves unrelated project design-system boundaries and evidence
tags: [release, work-item, design-system, project-memory]
---

# Scenario

An accepted Feature Work Item introduces a deliberate design-system change recorded under its Work Item directory. Development and QA passed, but canonical project memory still describes the currently released system.
