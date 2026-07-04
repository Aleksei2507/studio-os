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
  project-brief.md
  roadmap.md
  architecture.md
  qa-report.md
  release-notes.md
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

Mode: Greenfield | Brownfield | Work Item
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
    architecture.md
    qa-report.md
    summary.md
```

After a Work Item is completed, update the main project artifacts and Project Memory.

---

# Runtime Retrospective

Retrospective output belongs in:

```text
.studio/runtime-retrospective.md
```

It is not product documentation.

It is input for future Evolution.
