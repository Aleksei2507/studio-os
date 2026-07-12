---
id: regression-007-work-item-artifact-isolation
title: active work item isolates intermediate artifacts
stage: All
prompt: Create the Brief, Roadmap, Architecture, and QA artifacts for this Feature Work Item.
expect:
  - writes intermediate artifacts under the Active Work Item directory
  - does not overwrite canonical product artifacts before accepted release
  - updates main product artifacts deliberately after release when product truth changes
tags: [regression, work-item, artifacts, project-memory]
---

# Scenario

An existing Studio OS product has accepted canonical documents under `docs/`. A bounded Feature Work Item is active.

Every selected Runtime should use Work Item-local artifact paths. Release should update only the canonical documents whose current product truth actually changed.
