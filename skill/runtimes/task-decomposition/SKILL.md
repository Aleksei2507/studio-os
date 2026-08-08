---
name: task-decomposition
description: Turn accepted Architecture, Roadmap, and Acceptance Criteria into a bounded, estimable, requirement-traced task list. Use after Architecture and before Development when the accepted scope needs more than one estimable, independently completable unit.
---

# Task Decomposition Runtime

> Runtime for turning accepted scope into small, traceable, estimable tasks without implementing them.

---

# Metadata

Stage: Task Decomposition

Version: 1.0

Optional: Yes for a bounded single-unit Work Item, No otherwise

Requires Confirmation: Yes before Development

Creates:

- `docs/tasks.md` for Greenfield or Brownfield lifecycle;
- `work-items/<id>/tasks.md` for an active Work Item.

Updates:

- `.studio/project-state.md`
- `.studio/active-context.md`

Next Stage:

Development

---

# Goal

Task Decomposition turns accepted Architecture and Acceptance Criteria into small units of work a person or tracker can estimate, assign, and check off independently.

Task Decomposition does not choose architecture.

Task Decomposition does not write code.

Task Decomposition does not change accepted scope.

Task Decomposition answers:

> What are the smallest independently completable pieces of the accepted scope, and which requirement does each one satisfy?

---

# Inputs

Read:

- active Architecture path from Project Memory;
- active Brief (`docs/project-brief.md` or `work-items/<id>/brief.md`) for numbered Acceptance Criteria (`AC<n>`);
- active Roadmap (`docs/roadmap.md` or `work-items/<id>/roadmap.md`) for numbered iterations (`IT<n>`) when Planning ran for this workflow;
- `.studio/project-state.md`;
- `.studio/active-context.md`;
- accepted Delivery Estimate when available.

If the active Brief has no numbered `AC<n>` entries (created before this Runtime existed), number them now from the existing Acceptance Criteria list in reading order and record that renumbering in the Brief reference — do not rewrite the Brief's prose, only add the ID.

---

# Traceability ID Scheme

- Acceptance Criteria: `AC<n>`, numbered in the active Brief.
- Roadmap Iterations, when present: `IT<n>`, numbered in the active Roadmap; each iteration already lists which `AC<n>` it advances.
- Tasks: `T<n>` when there is no Roadmap for this workflow (a single-unit Work Item), or `T<iteration>.<n>` when an `IT<n>` exists (e.g. `T1.1`, `T1.2` under `IT1`).
- Every task records `Satisfies: AC<n>[, AC<m>]`.
- Development Report later records `Tasks Completed: T<x>[, ...]`.
- Validation evidence later records `Acceptance Criteria Verified: AC<n>[, ...]` traced through the `T<x>` tasks that produced it.

Do not invent a new ID scheme per project. Do not retrofit IDs onto already-completed, previously accepted artifacts.

---

# Task Decomposition Mindset

Act like a technical lead preparing work for handoff, not like Development itself.

Bound each task to what it takes to independently verify it is done — not to a specific line-level implementation plan.

Protect Architecture and the active Brief. Do not accept scope not already present in accepted Acceptance Criteria.

---

# Required Decisions

Task Decomposition must determine:

- the task ceiling in hours (default 8h; use a project- or Work Item-accepted ceiling from the Standards Profile when one is recorded);
- the task list with IDs, titles, and estimates;
- the `Satisfies` mapping from every task to at least one `AC<n>`;
- dependencies between tasks;
- coverage: every `AC<n>` in the active scope is satisfied by at least one task, or is explicitly deferred with a reason.

---

# Task Rule

Each task must be:

- completable and independently verifiable without finishing unrelated tasks, except declared Dependencies;
- at or under the task ceiling; split a larger unit rather than recording an oversized task;
- traceable to at least one `AC<n>`.

A task that cannot be traced to an Acceptance Criterion is a sign of scope invented during decomposition — remove it or route the underlying need back to Briefing as a Scope Change.

---

# Coverage Rule

Before creating the artifact, verify every in-scope `AC<n>` is covered by at least one task.

For an `AC<n>` intentionally not covered in this Task Decomposition pass, record it under Deferred with a reason (future iteration, out of current Work Item bound, blocked on an Unknown) — do not silently drop it.

---

# Continue Rule

Before asking another question, ask internally:

Will this answer change the resulting task list or its coverage?

If no, do not ask.

Prepare the task list.

---

# Forbidden

Task Decomposition must not:

- choose stack, library, or architecture beyond what Architecture already accepted;
- write code;
- define line-level implementation steps;
- change accepted Acceptance Criteria, Roadmap, or Architecture;
- merge unrelated Acceptance Criteria into one task to avoid decomposition;
- invent a task with no `Satisfies` reference;
- retrofit Traceability IDs onto already-accepted, pre-existing artifacts.

---

# Output

Create the path selected by Project Memory:

```text
docs/tasks.md
or
work-items/<id>/tasks.md
```

Document structure:

- Goal
- Traceability Legend
- Task List (one block per task: ID, Title, Satisfies, Estimate, Dependencies, Definition Of Done)
- Coverage Check (`AC<n>` -> covering task IDs, or Deferred with reason)
- Deferred
- Development Handoff

Use `templates/tasks.md` as the output structure.

---

# Project Memory Update

Update `.studio/active-context.md` with:

- reference to the active `tasks.md` path;
- task count and ceiling used;
- any deferred `AC<n>` and why;
- inputs for Development.

Do not copy the full task list into Active Context.

Update `.studio/project-state.md` to show:

```md
Mode: <preserve Greenfield or Brownfield>
Workflow: <preserve selected workflow>
Work Type: <preserve selected work type>
Previous Stage: Task Decomposition
Current Stage: Development
Status: Waiting Confirmation
Next Recommended Stage: Development
```

Preserve `Target Milestone`, `Product Readiness`, `Current Increment`, `Increment Status`, and `Increment Progress`. Task Decomposition does not promote Product Readiness.

---

# Stage Handoff

Pass to Development:

- task list with IDs, estimates, and `Satisfies` mapping;
- dependencies and suggested order;
- deferred `AC<n>` and reasons;
- reference to Architecture and Delivery Estimate.

---

# Completion Checklist

Task Decomposition is complete when:

- every task is at or under the ceiling;
- every task traces to at least one `AC<n>`;
- every in-scope `AC<n>` is covered or explicitly deferred with a reason;
- `tasks.md` created;
- Project Memory updated;
- Development inputs are clear.

---

# Stop Condition

Before creating the artifact, show the task count, ceiling used, and coverage summary, then ask:

> Is there anything important to change before I create the task list?

After confirmation:

- create the active `tasks.md` path;
- update Project Memory;
- recommend Development;
- do not start Development automatically.
