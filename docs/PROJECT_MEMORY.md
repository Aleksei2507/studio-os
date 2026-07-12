# Project Memory

Studio OS stores project knowledge inside the project.

Project Memory is the operational source of truth for the current project state.

---

# Files

Project Memory normally lives in:

```text
.studio/
  active-context.md
  project-state.md
  runtime-retrospective.md
```

Product artifacts normally live in:

```text
docs/
  discovery-summary.md
  research-summary.md
  project-brief.md
  design-strategy.md
  roadmap.md
  architecture.md
  delivery-estimate.md
  qa-report.md
  release-notes.md
```

Execution evidence normally lives in:

```text
.studio/telemetry/
  development-report.md
  validation-report.md
```

---

# Project Language

Every Studio OS project should store its working language in `.studio/project-state.md`.

Recommended field:

```md
Project Language: ru-RU
```

Rules:

- use the same language for all `docs/` artifacts and `.studio/` memory files;
- do not mix languages inside one project;
- if a project already has `Project Language`, keep using it even if the current message is in another language;
- change the project language only after explicit user confirmation.

---

# active-context.md

`active-context.md` is not a transcript and not a copy of all artifacts.

It should stay compact.

It should contain only:

- current focus;
- key confirmed decisions;
- important unknowns for the next stage;
- links/references to completed artifacts;
- relevant constraints that must not be forgotten.

Do not duplicate finished artifacts inside `active-context.md`.

If a stage created `docs/project-brief.md`, the active context should reference it and summarize only the most important decisions.

---

# project-state.md

`project-state.md` should describe the current routing state.

Recommended format:

```md
# Project State

Mode: Greenfield | Brownfield
Workflow: greenfield | brownfield | work-item-feature | work-item-bugfix | work-item-research | work-item-refactor
Work Type: New Product | Feature | Bugfix | Research | Refactor | Not Selected
Active Work Item: work-items/YYYY-MM-DD-short-name | None
Project Language: ru-RU

Previous Stage: Briefing
Current Stage: Planning
Status: Waiting Confirmation
Next Recommended Stage: Planning

Completed Stages:
- Interview
- Discovery
- Briefing

Latest Artifacts:
- docs/discovery-summary.md
- docs/project-brief.md

Last Updated: YYYY-MM-DD
```

`Mode`, `Workflow`, and `Work Type` are separate fields:

- Mode records whether the project originated as Greenfield or Brownfield;
- Workflow records the selected Runtime sequence;
- Work Type records the requested outcome.

Starting a Work Item must not replace the stored project Mode.

Interaction Strategy is inferred from current behavior and must not become a permanent user classification in Project Memory.

For legacy Project State files without `Workflow`, `Work Type`, or `Active Work Item`, Loader preserves Mode, Project Language, current stage, completed stages, and artifacts. It proposes the missing fields and asks for confirmation before updating memory. It must not repeat Interview or Brownfield Onboarding.

When a stage completes, prefer moving the current state to the next stage with `Waiting Confirmation` instead of leaving the completed stage as current.

Example:

```md
Previous Stage: Planning
Current Stage: Architecture
Status: Waiting Confirmation
Next Recommended Stage: Architecture
```

This makes routing easier for Loader and Conversation Router.

---

# Stage History

Project Memory should preserve a compact stage history.

This helps Work Items, Retrospective, and Evolution understand how the project moved through Studio OS.

---

# Work Items

For changes after the first release, use:

```text
work-items/
  2026-07-05-favorites/
    request.md
    brief.md
    roadmap.md
    design-strategy.md
    architecture.md
    delivery-estimate.md
    development-report.md
    validation-report.md
    qa-report.md
    release-notes.md
    summary.md
```

After a Work Item is completed, update the main project artifacts and Project Memory.

Work Item Intake writes `request.md` before routing to Feature, Bugfix, Research, or Refactor workflow.

Intermediate Work Item stages must not overwrite canonical `docs/` artifacts. Update the main product documents deliberately after an accepted release when product truth changed.

---

# Runtime Retrospective

Retrospective output belongs in:

```text
.studio/runtime-retrospective.md
```

It is not product documentation.

It is input for future Evolution.
