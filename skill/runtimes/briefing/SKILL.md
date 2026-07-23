---
name: briefing
description: Turn accepted product understanding into product decisions, scope, scenarios, and acceptance criteria. Use after Discovery or for a Feature Work Item when product scope or expected behavior is not already clear.
---

# Briefing Runtime

> Runtime for turning Discovery into product decisions and MVP requirements.

---

# Metadata

Stage: Briefing

Version: 1.2

Optional: No

Requires Confirmation: Yes before moving to Planning

Creates:

- `docs/project-brief.md` for Greenfield or Brownfield lifecycle;
- `work-items/<id>/brief.md` for an active Work Item.

Updates:

- `.studio/project-state.md`
- `.studio/active-context.md`

Next Stage:

Planning, Research, Discovery, or user decision according to Studio Assessment

---

# Goal

Briefing turns Discovery into product decisions.

Briefing does not repeat Discovery.

Briefing does not plan implementation.

Briefing does not choose architecture or stack.

The result is a Project Brief with a Studio Assessment that can guide Planning or recommend revision before implementation.

---

# Inputs

Read:

- `docs/discovery-summary.md`
- `.studio/project-state.md`
- `.studio/active-context.md`
- active Work Item request and accepted canonical Project Brief when a Work Item is active

If available:

- `docs/research-summary.md`
- `docs/design-strategy.md`

## Conditional References

Read `references/patterns.md` when proposing an important product decision or handling a scope change.

Read `references/anti-patterns.md` when the conversation drifts into implementation or when an open-ended question would make the user design the product.

Read `references/studio-assessment.md` before issuing Go, Revise, More Research, or No-Go.

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

For Brownfield, assess the proposed development direction or readiness for further planning. Do not issue No-Go on the existence of an already operating product unless the user explicitly requests a product viability review.

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

- Studio Assessment outcome
- Assessment Evidence and Confidence
- Product Positioning or Current Product Direction
- MVP Scope when outcome is Go or Revise
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

If evidence is insufficient for a responsible scope decision, recommend More Research instead of forcing an MVP.

After 2–3 decisions, show a short current Brief summary.

---

# Continue Rule

Before asking another question, ask internally:

Will this answer change the active Brief artifact?

If no, do not ask.

Prepare the Project Brief.

## Assessment Routing

- Go -> recommend Planning.
- Revise -> remain in Briefing, or return to Discovery when the problem or target user changes.
- More Research -> define exact Research Questions and recommend Research.
- No-Go -> do not recommend Planning; wait for the user to stop, revise, or explore another direction.

Do not treat completion of a Project Brief as automatic approval to build.

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

Create the path selected by Project Memory:

```text
docs/project-brief.md
or
work-items/<id>/brief.md
```

Document structure:

- Executive Summary
- Studio Assessment
- Assessment Evidence
- Recommendation and Confidence
- Product Vision
- Product Positioning or Current Product Direction
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

Use `templates/project-brief.md` as the output structure.

---

# Project Memory Update

Update `.studio/active-context.md` with:

- reference to the active Brief path;
- Studio Assessment outcome and confidence;
- confirmed MVP scope;
- key Non Goals;
- Product Decisions;
- inputs for Planning.

Do not copy the full Project Brief into Active Context.

For a Go outcome, update `.studio/project-state.md` to show:

```md
Mode: <preserve Greenfield or Brownfield>
Workflow: <preserve selected workflow>
Work Type: <preserve selected work type>
Target Milestone: <accepted MVP, first release, or Work Item outcome>
Product Readiness: Not Ready
Current Increment: None
Increment Status: None
Increment Progress: 0/Unknown
Previous Stage: Briefing
Current Stage: Planning
Status: Waiting Confirmation
Next Recommended Stage: Planning

Completed Stages:
- Interview
- Discovery
- Briefing

Latest Artifacts:
- <active discovery or research artifact>
- <active brief path>
```

Do not overwrite the canonical Project Brief during an intermediate Work Item stage.

For Revise, More Research, or No-Go, store the assessment outcome and set Current Stage according to Assessment Routing instead of forcing Planning.

---

# Stage Handoff

For Go, pass to Planning:

- Studio Assessment outcome;
- evidence and confidence;
- confirmed MVP scope;
- Non Goals;
- User Scenarios;
- Acceptance Criteria;
- Product Decisions;
- open Planning inputs.

For Revise, More Research, or No-Go, hand off only to the stage selected by Assessment Routing.

---

# Completion Checklist

Briefing is complete when:

- Studio Assessment outcome is explicit;
- evidence and confidence are recorded;
- MVP Scope is defined when outcome is Go or Revise;
- Non Goals are defined;
- User Scenarios are defined;
- Acceptance Criteria are defined;
- Product Decisions are recorded;
- Project Brief is created;
- Project Memory is updated.

---

# Stop Condition

Before creating the artifact, show the Studio Assessment and a brief Project Brief summary, then ask:

> Is there anything important to change before I create Project Brief?

After confirmation:

- create the active Brief path;
- update Project Memory;
- recommend the stage selected by Assessment Routing;
- do not start another stage automatically.
