# Conversation Router Runtime

> Runtime for classifying user messages before passing them to a stage Runtime.

---

# Metadata

Stage: Conversation Router

Version: 1.0

Optional: No

Requires Confirmation: Only when intent is unclear

Creates: None

Updates: None by default

Next Stage: Current Runtime or Loader

---

# Goal

Determine whether the user's message belongs to the current Runtime or represents a different intent.

Conversation Router protects the current stage from accidental topic changes, random ideas, unrelated questions, and scope changes.

---

# Inputs

Before classifying a message, use:

- current user message;
- current interaction strategy, if one has been inferred;
- `.studio/project-state.md` if available;
- `.studio/active-context.md` if available;
- current stage Runtime;
- recent stage question, if one exists.

---

# Interaction Strategy Check

Before routing a message, consider whether the message changes the interaction strategy.

Use `skill/core/INTERACTION.md` to infer strategy from observable user behavior, not fixed phrases.

Examples:

- User delegates decisions -> Advisor
- User challenges a recommendation -> Collaborator
- User gives a concrete bounded instruction -> Executor

The strategy can change during a project.

Do not use language-specific phrase matching.

Do not ask the user to choose an interaction mode.

---

# Intent Types

Classify the message as one of:

## Bounded Work Item Request

The user requests a Feature, Bugfix, Research task, or Refactor in an existing Studio OS project, and the message is not an answer to the active stage question.

Action:

Pass the request to `skill/runtimes/work-item/SKILL.md` for Work Type and workflow selection.

Project Mode, Work Type, and interaction strategy are independent. Do not restart Greenfield or Brownfield onboarding when Project Memory already exists.

---

## Answer Current Stage

The user is answering the current stage question or confirming the proposed artifact.

Action:

Pass message to the current Runtime.

---

## Clarification About Current Stage

The user asks about the current stage or asks why something is being asked.

Action:

Answer briefly and continue the current Runtime.

---

## Scope Change

The user proposes a change that affects the current MVP, roadmap, architecture, or product direction.

Examples:

- "Add authentication."
- "Support the existing-analysis scenario now."
- "Make it a mobile app instead."

Action:

Do not apply the change automatically.

Explain which artifact may be affected and ask what problem the change solves.

If it changes an already completed artifact, recommend returning to the relevant stage or creating a Work Item.

---

## New Feature Candidate

The user proposes a feature that may belong to the product but is not clearly part of the current scope.

Action:

Ask whether it is:

1. part of the current MVP;
2. a future Work Item;
3. a separate project;
4. an unrelated note.

---

## New Project

The user introduces a different product idea.

Action:

Ask whether to pause the current project and start a new Greenfield project.

Do not overwrite the current Project Memory.

---

## Unrelated Question

The user asks something unrelated to the project or Studio OS.

Action:

Answer the question if appropriate, but do not mutate Project Memory or stage artifacts unless the user explicitly connects it to the project.

---

## Pause / Stop / Resume

The user wants to pause, stop, continue, or resume a project.

Action:

Respect the instruction and update Project Memory only if the user explicitly wants the project state changed.

---

# Ambiguity Rule

If confidence is low, do not guess.

Ask one clarification question:

```text
I’m not sure whether this belongs to the current stage.
Is this:

1. an answer to the current question;
2. a new feature for this project;
3. a separate project;
4. an unrelated question?
```

---

# Product Coherence Rule

When a new idea appears during an active stage, do not reject it automatically and do not accept it automatically.

First ask:

> What problem does this solve for the current product?

If the idea does not support the current product goal, recommend parking it as a future Work Item or separate project.

---

# Forbidden

Conversation Router must not:

- create product artifacts;
- update roadmap by itself;
- change MVP scope by itself;
- start a new project without confirmation;
- silently ignore a user message;
- assume every message belongs to the current stage.

---

# Stop Condition

After classification:

- route the message to the current Runtime;
- or ask a clarification question;
- or recommend a safe next action.
