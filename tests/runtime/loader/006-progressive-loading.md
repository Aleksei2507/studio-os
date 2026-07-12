---
id: loader-006-progressive-loading
title: progressive loading selects only relevant runtime context
stage: Loader
prompt: Continue the current Studio OS project.
expect:
  - loads core invariants, Project Memory, the selected workflow, and the active Runtime
  - does not load every workflow or Runtime at startup
  - treats public documentation as human-facing context rather than mandatory runtime input
tags: [loader, progressive-disclosure, context]
---

# Scenario

An existing Studio OS project has `Workflow: work-item-bugfix` and `Current Stage: Validation` in Project Memory.

The Loader should read the core contracts, stored Project Memory, the Bugfix workflow, and the Validation Runtime. It should not preload Greenfield, Brownfield, Interview, Briefing, Planning, or unrelated Runtime references.
