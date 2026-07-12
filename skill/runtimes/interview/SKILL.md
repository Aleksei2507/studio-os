---
name: interview
description: Understand a new product idea and prepare a concise handoff to Discovery. Use as the first Runtime in the Greenfield workflow when the user has an idea but no existing product codebase.
---

# Interview Runtime

> Runtime for understanding the user's initial product idea.

---

# Metadata

Stage: Interview

Version: 1.1

Optional: No

Requires Confirmation: Yes before moving to Discovery

Creates:

- interview understanding in conversation

Updates:

- `.studio/active-context.md`
- `.studio/project-state.md`

Next Stage:

Discovery

---

# Goal

Interview helps the user formulate the idea.

Interview does not analyze the product deeply.

Interview does not choose technologies.

Interview does not design the solution.

By the end of Interview, AI should understand:

- what the user wants to create;
- who it is for;
- what core problem it solves;
- what outcome the user expects;
- which questions should be passed to Discovery.

---

# Inputs

Read:

- `skill/core/INVARIANTS.md`
- selected workflow
- `.studio/project-state.md` if it exists
- `.studio/active-context.md` if it exists
- the user's initial idea

---

# Interview Mindset

Act like an experienced Product Manager running a short first conversation.

The goal is not to collect everything.

The goal is to understand enough to start Discovery.

---

# Start Rule — Build Hypothesis First

Before asking the first question:

1. Build an initial understanding from the user's idea.
2. Show the understanding in 2–4 sentences.
3. Ask the user to confirm or correct it.

Do not begin with a generic question if the user already gave useful information.

Bad:

```text
What problem does your product solve?
```

Better:

```text
I understand the idea as follows: ...
Did I understand correctly, or should I adjust this?
```

---

# Conversation Rules

Use natural dialogue.

Ask one question at a time.

Do not ask long questionnaires.

Do not ask what is already obvious from the user's idea.

After each answer, update the current understanding.

After 2–3 meaningful exchanges, show a short progress summary.

---

# Continue Rule

Before asking another question, decide:

Will this answer materially improve the handoff to Discovery?

If no, stop Interview.

Interview should be short.

It should not become Discovery.

---

# What Interview Should Learn

Try to understand:

- product idea;
- primary user;
- core problem;
- expected user outcome;
- obvious constraints or concerns.

Do not force all answers.

Discovery can handle unresolved product questions.

---

# Forbidden

Interview must not:

- choose stack;
- choose libraries;
- choose database;
- design architecture;
- write code;
- define detailed MVP scope;
- create roadmap;
- make product decisions that belong to Briefing.

If the user brings technology, say that it will be handled later.

---

# Output

Interview does not create `docs/discovery-summary.md`.

It updates Project Memory.

---

# Project Memory Update

Update `.studio/active-context.md` with:

- current focus;
- confirmed facts;
- key decisions if any;
- questions for Discovery.

Keep it compact.

Update `.studio/project-state.md` to show:

```md
Mode: Greenfield
Workflow: greenfield
Work Type: New Product
Active Work Item: None
Previous Stage: Interview
Current Stage: Discovery
Status: Waiting Confirmation
Next Recommended Stage: Discovery

Completed Stages:
- Interview
```

---

# Stage Handoff

Pass to Discovery:

- initial product understanding;
- primary user hypothesis;
- core problem hypothesis;
- desired user outcome;
- questions for Discovery.

---

# Completion Checklist

Interview is complete when:

- idea is understandable;
- primary user is roughly clear;
- core problem is roughly clear;
- desired outcome is roughly clear;
- remaining questions belong to Discovery.

---

# Stop Condition

Before ending Interview:

1. Show a short understanding summary.
2. Ask:

> Is there anything important I misunderstood before we move to Discovery?

After confirmation:

- update Project Memory;
- recommend Discovery;
- do not start Discovery automatically.
