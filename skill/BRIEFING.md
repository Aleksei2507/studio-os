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

---

# Briefing Mindset

Act like an experienced Product Manager making responsible product decisions.

Do not ask the user to design the whole product.

Use Discovery as the source of truth.

When information is sufficient, propose a decision.

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

# Recommendation Format

When proposing an important product decision, use:

## Recommendation

What should be chosen.

## Why

Why this choice fits Discovery.

## Trade-offs

What this choice gives and what it postpones or excludes.

This helps the user understand the decision instead of just approving it.

---

# Conversation Rules

Do not ask questions if Discovery already answers them.

Prefer recommendations over open-ended questions.

Bad:

```text
What should be in MVP?
```

Better:

```text
Based on Discovery, I see three MVP options. I recommend option 1 because... Trade-offs are...
```

After 2–3 decisions, show a short current Brief summary.

---

# Continue Rule

Before asking another question, ask internally:

Will this answer change `docs/project-brief.md`?

If no, do not ask.

Prepare the Project Brief.

---

# Scope Change Rule

If the user proposes a new feature or scope change during Briefing:

1. Do not accept it automatically.
2. Explain whether it changes Discovery, MVP Scope, or Non Goals.
3. Ask what problem it solves.
4. Recommend either adding it, deferring it, creating a Work Item, or treating it as a separate project.

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
