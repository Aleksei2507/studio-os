---
id: loader-007-planned-runtime-stops
title: planned runtime blocks honest workflow execution
stage: Loader
prompt: Continue to a Runtime that a workflow registry fixture marks as planned.
expect:
  - checks Architecture readiness in the workflow registry
  - reports that the planned Runtime contract is not implemented
  - does not create architecture artifacts or claim stage completion
tags: [loader, workflow, runtime-status, quality-gate]
---

# Scenario

The test fixture contains a future Runtime whose registry status is `planned`.

Studio OS should identify the blocked stage and stop. It must not infer a complete Runtime from general model knowledge or bypass the missing contract.
