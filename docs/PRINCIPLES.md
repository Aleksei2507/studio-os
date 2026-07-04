# Studio OS Principles

> These principles define how Studio OS behaves. Every Runtime, stage, template, or future module must follow them.

---

# Principle 1 — Working Product > Generated Code

Studio OS exists to move a user from an idea to a high-quality working product.

The main result is not generated code. The main result is a product that works and matches the user’s intent.

---

# Principle 2 — Process > Prompts

Prompts may change.

The process must remain stable.

Studio OS describes a repeatable product development process, not a collection of magic prompts.

---

# Principle 3 — AI Is Replaceable

Any AI model is an implementation detail.

Studio OS must work with different AI tools and must not depend on one vendor, product, model, IDE, or chat interface.

---

# Principle 4 — Every Question Must Change The Next Artifact

Do not ask questions just because they are interesting.

Before asking a question, AI must decide whether the answer will change the next required artifact.

If the answer will not change the artifact, do not ask the question.

---

# Principle 5 — Build Understanding Before Asking Questions

Before asking questions, AI should first use the information already available.

The normal pattern is:

1. Read the available context.
2. Build an initial understanding.
3. Show the understanding to the user.
4. Ask only the missing question that matters.

This prevents Studio OS from becoming a questionnaire.

---

# Principle 6 — Questions Before Solutions

If information is genuinely missing, ask before deciding.

Do not build architecture, roadmap, or code from guesses.

But if the answer is already present in Project Memory, do not ask again.

---

# Principle 7 — Every Stage Produces an Artifact

Every major stage ends with a concrete artifact.

Examples:

- Interview → Project Memory update
- Discovery → `docs/discovery-summary.md`
- Briefing → `docs/project-brief.md`
- Planning → `docs/roadmap.md`
- Architecture → `docs/architecture.md` and ADRs
- Development → working increment
- Validation → validation report
- QA → QA report
- Release → release notes
- Retrospective → `.studio/runtime-retrospective.md`

---

# Principle 8 — No Hidden Decisions

Important product and architecture decisions must be explicitly recorded.

Studio OS must not rely on hidden chat context or model memory.

---

# Principle 9 — Small Stable Steps

Prefer several small finished steps over one large unfinished step.

Every iteration should reduce uncertainty or produce user-visible value.

---

# Principle 10 — Human Owns The Product

AI helps clarify, challenge, and propose.

The human owns the product.

Studio OS must not make irreversible product decisions without confirmation.

---

# Principle 11 — Protect Product Coherence

Studio OS should not accept every new idea automatically.

When a new request changes the scope, roadmap, or product direction, Studio OS must ask what problem the change solves and whether it belongs to the current lifecycle, a Work Item, or a separate project.

---

# Principle 12 — Project Memory Is The Source Of Truth

Studio OS stores project knowledge inside the project.

The source of truth is not the chat history and not the model memory.

Project Memory must reflect the current state and point to the latest artifacts.

---

# Principle 13 — Controlled Evolution

Studio OS evolves through practice.

Retrospective captures experience.

Evolution analyzes retrospectives and creates local proposals.

Studio OS must not rewrite its own Runtime automatically.


---

# Principle 14 — One Project, One Language

Studio OS must keep each project in one working language.

The conversation, `docs/` artifacts, `.studio/` project memory, summaries, roadmaps, retrospectives, and handoffs should use the same language unless the user explicitly asks to change it.

The project language must be stored in Project Memory and reused across all stages.
