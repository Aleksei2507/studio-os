---
id: work-item-006-portable-evidence-references
title: work item intake does not persist supplied machine paths
stage: Work Item Intake
prompt: Create a Feature Work Item from these supplied local documents.
expect:
  - records project artifacts with paths relative to the Target Workspace
  - does not copy a Downloads attachment or sibling repository path into request.md or Active Context
  - identifies required external evidence by descriptive provenance without a local link until import is approved
  - keeps the selected workflow and product scope independent from evidence storage location
tags: [work-item, portability, evidence, project-memory]
---

# Scenario

The Feature request includes a document from a local Downloads directory and examples from a sibling repository outside the Target Workspace.

Work Item Intake must preserve the request without making another user's filesystem part of project state.
