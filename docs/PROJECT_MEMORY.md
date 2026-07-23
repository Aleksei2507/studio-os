# Project Memory

Studio OS stores project knowledge inside the project.

Project Memory is the operational source of truth for the current project state.

---

# Files

Project Memory normally lives in:

```text
.studio/
  active-context.md
  design-system-profile.md
  project-state.md
  standards-profile.md
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
  interface-design.md
  qa-report.md
  release-notes.md
```

Execution evidence normally lives in:

```text
.studio/telemetry/
  development-report.md
  validation-report.md
  product-outcome-report.md
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

# Portable File References

Local file references in `.studio/`, `docs/`, `work-items/`, `contracts/`, and reports must move with the Target Workspace.

Rules:

- use project-root-relative paths such as `docs/project-brief.md`;
- require every local target to resolve inside the Target Workspace;
- never persist absolute home, Downloads, Desktop, temporary, upload-cache, attachment, `file://`, Windows drive, UNC, or escaping traversal paths;
- allow stable external `http` and `https` links when they are explicitly external citations;
- do not store the local path of a separately supplied document or sibling repository;
- import required external local evidence into a project-managed directory only after appropriate confirmation, then reference its project-relative destination;
- when evidence is not imported, record its descriptive title and `Availability: External, not stored` without a clickable machine path.

For legacy artifacts, rewrite an absolute path to a project-relative path only when it points inside the current Target Workspace and equivalence is certain. External evidence must not be copied silently or reported as reproducible when it is unavailable.

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
Parent Workflow: <workflow-id> | None
Return Stage: <stage> | None
Project Language: ru-RU

Target Milestone: MVP | First Release | <accepted Work Item outcome>
Product Readiness: Not Ready | Blocked | Ready for Release | Released
Current Increment: <identifier and name> | None
Increment Status: Planned | In Development | In Validation | In QA | Accepted | Blocked | None
Increment Progress: <accepted>/<total or Unknown>

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

When a Work Item interrupts active delivery, `Parent Workflow` and `Return Stage` preserve where the lifecycle resumes after the bounded change.

The Work Item request also records the parent Target Milestone and increment context. Release restores that context after the bounded Work Item finishes, so a Bugfix or Feature cannot erase roadmap progress.

Current Stage and Product Readiness are different facts. Stage completion describes one Runtime. Product Readiness describes the accepted Target Milestone. Only Product Outcome may set `Ready for Release`; only Release may set `Released`.

Repeatable stage history should include the delivery unit, such as `Development (Increment 1)` or `Validation (Bugfix <id>)`, so later roadmap increments are not mistaken for already completed work.

Interaction Strategy is inferred from current behavior and must not become a permanent user classification in Project Memory.

Interaction Strategy must not be used as technical-proficiency evidence.

For legacy Project State files without `Workflow`, `Work Type`, or `Active Work Item`, Loader preserves Mode, Project Language, current stage, completed stages, and artifacts. It proposes the missing fields and asks for confirmation before updating memory. It must not repeat Interview or Brownfield Onboarding.

For legacy state without milestone fields, Loader derives a proposal from accepted Brief and Roadmap evidence. It must use `Not Ready` while accepted work remains and must never infer readiness from a completed stage.

A legacy project may also lack `.studio/standards-profile.md`. This does not restart onboarding. Architecture creates an Accepted profile when selected; a bounded existing-stack change may use the confirmed Provisional bootstrap rule.

A legacy project may also lack `.studio/design-system-profile.md`. This does not restart onboarding. The next Design Strategy, Architecture, Interface Design, Development, or QA stage that needs interface-system evidence inspects the bounded project sources and creates a Provisional profile or routes unresolved design decisions to Interface Design.

Legacy machine-specific references also do not restart onboarding. Migrate only loaded or actively required artifacts, preserve accepted decisions, and ask one focused import question only when the missing external evidence blocks current work.

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

# standards-profile.md

`standards-profile.md` stores project quality and technology constraints used by Architecture, Interface Design, Development, Validation, QA, and Release.

It contains:

- Observed, Provisional, or Accepted status;
- delivery surfaces and selected standard IDs;
- accepted stack and ADR references;
- Studio OS delivery, operations, and continued-support model;
- repository conventions;
- required Interface Design, Development, Validation, QA, and Release evidence;
- approved deviations and review triggers.

It must describe project delivery and support constraints, not classify the user. The default model assigns implementation and continued support through Work Item workflows to Studio OS. Brownfield Onboarding records an Observed profile without changing technology. Architecture owns accepted stack and standards changes.

---

# design-system-profile.md

`design-system-profile.md` stores the concrete interface system used by the project.

It contains:

- Observed, Provisional, or Accepted status;
- Active, Not Applicable, or Unknown applicability;
- evidence for active component sources, themes, tokens, assets, and interaction patterns;
- shared and platform-specific foundations;
- preservation policy;
- primary, secondary, and legacy system boundaries;
- conflicts, unknowns, and approved deviations.

It is not a duplicate of `standards-profile.md`. The Standards Profile says which quality rules apply. The Design System Profile says which concrete interface system relevant work must preserve or deliberately revise.

Brownfield Onboarding creates the Observed profile from converging evidence and never identifies an active system from a dependency alone. Design Strategy preserves its experience constraints. Interface Design owns accepted design-system decisions. Architecture checks technical compatibility, Development implements the active profile, and QA verifies observable conformance.

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
    interface-design.md
    design-system-profile.md
    standards-profile.md
    development-report.md
    validation-report.md
    qa-report.md
    product-outcome-report.md
    release-notes.md
    summary.md
```

After a Work Item is completed, update the main project artifacts and Project Memory.

Work Item Intake writes `request.md` before routing to Feature, Bugfix, Research, or Refactor workflow.

Intermediate Work Item stages must not overwrite canonical `docs/` artifacts. Update the main product documents deliberately after an accepted release when product truth changed.

When a Work Item accepts different technology or quality constraints, keep them in `work-items/<id>/standards-profile.md` during implementation. Merge them into `.studio/standards-profile.md` only after successful Release.

When a Work Item accepts different design-system decisions, keep them in `work-items/<id>/design-system-profile.md` during implementation. Merge them into `.studio/design-system-profile.md` only after successful Release.

---

# Runtime Retrospective

Retrospective output belongs in:

```text
.studio/runtime-retrospective.md
```

It is not product documentation.

It is input for future Evolution.
