# Workflow Specification

Workflow files compose reusable Runtime skills into task-specific cycles.

## Independent Axes

Studio OS classifies four separate concerns:

1. Project Mode: Greenfield, Brownfield, or existing Studio OS project.
2. Work Type: New Product, Feature, Bugfix, Research, or Refactor.
3. Workflow: the Runtime sequence selected for the current work.
4. Interaction Strategy: Advisor, Collaborator, or Executor.

Do not infer one axis from another.

A developer may use Advisor behavior. A Brownfield project may run a Feature or Bugfix workflow. Executor behavior must not bypass QA.

## Selection Precedence

Select workflow in this order:

1. Explicit Studio OS Evolution request -> `evolution`.
2. Existing `.studio/` project with a bounded change -> matching Work Item workflow.
3. Existing `.studio/` project without a new change -> resume stored workflow and stage.
4. Existing codebase without `.studio/` -> `brownfield`.
5. No existing codebase and no `.studio/` -> `greenfield`.

The first matching rule wins.

## Workflow Files

`registry.json` is the machine-readable index.

Each workflow Markdown file defines:

- selection conditions;
- required and conditional stages;
- stage-specific routing conditions;
- completion behavior.

The registry controls paths and ordering. Runtime files control stage behavior.

## Stage Policies

- `required`: run unless already completed with a current accepted artifact.
- `conditional`: run only when its documented condition applies.

Skipping a conditional stage is a routing decision, not a quality-gate override.

## State

Store selected workflow and work type in `.studio/project-state.md`.

Changing an active workflow requires an observable change in work type or explicit user confirmation.

## Completion

When a workflow completes:

1. Update Project Memory and relevant product artifacts.
2. Record the completed stage or Work Item.
3. Recommend the next workflow only when useful.
4. Do not start another workflow automatically.
