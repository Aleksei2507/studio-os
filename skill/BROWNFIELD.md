# Brownfield Runtime

> Runtime for connecting Studio OS to an existing project.

Brownfield Runtime creates the initial Project Memory for an existing codebase.

Brownfield Runtime does not perform development work.

---

# Metadata

Stage: Brownfield Onboarding

Version: 1.0

Optional: No for existing projects without Project Memory

Requires Confirmation: Yes before moving to Briefing

Creates:

- `.studio/project-state.md`
- `.studio/active-context.md`
- `docs/discovery-summary.md`

Updates:

- None before the initial Project Memory exists

Next Stage:

Briefing

---

# Goal

Analyze an existing project and create the initial Project Memory.

Brownfield Runtime must determine:

- current product state;
- main product capabilities;
- architectural risks;
- technical boundaries;
- product boundaries;
- sources of truth;
- unknown areas.

Brownfield Runtime must not:

- change code;
- refactor;
- write roadmap;
- write architecture;
- do planning;
- select or change implementation tasks.

---

# Inputs

Before starting, read available project materials.

Read:

- `README.md`
- `docs/`
- `package.json`
- `go.mod`
- `Cargo.toml`
- `pom.xml`
- `requirements.txt`
- `Dockerfile`
- `docker-compose.yml`
- Prisma schema, such as `prisma/schema.prisma`
- source code

If an expected file does not exist, record that absence only when it matters.

Do not modify any source file while reading.

---

# Brownfield Mindset

Act like an experienced product and technical analyst joining an existing project.

Start from evidence in the repository.

Separate what is confirmed from what is inferred.

Prefer concise, bounded findings over full source-code summaries.

The goal is onboarding memory, not a full audit.

---

# Brownfield Product Principles

Do not assume that an existing project is in an MVP stage.

If the project is already a working product, use:

```text
Current Product Scope
```

instead of:

```text
MVP Scope
```

Brownfield Briefing fixes the current product core.

It does not try to define MVP again.

Acceptance Criteria for Brownfield must describe product value from the user's point of view, not internal implementation.

Good:

- user receives a notification.

Bad:

- worker starts;

After Brownfield Briefing, Planning automatically enters:

```text
Development Planning
```

not:

```text
Product Planning
```

---

# Required Understanding

Before creating artifacts, identify:

- what the product appears to do today;
- which capabilities are already present;
- which areas are unclear;
- which docs or files are sources of truth;
- where product boundaries are visible;
- where technical boundaries are visible;
- which risks should be preserved for Briefing.

If the repository does not contain enough evidence to determine an area, record it as Unknown.

---

# Conversation Rules

Do not ask the user broad discovery questions before inspecting the project.

Ask one focused clarification question only if it materially changes the initial Project Memory.

Do not ask implementation, stack-selection, roadmap, or architecture-design questions.

If the user requests development during Brownfield Onboarding, explain that onboarding must finish first or route the request as a later Work Item.

---

# Continue Rule

Before asking any question, check:

- Can this be answered from repository evidence?
- Will the answer change `.studio/project-state.md`, `.studio/active-context.md`, or `docs/discovery-summary.md`?
- Is the question about onboarding, not development?

If the answer will not change the initial Project Memory, do not ask.

---

# Forbidden

Brownfield Runtime must not:

- edit source code;
- run refactors;
- create implementation tasks;
- write `docs/roadmap.md`;
- write `docs/architecture.md`;
- make planning decisions;
- start Briefing automatically;
- copy full discovery content into Active Context.

---

# Output

Create:

```text
.studio/project-state.md
.studio/active-context.md
docs/discovery-summary.md
```

## `.studio/project-state.md`

Use this format:

```md
Mode: Brownfield
Project Language: <language>
Onboarding Status: Bootstrapped
Previous Stage: Brownfield Onboarding
Current Stage: Briefing
Status: Waiting Confirmation
```

## `.studio/active-context.md`

Use only these sections:

- Current Focus
- Confirmed Facts
- Current Decisions
- Unknowns
- References

Do not copy the full Discovery Summary into Active Context.

## `docs/discovery-summary.md`

Use this structure:

- Executive Summary
- Current Product Capabilities
- Current System Understanding
- Current Risks
- Product Boundaries
- Technical Boundaries
- Current Decisions
- Unknowns
- Recommended Next Step

Recommended Next Step must always be:

```text
Briefing
```

---

# Project Memory Update

Create initial Project Memory from repository evidence.

Keep `.studio/active-context.md` short and operational.

Use `docs/discovery-summary.md` for the full Brownfield onboarding summary.

Use the project working language determined by Loader.

---

# Stage Handoff

Pass to Briefing:

- current product understanding;
- confirmed capabilities;
- product boundaries;
- technical boundaries;
- current risks;
- unknowns;
- references that should guide product decisions.

---

# Completion Checklist

Brownfield Onboarding is complete when:

- `.studio/project-state.md` exists;
- `.studio/active-context.md` exists;
- `docs/discovery-summary.md` exists;
- current state is summarized;
- capabilities are listed;
- risks and unknowns are recorded;
- product and technical boundaries are recorded;
- sources of truth are referenced;
- Recommended Next Step is Briefing.

---

# Stop Condition

After creating the three files:

- do not start Briefing automatically;
- say that Brownfield Onboarding is complete;
- offer to proceed to Briefing;
- wait for user confirmation.
