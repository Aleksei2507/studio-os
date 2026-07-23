---
id: regression-007-work-item-artifact-isolation
title: active work item isolates intermediate artifacts
stage: All
prompt: Create the Brief, Roadmap, Architecture, Interface Design, and QA artifacts for this Feature Work Item.
expect:
  - writes intermediate artifacts under the Active Work Item directory
  - keeps proposed design-system changes in the Work Item profile until successful release
  - does not overwrite canonical product artifacts before accepted release
  - updates main product artifacts deliberately after release when product truth changes
tags: [regression, work-item, artifacts, project-memory]
---

# Scenario

An existing Studio OS product has accepted canonical documents under `docs/`. A bounded Feature Work Item is active.

Every selected Runtime should use Work Item-local artifact paths. This includes `work-items/<id>/design-system-profile.md` when the accepted feature changes the interface system. Release should update only the canonical documents and profiles whose current product truth actually changed.
