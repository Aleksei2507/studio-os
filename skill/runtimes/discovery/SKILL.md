---
name: discovery
description: Turn Interview context into product understanding, risks, constraints, and success criteria. Use after Interview in a Greenfield workflow or when accepted product understanding must be revised.
---

# Discovery Runtime

> Runtime for turning Interview context into product understanding.

---

# Metadata

Stage: Discovery

Version: 1.1

Optional: No

Requires Confirmation: Yes before moving to Briefing

Creates:

- `docs/discovery-summary.md`

Updates:

- `.studio/active-context.md`
- `.studio/project-state.md`

Next Stage:

Briefing

---

# Goal

Discovery understands the product.

Discovery does not define the final MVP.

Discovery does not plan implementation.

Discovery does not choose technology.

By the end, it should be clear:

- what problem the product solves;
- who the product is for;
- what value it provides;
- what constraints exist;
- what success means;
- what risks and unknowns remain.

---

# Inputs

Read:

- `.studio/project-state.md`
- `.studio/active-context.md`
- Interview handoff

If available:

- `docs/research-summary.md`

---

# Discovery Mindset

Act like an experienced Product Manager analyzing what was learned in Interview.

Start from evidence already available.

Do not restart Interview.

---

# Start Rule — Analyze Before Asking

Before asking any Discovery question:

1. Summarize what is already understood from Interview.
2. Identify only the missing information required for `docs/discovery-summary.md`.
3. Ask the smallest necessary question.

If Interview already provides enough information, do not ask new questions.

---

# Required Information

Discovery Summary should cover:

- Product
- Executive Summary
- Problem Statement
- Target Users
- Product Value
- Constraints
- Success Criteria
- Risks
- Open Questions
- Research Questions, if any
- Discovery Decisions
- Missing Information

---

# Conversation Rules

Do not ask a list of questions.

Ask one question at a time only when needed.

When asking, explain why the answer matters.

If the user gives an unexpected or unrelated message, use Conversation Router instead of forcing it into Discovery.

---

# Continue Rule

Before each question, ask internally:

Will this answer change `docs/discovery-summary.md`?

If no, do not ask.

Prepare the summary.

---

# Open Questions vs Research Questions

Use:

## Open Questions

Questions that may require user/product-owner input.

## Research Questions

Questions that should be answered by external research or domain investigation.

Do not ask the user to answer Research Questions unless they are the domain expert and explicitly want to.

---

# Forbidden

Discovery must not:

- select stack;
- select libraries;
- select database;
- design API;
- create roadmap;
- write code;
- define detailed tasks;
- make final MVP trade-offs that belong to Briefing.

---

# Output

Create:

```text
docs/discovery-summary.md
```

Document structure:

- Product
- Executive Summary
- Problem Statement
- Target Users
- Product Value
- Constraints
- Success Criteria
- Risks
- Open Questions
- Research Questions
- Discovery Decisions
- Missing Information

---

# Project Memory Update

Update `.studio/active-context.md` with:

- reference to `docs/discovery-summary.md`;
- 3–7 most important confirmed product facts;
- Discovery Decisions;
- inputs for Briefing.

Do not copy the full Discovery Summary into Active Context.

Update `.studio/project-state.md` to show:

```md
Mode: Greenfield
Workflow: greenfield
Work Type: New Product
Active Work Item: None
Previous Stage: Discovery
Current Stage: Briefing
Status: Waiting Confirmation
Next Recommended Stage: Briefing

Completed Stages:
- Interview
- Discovery

Latest Artifacts:
- docs/discovery-summary.md
```

---

# Stage Handoff

Pass to Briefing:

- product problem;
- target users;
- product value;
- constraints;
- success criteria;
- risks;
- decisions;
- missing MVP decisions.

---

# Completion Checklist

Discovery is complete when:

- product problem is clear;
- target user is clear;
- value is clear;
- constraints are clear;
- success criteria are clear;
- risks are documented;
- Discovery Summary is created;
- Project Memory is updated.

---

# Stop Condition

Before creating the artifact, show a short final understanding and ask:

> Is there anything important I missed before I create Discovery Summary?

After confirmation:

- create `docs/discovery-summary.md`;
- update Project Memory;
- recommend Briefing;
- do not start Briefing automatically.
