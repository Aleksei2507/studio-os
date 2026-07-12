---
name: briefing
description: Turn accepted product understanding into product decisions, scope, scenarios, and acceptance criteria. Use after Discovery or for a Feature Work Item when product scope or expected behavior is not already clear.
---

# Briefing Runtime

> Runtime for turning Discovery into product decisions and MVP requirements.

---

# Metadata

Stage: Briefing

Version: 1.1

Optional: No

Requires Confirmation: Yes before moving to Planning

Creates:

- `docs/project-brief.md`

Updates:

- `.studio/project-state.md`
- `.studio/active-context.md`

Next Stage:

Planning

---

# Goal

Briefing turns Discovery into product decisions.

Briefing does not repeat Discovery.

Briefing does not plan implementation.

Briefing does not choose architecture or stack.

The result is a Project Brief that can guide Planning.

---

# Inputs

Read:

- `docs/discovery-summary.md`
- `.studio/project-state.md`
- `.studio/active-context.md`

If available:

- `docs/research-summary.md`
- `docs/design-strategy.md`

## Conditional References

Read `references/patterns.md` when proposing an important product decision or handling a scope change.

Read `references/anti-patterns.md` when the conversation drifts into implementation or when an open-ended question would make the user design the product.

---

# Briefing Mindset

Act like an experienced Product Manager making responsible product decisions.

Do not ask the user to design the whole product.

Use Discovery as the source of truth.

When information is sufficient, propose a decision.

---

# Brownfield Briefing

Greenfield Briefing:

```text
defines MVP.
```

Brownfield Briefing:

```text
documents the existing product.
```

It must fix:

- Current Product Scope;
- Stable Areas;
- Legacy Areas;
- Product Boundaries;
- Technical Boundaries;
- Product Decisions.

Brownfield Briefing must not invent the product again.

Use `Current Product Scope` instead of `MVP Scope` when the project is already a working product.

Do not change Greenfield behavior.

Acceptance Criteria for Brownfield should describe user value, not internal implementation details.

Good:

- user receives a notification.

Bad:

- worker starts;

---

# Required Decisions

Briefing must decide:

- MVP Scope
- Non Goals
- Primary User Scenarios
- Constraints
- Acceptance Criteria
- Product Decisions
- Assumptions
- Open Questions for Planning/Research

---

# Conversation Rules

Do not ask questions if Discovery already answers them.

Prefer recommendations over open-ended questions.

For an important decision, state the recommendation, why it fits Discovery, and its trade-offs.

After 2–3 decisions, show a short current Brief summary.

---

# Continue Rule

Before asking another question, ask internally:

Will this answer change `docs/project-brief.md`?

If no, do not ask.

Prepare the Project Brief.

---

# Scope Change Rule

Do not accept a new feature or scope change automatically.

Explain which accepted artifact it affects, ask what problem it solves, and recommend adding, deferring, routing to a Work Item, or treating it as a separate project.

---

# Forbidden

Briefing must not:

- choose stack;
- choose libraries;
- design architecture;
- discuss database choices;
- write code;
- break work into implementation tasks;
- create the roadmap.

If the conversation moves to implementation, explain that it belongs to Planning or Architecture.

---

# Output

Create:

```text
docs/project-brief.md
```

Document structure:

- Executive Summary
- Product Vision
- Problem Statement
- Target Users
- Product Value
- MVP Scope
- Non Goals
- User Scenarios
- Constraints
- Acceptance Criteria
- Risks
- Assumptions
- Open Questions
- Product Decisions

---

# Project Memory Update

Update `.studio/active-context.md` with:

- reference to `docs/project-brief.md`;
- confirmed MVP scope;
- key Non Goals;
- Product Decisions;
- inputs for Planning.

Do not copy the full Project Brief into Active Context.

Update `.studio/project-state.md` to show:

```md
Mode: <preserve Greenfield or Brownfield>
Workflow: <preserve selected workflow>
Work Type: <preserve selected work type>
Previous Stage: Briefing
Current Stage: Planning
Status: Waiting Confirmation
Next Recommended Stage: Planning

Completed Stages:
- Interview
- Discovery
- Briefing

Latest Artifacts:
- docs/discovery-summary.md
- docs/project-brief.md
```

---

# Stage Handoff

Pass to Planning:

- confirmed MVP scope;
- Non Goals;
- User Scenarios;
- Acceptance Criteria;
- Product Decisions;
- open Planning inputs.

---

# Completion Checklist

Briefing is complete when:

- MVP Scope is defined;
- Non Goals are defined;
- User Scenarios are defined;
- Acceptance Criteria are defined;
- Product Decisions are recorded;
- Project Brief is created;
- Project Memory is updated.

---

# Stop Condition

Before creating the artifact, show a brief Project Brief summary and ask:

> Is there anything important to change before I create Project Brief?

After confirmation:

- create `docs/project-brief.md`;
- update Project Memory;
- recommend Planning;
- do not start Planning automatically.
