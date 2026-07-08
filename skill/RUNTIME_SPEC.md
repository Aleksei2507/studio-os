# Studio OS Runtime Specification

> Runtime Specification defines a shared structure and behavior contract for all Studio OS Runtime files.

---

# Required Runtime Structure

Every Runtime file should contain these sections.

---

# 1. Metadata

Service information:

- Stage
- Version
- Optional
- Requires Confirmation
- Creates
- Updates
- Next Stage

---

# 2. Goal

What this stage must achieve.

Goal describes the stage result, not implementation details.

---

# 3. Inputs

Which documents must be read before starting the stage.

Examples:

- `.studio/project-state.md`
- `.studio/active-context.md`
- `docs/discovery-summary.md`
- `docs/project-brief.md`
- `docs/roadmap.md`

---

# Interaction Layer

Before running any Runtime, read `skill/INTERACTION.md`.

Every Runtime must adapt its communication style using the Interaction Layer.

Interaction Layer is language-agnostic.

It uses observable behavior, not fixed phrases.

---

# Localization Contract

Every Studio OS Runtime must preserve the project working language.

Before creating or updating any project file, determine the project language in this order:

1. Use `Project Language` from `.studio/project-state.md` if it exists.
2. Otherwise use the language of the user's initial project request.
3. If the language is unclear, ask one short clarification question.

Unless the user explicitly requests otherwise:

- all conversation should use the user's working language;
- all files inside `docs/` must use the project language;
- all files inside `.studio/` must use the project language;
- all stage artifacts, project memory, roadmaps, retrospectives, and summaries must use the project language;
- do not mix languages inside one project.

If an existing project already has a stored `Project Language`, continue using it even if a later user message is written in another language.

Changing the project language requires explicit user confirmation.

# 4. Stage Mindset

How the AI should think during this stage.

Examples:

- Interview collects understanding.
- Discovery analyzes product meaning.
- Briefing turns discovery into decisions.
- Planning turns confirmed decisions into valuable iterations.

---

# 5. Required Information / Decisions

What must be known or decided before the stage can finish.

If information is missing, ask the smallest useful question.

---

# 6. Conversation Rules

How the AI interacts with the user.

Global rule:

> Every question must change the next artifact.

If a question will not change the next artifact, do not ask it.

---

# 7. Continue Rule

Before asking another question, AI must check:

- Do I already have enough information?
- Will the answer change the required artifact?
- Is this question part of the current stage, or does it belong to a later stage?

If enough information exists, stop asking questions and prepare the artifact.

---

# 8. Forbidden

What this stage must not do.

Examples:

- Interview must not choose technologies.
- Discovery must not plan implementation.
- Briefing must not write roadmap iterations.
- Planning must not choose architecture.

---

# 9. Output

Which artifact the stage creates.

Examples:

- `docs/discovery-summary.md`
- `docs/project-brief.md`
- `docs/roadmap.md`

---

# 10. Project Memory Update

How to update:

- `.studio/active-context.md`
- `.studio/project-state.md`

Do not duplicate completed artifacts in active context.

Store concise decisions and references.

---

# 11. Stage Handoff

Every stage must explicitly hand off context to the next stage.

Handoff should include:

- confirmed decisions;
- unresolved questions;
- next stage inputs;
- constraints that must be preserved;
- confidence level when useful.

---

# 12. Stop Condition

When AI must stop.

Typical stop condition:

1. Required artifact created.
2. Project Memory updated.
3. Next stage recommended.
4. AI waits for user confirmation.

Do not start the next stage automatically.

---

# 13. Completion Checklist

Short checklist for the stage.

Example:

- artifact created;
- key decisions recorded;
- Project Memory updated;
- next stage identified;
- user confirmation requested.
