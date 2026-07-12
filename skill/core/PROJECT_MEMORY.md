# Project Memory Contract

Load this contract when Project Memory exists or must be created.

Project Memory is operational state, not a transcript.

## Files

```text
.studio/
  project-state.md
  active-context.md
  runtime-retrospective.md
```

Product artifacts remain in `docs/` and Work Item artifacts remain in `work-items/`.

## Project State

Use these fields when applicable:

```md
# Project State

Mode: Greenfield | Brownfield
Workflow: <workflow-id>
Work Type: New Product | Feature | Bugfix | Research | Refactor | Not Selected
Active Work Item: <path or None>
Project Language: <language>

Previous Stage: <stage>
Current Stage: <stage>
Status: In Progress | Waiting Confirmation | Completed | Blocked
Next Recommended Stage: <stage>

Completed Stages:
- <stage>

Latest Artifacts:
- <path>

Last Updated: YYYY-MM-DD
```

`Workflow` and `Work Type` are independent from `Mode`. Starting a Work Item must not replace the stored Greenfield or Brownfield origin.

Examples:

- `Mode: Brownfield`, `Workflow: brownfield`, `Work Type: Not Selected`
- `Mode: Brownfield`, `Workflow: work-item-bugfix`, `Work Type: Bugfix`

## Active Context

Keep `.studio/active-context.md` compact.

Include only:

- current focus;
- confirmed decisions needed now;
- important unknowns;
- constraints;
- references to accepted artifacts.

Do not copy completed artifacts or conversation history into Active Context.

## Stage Transition

After a stage completes:

1. Record the completed stage.
2. Reference the new artifact.
3. Set the next stage as `Current Stage`.
4. Use `Status: Waiting Confirmation` when confirmation is required.
5. Preserve the selected workflow until it completes or the user confirms a workflow change.

## Legacy Migration

For an existing Project State without `Workflow`, `Work Type`, or `Active Work Item`:

- preserve Greenfield or Brownfield Mode;
- infer the lifecycle workflow from Mode;
- preserve current and completed stages;
- preserve artifacts and Project Language;
- add missing routing fields only after confirmation;
- do not repeat project onboarding.

## Work Items

Store bounded product changes under:

```text
work-items/
  YYYY-MM-DD-short-name/
```

A completed Work Item must update the main product artifacts and Project Memory when its decisions change the product.

## Work Item Artifact Isolation

While a Work Item is active:

- create its Brief, Roadmap, Design Strategy, Architecture, Estimate, Development Report, Validation Report, QA Report, Release Notes, and Summary under the `Active Work Item` directory;
- do not overwrite canonical `docs/` artifacts during intermediate stages;
- reference Work Item artifacts from Active Context;
- update canonical product artifacts deliberately after an accepted release when product truth changed;
- clear `Active Work Item` only after completion or explicit cancellation.

## Interaction State

Do not store a permanent user classification.

Interaction strategy describes the current interaction. Re-infer it from recent observable behavior when a session resumes or the behavior changes.
