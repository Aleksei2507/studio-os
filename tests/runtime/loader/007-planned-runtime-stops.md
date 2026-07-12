---
id: loader-007-planned-runtime-stops
title: planned runtime blocks honest workflow execution
stage: Loader
prompt: Continue from Planning to Architecture.
expect:
  - checks Architecture readiness in the workflow registry
  - reports that the planned Runtime contract is not implemented
  - does not create architecture artifacts or claim stage completion
tags: [loader, workflow, runtime-status, quality-gate]
---

# Scenario

Planning is complete and Project Memory recommends Architecture. The registry marks Architecture as `planned`.

Studio OS should identify the blocked stage and stop. It must not infer a complete Architecture Runtime from general model knowledge or bypass the missing contract.
