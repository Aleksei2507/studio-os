# Tasks

## Goal

Разбить принятые Architecture-решения (`architecture.md`, ADR-0002) на ограниченные, оцениваемые, трассируемые к Acceptance Criteria задачи перед Development. Planning для этого Work Item был пропущен (нет Roadmap-итераций), поэтому задачи трассируются напрямую к `AC<n>` из `brief.md`, без промежуточного `IT<n>`.

## Traceability Legend

- `AC<n>` — Acceptance Criterion из `work-items/2026-08-07-admin-panel-task-tracing/brief.md`.
- `T<n>` — задача этого файла (без `IT<n>`, т.к. Planning пропущена).
- Потолок задачи: 8ч (Product Decision из Brief); максимум в этом наборе — 3ч.

## Task List

### T1

- Title: Спроектировать и создать Runtime `task-decomposition` (`skill/runtimes/task-decomposition/SKILL.md`) и `templates/tasks.md`
- Satisfies: AC3
- Estimate: 2h
- Dependencies: none
- Definition Of Done: файл существует, следует структуре остальных Runtime-контрактов (Metadata/Goal/Inputs/Procedure/Output/Forbidden/Stop Condition), `templates/tasks.md` создан.

### T2

- Title: Зарегистрировать `task-decomposition` в `skill/workflows/registry.json` и встроить в `greenfield`, `brownfield`, `work-item-feature`
- Satisfies: AC3
- Estimate: 1h
- Dependencies: T1
- Definition Of Done: `registry.json` валиден (JSON.parse проходит), стадия присутствует в трёх workflow-файлах между Interface Design и Development, `test:structure` проходит.

### T3

- Title: Прошить Traceability ID (`AC<n>`/`IT<n>`/`T<n>`) через Briefing, Planning, Development, Validation и их шаблоны
- Satisfies: AC3, AC4
- Estimate: 2h
- Dependencies: T1
- Definition Of Done: каждый из четырёх `SKILL.md` содержит явное правило нумерации/ссылки на ID; `templates/development-report.md` и `templates/validation-report.md` получили соответствующие поля; `test:structure` проходит.

### T4

- Title: Добавить конвенцию `.studio/feedback/` и единую проверку в `skill/core/LOADER.md`
- Satisfies: AC2
- Estimate: 1h
- Dependencies: none
- Definition Of Done: `LOADER.md` содержит секцию Feedback Check (формат файла, `resolved/`, non-blocking surfacing), без дублирования в каждом Runtime.

### T5

- Title: Применить Task Decomposition к этому самому Work Item — этот `tasks.md`
- Satisfies: AC4
- Estimate: 0.5h
- Dependencies: T1, T2, T3
- Definition Of Done: этот файл существует, покрывает все `AC<n>` из Brief (см. Coverage Check), используется как acceptance evidence AC4.

### T6

- Title: Реализовать `scripts/admin-panel/server.ts` — `node:http`, роуты `/api/state`, `/api/artifacts`, `/api/artifact`, `/api/feedback`, `/api/feedback/resolve`, path-traversal guard
- Satisfies: AC1, AC2
- Estimate: 3h
- Dependencies: none
- Definition Of Done: сервер стартует на `127.0.0.1`, отдаёт реальные файлы репозитория, отклоняет пути вне `docs/`, `work-items/`, `.studio/`, пишет `.studio/feedback/` файлы без сетевых/модельных вызовов.

### T7

- Title: Статический UI (`public/index.html`, `styles.css`, `script.js`): дашборд project-state, таймлайн стадий, браузер артефактов, борд Work Items, форма комментария, мини-Markdown рендер
- Satisfies: AC1
- Estimate: 3h
- Dependencies: T6
- Definition Of Done: страница рендерит реальный `project-state.md` этого репозитория; артефакты читаемы без сырого Markdown; комментарий отправляется через форму.

### T8

- Title: `npm run admin` script в `package.json` + структурный тест на path-guard и наличие файлов admin-panel
- Satisfies: AC1, AC5
- Estimate: 1h
- Dependencies: T6
- Definition Of Done: `npm run admin` запускает сервер; новый тест в `tests/structure/` проверяет отклонение traversal-путей и присутствие обязательных файлов; `test:structure` проходит.

### T9

- Title: Прогнать `test:structure`/`test:runtime:dry` и ручной smoke-test панели (реальный `project-state.md`, отправка и resolve комментария)
- Satisfies: AC1, AC2, AC5
- Estimate: 1h
- Dependencies: T2, T3, T4, T7, T8
- Definition Of Done: оба npm-скрипта зелёные; вручную подтверждено, что панель показывает актуальный статус этого Work Item и комментарий действительно попадает в `.studio/feedback/`.

## Coverage Check

- AC1 -> T6, T7, T8, T9
- AC2 -> T4, T6, T9
- AC3 -> T1, T2, T3
- AC4 -> T3, T5
- AC5 -> T8, T9

Все `AC<n>` из `brief.md` покрыты минимум одной задачей. Deferred пуст.

## Deferred

Нет.

## Development Handoff

Порядок реализации: `T1 -> T2 -> T3 -> T4 -> T5` (сначала сам механизм декомпозиции и трассировки, включая dogfood на этом файле), затем `T6 -> T7 -> T8 -> T9` (admin-панель, независима от первой группы, может идти параллельно после T1). Development Report должен зафиксировать `Tasks Completed` по этим ID и `Acceptance Criteria Addressed` по `AC<n>`.
