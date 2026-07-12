# Studio OS Runtime Specification

Runtime Specification defines the authoring and loading contract for Studio OS Runtime folders.

## Folder Structure

Every Runtime lives in its own folder:

```text
skill/runtimes/<runtime-id>/
  SKILL.md
  references/
    patterns.md
    anti-patterns.md
    examples.md
```

Only `SKILL.md` is required. Create reference files only when they remove meaningful detail from the required contract.

## Required SKILL.md Content

Each Runtime `SKILL.md` must contain YAML frontmatter with:

- `name`
- `description`

The body must define:

1. Metadata.
2. Goal.
3. Inputs.
4. Required decisions or understanding.
5. Runtime procedure.
6. Forbidden behavior.
7. Output.
8. Project Memory update.
9. Handoff.
10. Stop condition.
11. Completion checklist.

## Planned Runtime Exception

A planned Runtime may contain only valid skill metadata, a title, and `Status: Work in progress.` while its full contract is being developed.

Mark it as `planned` in `skill/workflows/registry.json`.

Loader must stop when a workflow reaches a planned Runtime. A planned Runtime must not produce artifacts or claim completion.

## Mandatory Contract

Keep normative rules in `SKILL.md`:

- stage boundaries;
- required inputs and outputs;
- `MUST` and `MUST NOT` behavior;
- quality gates;
- memory updates;
- stop condition.

Do not move a critical prohibition into an optional reference.

Stage-specific rules remain stage-specific. For example, choosing a stack is forbidden in Briefing but expected in Architecture.

## Optional References

Use references for conditional detail:

- `patterns.md`: recommended decision and conversation patterns;
- `anti-patterns.md`: detailed failure examples and recovery guidance;
- `examples.md`: longer examples that are not needed for every run.

`SKILL.md` must say exactly when each reference should be read.

Keep references one level below `SKILL.md`. Do not create reference chains.

## Loading Contract

Before running a Runtime, load only:

1. `skill/core/INVARIANTS.md`.
2. Stored Project Memory.
3. The selected workflow.
4. The active Runtime `SKILL.md`.
5. Optional Runtime references required by the current situation.

Do not load all Runtime files or all user documentation at startup.

## Workflow Independence

A Runtime performs one responsibility and must not encode a complete project lifecycle.

Workflow files decide:

- when the Runtime runs;
- which Runtime precedes it;
- which Runtime follows it;
- whether it is required or conditional.

## Capability Independence

A Runtime may declare required capabilities such as external research, codebase analysis, implementation, or browser QA.

Describe the capability, not a vendor-specific tool. Adapters decide how Codex, Claude, or another environment supplies it.

If a required capability is unavailable, stop and report the limitation instead of pretending the work was completed.

## Localization

Use `Project Language` from `.studio/project-state.md`.

If Project Memory does not exist, use the language of the initial project request. Ask one short question only when the language is unclear.

Do not mix languages in `docs/` or `.studio/` unless the user explicitly changes Project Language.

## Interaction Layer

Read `skill/core/INTERACTION.md` before asking questions, making recommendations, or executing changes.

Interaction strategy changes explanation, challenge, and autonomy. It does not change Runtime boundaries or workflow gates.

## Compatibility Entries

Legacy files under `skill/*.md` may point to canonical Runtime folders. They must remain small and contain no duplicate Runtime rules.
