# Orchestration Plan

## Scope And Acceptance Criteria

Active delivery unit and accepted Brief/Architecture/task references:

## Host Evidence

- Host and observation time/session:
- Coordinator model identity and source (or Unknown):
- Native subagent tools and permission boundaries:
- Per-subagent model selection support and permitted IDs (or Unavailable/Unknown):
- Candidate tools, context limits, isolation, and capability evidence:
- Pricing/usage evidence and source (or Unknown):
- Host concurrency and enforceable budget controls:

## Execution Mode And Rationale

Mode: single-model | same-model-delegation | multi-model

Why this mode fits difficulty, risk, independence, context-transfer cost, review, and integration:

Coordinator remains responsible; model choices below apply to subagents.

## Assignments

For each work group or task, when delegation is justified:

- Task ID / acceptance criteria:
- Outcome, non-goals, and dependencies:
- Owner / writable files and shared interfaces:
- Requested permitted subagent model or host-default:
- Suitability and cost evidence; known uncertainty:
- Bounded context packet and tool/data limits:
- Required result and coordinator acceptance checks:
- Retry/fallback and stop condition:

For single-model work, state the coordinator's scope and checks without invented workers.

## Budget And Execution Limits

- User constraints and enforcement mechanism:
- Maximum concurrent subagents (default 2, within host slots):
- Maximum attempts per task across all executors (default 2):
- Maximum delegation depth (default 1):
- Token/cost/time limits; distinguish enforceable limits, estimates, and Unknown:
- Escalation that needs a new user decision:

## Recovery And Resume

Environment recheck, unfinished-job reconciliation, overlapping writers, unavailable models, and exhausted-attempt behavior:

## Execution Ledger

| Task | Agent/job ID | Requested model | Observed model / source | State | Attempts | Evidence / next action |
| --- | --- | --- | --- | --- | --- | --- |

States: planned, running, returned, accepted, failed, blocked.

## Measurements And Limitations

Actual reported usage versus estimates; include review/retries when known. Unknown telemetry or missing comparable baseline means no numerical savings claim.
