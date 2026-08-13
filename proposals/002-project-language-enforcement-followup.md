# Proposal 002: confirm the Project Language check in INVARIANTS.md actually works

Classification: **Runtime**

## Problem

The rule "write artifacts in Project Language" already existed in `skill/core/PROJECT_MEMORY.md`, but was violated twice in a row within one Work Item before an explicit checklist line was added to `skill/core/INVARIANTS.md` (`## Completion`). It is unknown whether the new line actually prevents recurrence, or whether the violation simply had no chance to recur in the remaining time of this cycle.

## Evidence

From `.studio/runtime-retrospective.md` (Objective Observations, Repeated Issues): two Project Language violations within the `admin-panel-task-tracing` Work Item (`docs/adr/*`, `.studio/active-context.md`, `.studio/project-state.md`), both caught by the user, not automation. After the second, a line was added to `INVARIANTS.md`. No further violations were observed in the session after that, but the sample is small (one retrospective, a short period after the fix).

## Affected Runtime Or Docs

`skill/core/INVARIANTS.md` (already changed), `skill/core/PROJECT_MEMORY.md`.

## Proposed Change

Do not change anything now. Explicitly record this as a check for the next Retrospective: did the Project Language violation recur after the `INVARIANTS.md` check was added? If yes — escalate to a Core proposal (a prose rule turned out to be insufficient, a stronger mechanism is needed). If no — consider the fix confirmed.

## Expected Effect

No change now; the decision is deferred until a second data point exists.

## Risk Of Change

Zero — the proposal is to change nothing right now.

## Recommendation

Do not treat as a finished solution. Worth keeping in view at the next Retrospective, nothing more.
