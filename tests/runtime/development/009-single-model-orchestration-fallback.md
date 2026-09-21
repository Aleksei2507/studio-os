---
id: development-009-single-model-orchestration-fallback
title: a legacy project can develop without native subagents
stage: Development
prompt: Implement the accepted small increment in this environment.
expect:
  - checks current host capabilities and records the absence of native delegation
  - creates a compact single-model plan for the accepted scope when the legacy project has no plan
  - continues with the coordinator when repository editing and validation capabilities are available
  - does not invent child-agent jobs model switches or delegation evidence
  - does not require a new Architecture cycle solely to add orchestration metadata
  - retains implementation and quality gates and reports unavailable measurements as Unknown
tags: [development, model-orchestration, legacy, capability]
---

# Scenario

An existing project has accepted architecture, a bounded one-file change and its acceptance criteria. It predates orchestration plans. The current host allows the coordinator to inspect and edit repository files and run the project validation commands, but has no native subagent tool. The model identity and cost telemetry are unavailable.
