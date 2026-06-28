# /studio:start

`/studio:start` — главная точка входа в Studio OS.

Команда не реализует проект и не переходит к следующей стадии автоматически.

Она только диагностирует состояние проекта и предлагает следующий шаг.

## Algorithm

1. Read `README.md`.
2. Read `docs/PRINCIPLES.md`.
3. Read `docs/HOW_IT_WORKS.md`.
4. Read `docs/NAVIGATOR.md`.
5. Check whether the current repository has Studio OS project artifacts:
   - `docs/discovery-summary.md`
   - `docs/project-brief.md`
   - `docs/roadmap.md`
   - `docs/architecture.md`
   - `.studio/active-context.md`
   - `.studio/project-state.md`

## If there are no project artifacts

Treat this as a new project or raw idea.

Ask the user to describe the idea in plain language.

Recommended next step:

`Interview → Discovery`

Do not start implementation.

## If source code exists but no Studio OS artifacts exist

Treat this as an existing project.

Recommended next step:

`Project Analysis`

Analyze the repository structure and create an initial understanding of the project.

Do not rewrite code.

Do not change architecture.

## If Studio OS artifacts exist

Read:

- `.studio/active-context.md`
- `.studio/project-state.md`
- `docs/project-brief.md`, if present
- `docs/roadmap.md`, if present

Then identify:

- current stage;
- missing artifacts;
- next recommended stage.

## Output Format

Return:

```md
# Studio OS Status

## Detected Mode

Greenfield / Brownfield / Existing Studio OS Project

## Current Stage

...

## Existing Artifacts

...

## Missing Artifacts

...

## Recommended Next Step

...

## Need User Confirmation

Yes / No
