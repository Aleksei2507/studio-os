# Studio OS Loader

> Loader is the bootstrap and router entry point for Studio OS.

---

# Metadata

Stage: Loader

Version: 1.1

Optional: No

Requires Confirmation: No for routing, Yes before starting a new stage after an artifact is completed

Creates: None

Updates: None by default

Next Stage: Detected Runtime

---

# Goal

Loader determines the project mode, current state, and next Runtime.

Loader does not perform stage work.

Loader should be mostly invisible to the user.

Its job is to route, not to interview, plan, architect, or code.

---

# Step 1 — Read Studio OS Documentation

Read:

1. `README.md`
2. `docs/PRINCIPLES.md`
3. `docs/HOW_IT_WORKS.md`
4. `docs/NAVIGATOR.md`
5. `docs/STAGE_BOUNDARIES.md`
6. `docs/QUALITY_GATES.md`
7. `docs/PROJECT_MEMORY.md`
8. `skill/RUNTIME_MAP.md`
9. `skill/CONVERSATION_ROUTER.md`

---

# Step 2 — Detect Project Mode

Detect:

## Greenfield

No `.studio/`, no product artifacts, no meaningful source code.

Start Runtime: Interview.

If the user already provided a product idea, do not ask "Start Interview?".

Start Interview directly.

---

## Brownfield

Existing source code but no `.studio/` Project Memory.

Start Runtime: Project Analysis / Brownfield onboarding.

If no Brownfield Runtime exists yet, explain that Brownfield support is not implemented and ask whether to create Project Memory manually.

---

## Studio OS Project

`.studio/` exists.

Read Project Memory and route to the current stage or next recommended stage.

---

## Work Item

The user asks to add, fix, refactor, research, or change something in an existing Studio OS project.

Do not restart the project.

Create or route to a Work Item lifecycle.

---

## Evolution

The user explicitly runs `/studio:evolve` or asks to improve Studio OS from retrospectives.

Start Evolution Runtime.

If project paths are missing, Evolution must show a usage example instead of failing.


---

# Step 2.5 — Detect Project Language

Before starting the first Runtime, detect the project working language.

Rules:

1. If `.studio/project-state.md` already contains `Project Language`, use it.
2. If there is no Project Memory yet, use the language of the user's initial project request.
3. Store the detected language in `.studio/project-state.md` when Project Memory is created.
4. All files created in `docs/` and `.studio/` must use this language.
5. Do not switch artifact language later unless the user explicitly asks to change the project language.

Example:

If the user speaks Russian, create `docs/discovery-summary.md`, `docs/project-brief.md`, `docs/roadmap.md`, `.studio/active-context.md`, and `.studio/project-state.md` in Russian.

---

# Step 3 — Read Project Memory

If available, read:

- `.studio/project-state.md`
- `.studio/active-context.md`

Use them before inspecting source code.

---

# Step 4 — Read Existing Artifacts

If available, read:

- `docs/discovery-summary.md`
- `docs/research-summary.md`
- `docs/project-brief.md`
- `docs/design-strategy.md`
- `docs/roadmap.md`
- `docs/architecture.md`
- `docs/qa-report.md`
- `docs/release-notes.md`

---

# Step 5 — Use Conversation Router

Before processing any user message inside an active project, classify the message with `skill/CONVERSATION_ROUTER.md`.

Do not assume every message belongs to the current stage.

If the message is ambiguous, ask one clarification question.

---

# Step 6 — Route To Runtime

After mode and stage are known, open the appropriate Runtime file.

Examples:

- Greenfield → `skill/INTERVIEW.md`
- Interview completed → `skill/DISCOVERY.md`
- Discovery completed → `skill/BRIEFING.md`
- Briefing completed → `skill/PLANNING.md`
- Planning completed → `skill/ARCHITECTURE.md`
- Release completed → `skill/RETROSPECTIVE.md`
- `/studio:evolve` → `skill/EVOLUTION.md`

---

# Invisible Loader Rule

Loader should not narrate its internal work unless useful.

Avoid verbose messages like:

> I detected Greenfield and recommend Interview. Should I start?

Prefer:

```text
Studio OS

Mode: Greenfield
Stage: Interview

I understand the idea as...
```

Then hand off to Interview.

---

# Confirmation Rule

Do not ask for confirmation just to start Interview when the user already asked to use Studio OS and provided an idea.

Confirmation is required:

- before moving to the next stage after an artifact is created;
- before changing scope;
- before returning to an earlier stage;
- before mutating Project Memory in a non-obvious way.

---

# Forbidden

Loader must not:

- do Interview work;
- do Discovery analysis;
- create product artifacts;
- write code;
- make product decisions;
- skip Quality Gates;
- start the next stage after a completed artifact without confirmation.

---

# Stop Condition

Loader is complete when it has routed control to the correct Runtime or asked a necessary clarification question.
