---
id: regression-011-legacy-absolute-path-migration
title: legacy absolute paths migrate without restarting the project
stage: Loader
prompt: Continue this existing Studio OS project.
expect:
  - preserves the existing mode workflow stage language and accepted decisions
  - rewrites an absolute path to a project file as its project-relative path when equivalence is certain
  - does not silently copy or claim availability for evidence outside the Target Workspace
  - requests one focused import decision only when unavailable external evidence is required for the active work
  - does not restart Interview or Brownfield Onboarding
tags: [regression, legacy, portability, migration]
---

# Scenario

Existing Project Memory and accepted artifacts contain paths from another machine, including a home directory and a Downloads folder.

Studio OS must repair only the relevant loaded references without discarding valid project state.
