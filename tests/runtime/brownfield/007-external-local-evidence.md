---
id: brownfield-007-external-local-evidence
title: brownfield onboarding does not persist external machine paths
stage: Brownfield Onboarding
prompt: Onboard this project and use the separately supplied reference implementation as supporting evidence.
expect:
  - treats the Target Workspace as the boundary for persisted local file references
  - records project files with project-relative paths
  - does not write the sibling repository absolute root into Discovery Project Memory or profiles
  - records external evidence provenance without a machine path or requests a project-local import when reproducibility requires the source
tags: [brownfield, portability, evidence, project-memory]
---

# Scenario

The existing product project and a separately supplied reference repository are located in different local directories.

Brownfield may inspect both when authorized, but its artifacts must remain usable after the product project is moved to another machine.
