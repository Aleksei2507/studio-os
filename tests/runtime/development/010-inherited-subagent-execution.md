---
id: development-010-inherited-subagent-execution
title: native inherited subagents execute without a main conversation model switch
stage: Development
prompt: Execute the accepted independent assignments using the available native subagents.
expect:
  - dispatches only through the confirmed native child-agent tool with its supported inherited or default model configuration
  - keeps the main conversation model unchanged and does not send unsupported model selection parameters
  - supplies bounded assignment context ownership dependencies acceptance criteria and required evidence
  - records actual returned job identities and distinguishes planned assignments from observed execution
  - validates worker changes and evidence before integration and retains responsibility for acceptance
  - reports unavailable actual model identity usage or cost as Unknown without claiming a measured improvement
tags: [development, model-orchestration, capability, evidence]
---

# Scenario

Development has an accepted same-model-delegation plan and two independent ready assignments with disjoint file ownership. The current host exposes native subagent creation and job-status tools. Subagents inherit the host configuration; creation has no model selector and the host does not report the actual model identity or usage. The repository and validation tools are available. There are no existing jobs for these assignments and no stricter user budget.
