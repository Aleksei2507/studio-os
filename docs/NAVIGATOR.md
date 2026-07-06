# Studio Navigator

Studio Navigator is the user-facing entry point to Studio OS.

The user should not need to know internal stages or Runtime files.

---

# Main Commands

## Start or continue a project

```text
/studio:start
```

or natural language:

```text
Use Studio OS.

I want to build...
```

## Run Evolution

```text
/studio:evolve

Use:
- ~/Projects/project-a/
- ~/Projects/project-b/
```

If paths are missing, Studio OS must show the example and ask for project paths.

---

# Navigator Responsibilities

Navigator answers:

- What project mode is this?
- What stage is current?
- Which Runtime should handle the next message?
- Which artifact is missing?
- Which Quality Gate applies?
- Is the user's message part of the current stage or a new intent?

---

# Modes

## Greenfield

A new product idea.

Flow starts with Interview.

If the user already gave an idea, Interview starts without asking "Should I begin?".

---

## Brownfield

Existing code without Studio OS Project Memory.

Flow starts with Brownfield Onboarding.

Brownfield Onboarding analyzes the existing project and creates initial Project Memory:

- `.studio/project-state.md`
- `.studio/active-context.md`
- `docs/discovery-summary.md`

Brownfield does not develop, refactor, plan, or write architecture.

After Brownfield Onboarding, Studio OS recommends Briefing and waits for confirmation.

---

## Work Item

A change to an existing Studio OS project.

Examples:

- add a feature;
- fix a bug;
- refactor;
- research something;
- improve performance.

Studio OS should not restart the whole project.

It should create or route to a Work Item lifecycle.

---

## Evolution

A separate Studio OS maintenance workflow.

Evolution is not part of a product lifecycle.

It analyzes retrospectives from explicitly provided projects and creates local proposals.

---

# Conversation Routing

Before handling a message, Studio OS should classify intent:

- answer to current stage;
- clarification;
- scope change;
- new feature;
- new project;
- unrelated question;
- pause/stop/resume;
- Evolution request.

If unclear, ask one clarification question.

---

# Project Completion

After Release, Studio Navigator recommends Retrospective.

Retrospective stores experience in:

```text
.studio/runtime-retrospective.md
```

After Retrospective, the project is complete.

Evolution may be run later, manually.

---

# What Navigator Must Not Do

Navigator must not:

- write code;
- create product artifacts itself;
- make product decisions;
- skip quality gates;
- silently change scope;
- start a new stage after an artifact is completed without confirmation.

---

# Future Direction

The long-term goal is that a user can simply say:

```text
Use Studio OS.
I want to build...
```

Studio OS should infer the correct mode and start the correct Runtime.
