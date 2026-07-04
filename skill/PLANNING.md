# Planning Runtime

> Runtime for turning the Project Brief into a value-oriented roadmap.

---

# Metadata

Stage: Planning

Version: 1.0

Optional: No

Requires Confirmation: Yes before moving to Architecture

Creates:

- `docs/roadmap.md`

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

- `docs/project-brief.md`
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

Create a roadmap that can guide Architecture and Development.

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

Planning should propose a roadmap based on the Project Brief.

If there are real trade-offs, show options and recommend one.

Use:

- Recommendation
- Why
- Trade-offs

---

# Scope Change Rule

If the user proposes a new feature after Planning started:

1. Check whether it exists in Project Brief.
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

Will this answer change `docs/roadmap.md`?

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

Create:

```text
docs/roadmap.md
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

- reference to `docs/roadmap.md`;
- iteration list;
- key dependencies;
- architecture inputs.

Do not copy the full roadmap into Active Context.

Update `.studio/project-state.md` to show:

```md
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
- docs/discovery-summary.md
- docs/project-brief.md
- docs/roadmap.md
```

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

- create `docs/roadmap.md`;
- update Project Memory;
- recommend Architecture;
- do not start Architecture automatically.
