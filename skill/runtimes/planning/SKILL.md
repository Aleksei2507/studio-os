---
name: planning
description: Turn an accepted Project Brief into a value-oriented Product Roadmap or Brownfield Development Roadmap. Use when scope and acceptance criteria are confirmed and sequencing decisions are needed.
---

# Planning Runtime

> Runtime for turning the Project Brief into a value-oriented roadmap.

---

# Metadata

Stage: Planning

Version: 1.0

Optional: No

Requires Confirmation: Yes before moving to Architecture

Creates:

- `docs/roadmap.md` for Greenfield or Brownfield lifecycle;
- `work-items/<id>/roadmap.md` for an active Work Item.

Updates:

- `.studio/project-state.md`
- `.studio/active-context.md`

Next Stage:

Architecture

---

# Goal

Planning turns confirmed product decisions into valuable iterations.

Planning does not redefine the product.

Planning does not choose architecture.

Planning does not write implementation tasks in detail.

Planning answers:

> How do we split confirmed product decisions into small iterations where each iteration produces value or reduces critical uncertainty?

---

# Inputs

Read:

- active Brief path from Project Memory
- `docs/discovery-summary.md`
- `.studio/project-state.md`
- `.studio/active-context.md`

If available:

- `docs/research-summary.md`
- `docs/design-strategy.md`

---

# Planning Mindset

Act like a Product Manager and Delivery Manager.

Protect the Project Brief.

Do not accept scope changes silently.

Create a roadmap that can guide Architecture, Interface Design when selected, and Development.

---

# Brownfield Planning

Planning for Brownfield does not create a Product Roadmap.

It creates:

```text
Development Roadmap
```

The goal is to plan development of an existing product.

For Brownfield, Planning uses:

```text
Development Epics
```

instead of:

```text
Product Iterations
```

Each Development Epic must increase the value of the existing product.

Do not create a new product.

Each Development Epic must answer:

> What new value or risk reduction does the existing product get after this Epic is complete?

Each Development Epic must include:

- Goal
- Business Value
- Scope
- Output
- Acceptance Criteria
- Dependencies
- Handoff To Architecture

Do not use implementation details.

Brownfield Planning should preserve:

- Current Product Scope;
- Stable Areas;
- Legacy Areas;
- Product Boundaries;
- Technical Boundaries.

---

# Required Decisions

Planning must determine:

- MVP iterations;
- goal of each iteration;
- value or uncertainty reduction of each iteration;
- output of each iteration;
- acceptance criteria for each iteration;
- dependencies between iterations;
- what is intentionally deferred.

---

# Iteration Rule

Each iteration must produce one of:

- user-visible value;
- a working product increment;
- a required product foundation without which the MVP cannot work;
- a validated decision that reduces major uncertainty.

Avoid iterations that only say "describe", "think", or "document" unless the document is necessary to unlock implementation.

---

# Value Rule

For each iteration, explicitly state:

```md
## Value

What becomes possible after this iteration?
What can be shown, tested, or decided?
```

Planning should not create busywork.

---

# Recommendation Rule

Planning should not ask:

> What roadmap do you want?

Planning should propose a roadmap based on the active Brief.

If there are real trade-offs, show options and recommend one.

Use:

- Recommendation
- Why
- Trade-offs

---

# Scope Change Rule

If the user proposes a new feature after Planning started:

1. Check whether it exists in the active Brief.
2. If not, treat it as a scope change.
3. Ask what problem it solves.
4. Recommend one of:
   - return to Briefing;
   - create a Work Item;
   - defer to future roadmap;
   - reject for MVP.

Do not silently add scope to the roadmap.

---

# Continue Rule

Before asking another question, ask internally:

Will this answer change the active Roadmap artifact?

If no, do not ask.

Prepare the roadmap.

---

# Forbidden

Planning must not:

- choose stack;
- design system architecture;
- choose database;
- write code;
- define low-level implementation details;
- change MVP scope without returning to Briefing or explicit user confirmation.

---

# Output

Create the path selected by Project Memory:

```text
docs/roadmap.md
or
work-items/<id>/roadmap.md
```

Document structure:

- Goal
- Roadmap Principles
- Iterations
- Dependencies
- Deferred Items
- Risks
- Handoff To Architecture

Each iteration should include:

- Goal
- Value
- Scope
- Output
- Acceptance Criteria
- Dependencies

---

# Project Memory Update

Update `.studio/active-context.md` with:

- reference to the active Roadmap path;
- iteration list;
- key dependencies;
- architecture inputs.

Do not copy the full roadmap into Active Context.

Update `.studio/project-state.md` to show:

```md
Mode: <preserve Greenfield or Brownfield>
Workflow: <preserve selected workflow>
Work Type: <preserve selected work type>
Target Milestone: <preserve accepted target>
Product Readiness: Not Ready
Current Increment: <first accepted roadmap increment>
Increment Status: Planned
Increment Progress: 0/<accepted roadmap increment count>
Previous Stage: Planning
Current Stage: Architecture
Status: Waiting Confirmation
Next Recommended Stage: Architecture

Completed Stages:
- Interview
- Discovery
- Briefing
- Planning

Latest Artifacts:
- <accepted product artifacts>
- <active roadmap path>
```

Do not overwrite the canonical Roadmap during an intermediate Work Item stage.

Planning defines delivery units but does not mark the Target Milestone ready. For an updated roadmap, preserve accepted increment evidence and recalculate progress without counting planned work as accepted.

---

# Stage Handoff

Pass to Architecture:

- MVP iterations;
- required capabilities;
- domain model inputs;
- constraints from Project Brief;
- items intentionally deferred;
- technical questions that Architecture must answer.

---

# Completion Checklist

Planning is complete when:

- roadmap created;
- every iteration has value;
- acceptance criteria exist for every iteration;
- scope changes are not silently added;
- Project Memory updated;
- Architecture inputs are clear.

---

# Stop Condition

Before creating the artifact, show a short roadmap summary and ask:

> Is there anything important to change before I create Roadmap?

After confirmation:

- create the active Roadmap path;
- update Project Memory;
- recommend Architecture;
- do not start Architecture automatically.
