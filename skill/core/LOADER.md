# Studio OS Loader

> Bootstrap and workflow selection entry point for Studio OS.

## Metadata

Stage: Loader

Version: 2.0

Creates: None

Updates: None by default

Next: Selected workflow and active Runtime

## Goal

Determine project mode, work type, workflow, current stage, and active Runtime.

Loader routes work. It does not perform Interview, Discovery, Planning, Architecture, Development, or other stage work.

## Progressive Startup Loading

Always read:

1. `skill/core/INVARIANTS.md`.
2. `skill/workflows/registry.json`.
3. `skill/core/INTERACTION.md`.

Then read only what the current request requires:

1. `skill/core/PROJECT_MEMORY.md` when Project Memory exists or must be created.
2. `.studio/project-state.md` and `.studio/active-context.md` when available.
3. The selected workflow Markdown file.
4. `skill/core/CONVERSATION_ROUTER.md` for a message inside an active project.
5. The active Runtime `SKILL.md` from the registry.
6. `skill/capabilities/registry.json` and only capability contracts declared by the active Runtime.
7. Optional Runtime references only when the Runtime says they are needed.

Do not load README, user documentation, every workflow, or every Runtime at startup.

## Project Mode Detection

Apply the first matching rule:

1. If `.studio/` exists, continue the existing Studio OS project.
2. Otherwise, if a meaningful codebase exists, select Brownfield.
3. Otherwise, select Greenfield.

### Greenfield

Select workflow: `greenfield`.

Start Runtime: `interview`.

If the user already provided an idea, start Interview without asking whether to begin.

### Brownfield

Select workflow: `brownfield`.

Start Runtime: `brownfield`.

Brownfield Onboarding takes priority over a requested feature or bugfix when Project Memory does not exist. Finish onboarding before selecting a Work Item workflow.

### Existing Studio OS Project

Read stored workflow and stage from Project Memory.

If Project Memory uses the legacy format, migrate it through the Legacy Project Memory rule before routing.

If the user is continuing current work, resume them.

If the user requests a bounded change, classify Work Type and select a Work Item workflow.

## Work Type Detection

Classify requested outcome from observable intent, not fixed phrases:

- New Product: create a product that does not exist.
- Feature: add or expand user-visible capability.
- Bugfix: correct existing behavior that is wrong or regressed.
- Research: produce evidence or a decision without implementation.
- Refactor: improve internal structure while preserving product behavior.

When uncertain whether a request changes product behavior, ask one focused clarification question.

Do not infer Work Type from profession, language, or interaction strategy.

## Legacy Project Memory

When `.studio/project-state.md` has Mode and Current Stage but lacks new routing fields:

1. Preserve `Mode` exactly as Greenfield or Brownfield.
2. Infer `Workflow: greenfield` for Greenfield lifecycle state.
3. Infer `Workflow: brownfield` for Brownfield lifecycle state.
4. Use `Work Type: New Product` for Greenfield.
5. Use `Work Type: Not Selected` for Brownfield unless the current request provides a bounded Work Type.
6. Add `Active Work Item: None` unless an existing Work Item path is confirmed.
7. Preserve completed stages, artifacts, Project Language, and current stage.
8. Show the proposed migration and request confirmation before writing because Project Memory mutation is non-obvious.

Do not restart Interview or Brownfield Onboarding merely because new routing fields are absent.

## Workflow Selection

Follow `skill/workflows/WORKFLOW_SPEC.md` and `skill/workflows/registry.json`.

Selection precedence:

1. Explicit Studio OS Evolution -> `evolution`.
2. Existing Studio OS project plus bounded change -> matching Work Item workflow.
3. Existing Studio OS project without new work -> stored workflow.
4. Existing codebase without Project Memory -> `brownfield`.
5. New product without an existing codebase -> `greenfield`.

Read only the selected workflow file.

## Project Language

1. Use `Project Language` from `.studio/project-state.md` when it exists.
2. Otherwise use the language of the initial project request.
3. Store it when Project Memory is created.
4. Use it for conversation, `docs/`, `.studio/`, and Work Item artifacts.
5. Change it only after explicit user confirmation.

## Interaction Strategy

Infer interaction strategy through `skill/core/INTERACTION.md` before the active Runtime asks, recommends, or executes.

Pass the strategy to the active Runtime. Re-evaluate it when observable behavior changes.

Do not ask the user to select a mode.

## Conversation Routing

For an active project message, use `skill/core/CONVERSATION_ROUTER.md` before stage handling.

The router may keep the current workflow, select a Work Item workflow, answer an unrelated question without mutation, or ask one clarification question.

## Runtime Loading

Resolve the active Runtime path through the selected workflow and registry.

Check its registry status before execution.

- `active`: load its `SKILL.md` and continue.
- `planned`: report that the Runtime contract is not implemented, identify the blocked stage, and stop without claiming stage completion.

For an active Runtime, load a reference only when its `SKILL.md` gives a condition that applies to the current situation.

Resolve declared capability IDs through `skill/capabilities/registry.json`. Load only their contracts. If a required capability is unavailable, follow the capability and Runtime blocked behavior.

Do not read other Runtime folders preemptively.

## Confirmation

Confirmation is required:

- before moving to the next stage after an artifact is accepted;
- before changing workflow or accepted scope;
- before returning to an earlier completed stage;
- before a non-obvious Project Memory mutation.

Do not ask confirmation merely to begin Interview after the user supplied an idea.

## Forbidden

Loader must not:

- perform stage work;
- create product artifacts;
- write product code;
- choose product or architecture decisions;
- skip quality gates;
- execute a Runtime marked `planned`;
- load every Runtime at startup;
- start a new stage automatically after completion.

## Stop Condition

Loader stops after it has:

1. selected or resumed one workflow;
2. identified one active Runtime;
3. loaded only the required context;
4. handed control to the Runtime or asked one necessary clarification question.
