# Project Memory

Studio OS хранит знания о проекте в самом проекте.

## Current State

Текущее состояние хранится в:

docs/
.studio/

## Change History

История изменений хранится в:

work-items/

Каждое изменение представляет собой отдельный жизненный цикл.

Например:

work-items/
    2026-07-05-favorites/
    2026-07-20-dark-mode/

Внутри каждого изменения могут находиться:

- request.md
- brief.md
- roadmap.md
- architecture.md
- qa-report.md
- summary.md

После завершения изменения Studio OS обновляет:

- docs/project-brief.md
- docs/roadmap.md
- docs/architecture.md
- .studio/active-context.md
- .studio/project-state.md

Таким образом проект всегда содержит актуальную информацию о себе.
