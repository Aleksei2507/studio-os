# Project Memory Contract

Load this contract when Project Memory exists or must be created.

Project Memory is operational state, not a transcript.

## Files

```text
.studio/
  project-state.md
  active-context.md
  standards-profile.md
  design-system-profile.md
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
Parent Workflow: <workflow-id or None>
Return Stage: <stage or None>
Project Language: <language>

Target Milestone: <accepted milestone name or Not Selected>
Product Readiness: Not Ready | Blocked | Ready for Release | Released
Current Increment: <identifier and name or None>
Increment Status: Planned | In Development | In Validation | In QA | Accepted | Blocked | None
Increment Progress: <accepted>/<total or Unknown>

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

When a Work Item interrupts an active lifecycle, store its prior workflow in `Parent Workflow` and its prior stage in `Return Stage`. Restore them after the Work Item completes or is explicitly cancelled. Do not lose milestone or increment progress while a bounded change is active.

Stage status and product readiness are independent. `Status: Completed` means only that the named current stage or workflow unit completed. It does not mean the Target Milestone is ready or released.

Qualify repeatable stage history with its delivery unit, for example `Development (Increment 1)` or `Validation (Bugfix <id>)`. Do not let one unqualified completed-stage entry suppress required work for later increments.

Use the accepted Project Brief or Work Item scope for `Target Milestone`. Use the accepted Roadmap for `Current Increment` and `Increment Progress`.

Only Product Outcome may set `Product Readiness: Ready for Release`. Only Release may set `Product Readiness: Released`. Other Runtimes preserve readiness or set it to `Not Ready` or `Blocked` with evidence.

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

## Project-Local Reference Contract

All persisted Studio OS artifacts must remain portable with the Target Workspace. This applies to `.studio/`, `docs/`, `work-items/`, `contracts/`, telemetry reports, and any other project-managed artifact directory.

For local file references:

- store project paths relative to the Target Workspace root, for example `docs/project-brief.md` or `contracts/external/api.yaml`;
- require the resolved target to remain inside the Target Workspace;
- use a document-relative Markdown link only when its canonical target still remains inside the Target Workspace;
- never persist POSIX absolute paths, Windows drive or UNC paths, `~`, environment-expanded home paths, `file://` URIs, or parent traversal that escapes the Target Workspace;
- never persist transient locations such as Downloads, Desktop, `/tmp`, upload caches, remote-attachment directories, or an agent's working directory;
- do not rely only on directory-name matching: canonical containment within the Target Workspace is the deciding rule.

Stable external URLs are allowed for web research, remote repositories, issue trackers, and other intentionally external sources. Label them as external sources rather than project files and include revision, access date, or ownership context when reproducibility depends on it.

When an explicitly supplied local source is outside the Target Workspace:

1. Inspect it only when the active Runtime permits that evidence and access is authorized.
2. Do not persist its machine path.
3. If reproducibility requires retaining the file, propose importing a copy or approved snapshot into a project-managed evidence directory. Obtain confirmation before copying material that may be sensitive, licensed, large, or unintentionally committed.
4. After import, reference only the project-relative destination and record source provenance without the original machine path.
5. If it is not imported, record a descriptive title and `Availability: External, not stored` without a clickable local path. Do not claim that another machine can reproduce the evidence.

Before completing any artifact write, inspect changed artifact content for non-portable local references and repair them.

## Project Standards Profile

Use `.studio/standards-profile.md` to store accepted or observed engineering and product-quality constraints.

The profile is project state, not a personal assessment. It records Studio OS delivery, operations, and continued-support responsibilities. External ownership appears only when the user explicitly requests handoff or another operating model.

Load it only for Architecture, Interface Design, Development, Validation, QA, Release, or another Runtime that explicitly needs standards evidence.

Architecture owns accepted technology and standards changes. Brownfield Onboarding may record an `Observed` profile without changing the existing stack.

## Project Design System Profile

Use `.studio/design-system-profile.md` to store evidence about the project's active interface foundations, component sources, interaction patterns, platform variants, and preservation policy.

The profile is separate from `.studio/standards-profile.md`: standards define quality constraints, while the Design System Profile records the concrete interface system that relevant work must preserve or deliberately revise.

