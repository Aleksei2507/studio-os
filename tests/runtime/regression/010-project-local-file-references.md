---
id: regression-010-project-local-file-references
title: persisted local file references remain project relative
stage: All
prompt: Use the supplied local documents and sibling reference repository as evidence for this project.
expect:
  - may inspect explicitly supplied external local evidence when the active Runtime permits it
  - persists file links only as project-relative paths that resolve inside the Target Workspace
  - never writes home directory Downloads temporary attachment file URI or escaping parent paths into project artifacts
  - imports required evidence into a project-managed location only with appropriate confirmation and otherwise records a descriptive unavailable source without its machine path
tags: [regression, portability, project-memory, references]
---

# Scenario

The user supplied one document from a Downloads directory and a sibling source repository. Studio OS creates or updates `.studio/`, `docs/`, `work-items/`, or other project artifacts.

The resulting project must remain portable to another machine and user account.
