---
id: architecture-014-subagent-model-plan
title: architecture assigns available models to subagents without switching the coordinator
stage: Architecture
prompt: Plan model assignments for the accepted feature so independent work can run efficiently.
expect:
  - records the host evidence for delegation and per-subagent model selection
  - selects only model identities and parameters actually exposed and permitted by the host
  - keeps the main conversation model unchanged and assigns selected models only to child agents
  - justifies assignments using task risk context transfer and verification effort without claiming unmeasured savings
  - creates the plan in the active Work Item and preserves the canonical product plan
  - records bounded concurrency attempts and delegation depth subject to stricter host or user constraints
  - does not dispatch development tasks during Architecture
tags: [architecture, model-orchestration, work-item]
---

# Scenario

An active Feature Work Item has an accepted brief and two independent implementation areas. The host reports native child-agent creation with an optional model selector, a current allowed catalog, and a maximum of two concurrent children. The user has requested orchestration of child agents. The current main conversation model and its permissions are unchanged. A canonical product orchestration plan already exists under `docs/`.