Brownfield Onboarding creates an `Observed` profile from repository and design evidence. It must distinguish an active system from installed-but-unused dependencies, identify primary, secondary, and legacy systems when more than one exists, and record Unknown or Not Applicable instead of inventing a system.

Interface Design owns accepted design-system decisions. Architecture reads the profile for stack and migration compatibility but does not redefine visual rules. Development implements against it, and QA verifies observable conformance.

Load the canonical profile, and an active Work Item profile when present, only for Design Strategy, Architecture, Interface Design, Development, QA, Release when merging an accepted change, or another Runtime that explicitly needs design-system evidence.

## Stage Transition

After a stage completes:

1. Record the completed stage.
2. Reference the new artifact.
3. Set the next stage as `Current Stage`.
4. Use `Status: Waiting Confirmation` when confirmation is required.
5. Preserve the selected workflow until it completes or the user confirms a workflow change.
6. Update `Increment Status` only for the bounded increment evaluated by that stage.
7. Preserve `Product Readiness` unless the active Runtime owns the readiness transition.

## Legacy Migration

For an existing Project State without `Workflow`, `Work Type`, or `Active Work Item`:

- preserve Greenfield or Brownfield Mode;
- infer the lifecycle workflow from Mode;
- preserve current and completed stages;
- preserve artifacts and Project Language;
- add `Parent Workflow: None` and `Return Stage: None` unless an interrupted lifecycle is confirmed;
- add missing routing fields only after confirmation;
- do not repeat project onboarding.

For an existing Project State without milestone or increment fields:

- derive `Target Milestone` from the accepted Project Brief or active Work Item;
- derive `Current Increment` and progress from the accepted Roadmap and delivery reports;
- use `Product Readiness: Not Ready` when accepted work remains;
- use `Product Readiness: Blocked` only with a named blocker;
- never infer `Ready for Release` or `Released` from a completed stage or missing information;
- request confirmation before writing a non-obvious inferred migration.

Absence of `.studio/standards-profile.md` in a legacy project does not invalidate existing memory or restart onboarding. Bootstrap it through Standards Layer when an applicable Runtime runs.

Absence of `.studio/design-system-profile.md` in a legacy project also does not invalidate existing memory or restart onboarding. The next Runtime that needs design-system evidence must inspect the relevant project sources and create a bounded `Provisional` profile or route to Interface Design when a material design decision is unresolved.

Legacy absolute paths do not invalidate Project Memory or restart onboarding. When a loaded artifact contains one:

- rewrite it to a project-relative path when the target is inside the current Target Workspace and equivalence is certain;
- do not silently copy an external target or pretend it remains available;
- request one focused import decision only when the external evidence is required for active work;
- otherwise preserve the accepted decision, replace the path with a non-linked unavailable-source record, and identify any resulting evidence gap.

## Work Items

Store bounded product changes under:

```text
work-items/
  YYYY-MM-DD-short-name/
```

A completed Work Item must update the main product artifacts and Project Memory when its decisions change the product.

## Work Item Artifact Isolation

While a Work Item is active:

- create its Brief, Roadmap, Design Strategy, Architecture, Estimate, Interface Design, Development Report, Validation Report, QA Report, Product Outcome Report when selected, Release Notes, and Summary under the `Active Work Item` directory;
- create a Work Item Standards Profile there when accepted implementation constraints differ from the canonical profile;
- create a Work Item Design System Profile there when accepted interface-system decisions differ from the canonical profile;
- do not overwrite canonical `docs/` artifacts during intermediate stages;
- do not overwrite `.studio/standards-profile.md` with unimplemented Work Item decisions;
- do not overwrite `.studio/design-system-profile.md` with unimplemented Work Item decisions;
- reference Work Item artifacts from Active Context;
- update canonical product artifacts deliberately after an accepted release when product truth changed;
- merge an accepted Work Item Standards Profile after successful Release when project standards or technology changed;
- merge an accepted Work Item Design System Profile after successful Release when the implemented interface system changed;
- clear `Active Work Item` only after completion or explicit cancellation.

## Interaction State

Do not store a permanent user classification.

Interaction strategy describes the current interaction. Re-infer it from recent observable behavior when a session resumes or the behavior changes.

Do not store or infer the user's technical proficiency. Interaction Strategy does not affect technology selection or Studio OS support responsibility.
