---
id: loader-008-legacy-project-memory
title: legacy project memory migrates without onboarding restart
stage: Loader
prompt: Continue this Studio OS project after updating Studio OS.
expect:
  - preserves stored Greenfield or Brownfield mode, language, artifacts, and current stage
  - proposes workflow, work type, and active work item fields using existing evidence
  - requests confirmation before writing the non-obvious memory migration
  - does not restart Interview or Brownfield Onboarding
tags: [loader, migration, project-memory, regression]
---

# Scenario

The project was created before workflow composition. Its Project State contains Mode, Project Language, completed stages, artifacts, and Current Stage, but no Workflow, Work Type, or Active Work Item fields.

Loader should migrate routing state without treating the project as new or discarding its accepted lifecycle position.
