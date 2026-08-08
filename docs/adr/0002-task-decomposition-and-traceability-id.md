# ADR-0002: Runtime Task Decomposition И Схема Traceability ID

Status: Accepted

Date: 2026-08-07

## Context

Между принятой Roadmap-итерацией или решением Architecture и Development в Studio OS сегодня нет ограниченного, оцениваемого артефакта. Development читает acceptance criteria уровня итерации напрямую и сам декомпозирует реализацию без записанной трассировки назад к требованию, которое она удовлетворяет. Это конкретный пробел, обнаруженный при сравнении с внутренним spec-driven инструментом (`sp`), уже используемым в продакшене, который производит ограниченный по часам, трассируемый к требованиям `tasks.md`, встраиваемый в таск-трекер.

В `skill/` нет концепции декомпозиции задач или сквозной трассировки по ID (подтверждено: по этим концептам нет совпадений при поиске по всему `skill/`).

Пользователь явно запросил эту работу: "надо сделать, чтобы в любой [LLM] мог написать открой админку и студия это сделала" — а также, отдельно, пункты 1 и 3 из предложенных улучшений против `sp`: Task Decomposition и сквозную трассировку ID.

## Decision

1. Добавить новую Runtime-стадию `task-decomposition`, зарегистрированную `active` в `skill/workflows/registry.json`, размещённую между Architecture и Development. Она производит `docs/tasks.md` или `work-items/<id>/tasks.md`: список задач, ограниченных ≤8 часами каждая, каждая с ID и явной ссылкой на Acceptance Criterion, который она удовлетворяет.
2. Ввести общую схему Traceability ID, используемую в четырёх существующих Runtime и новом:
   - Briefing нумерует каждый Acceptance Criterion `AC1`, `AC2`, ... в `docs/project-brief.md` / `work-items/<id>/brief.md`.
   - Planning нумерует каждую Roadmap-итерацию `IT1`, `IT2`, ... в `docs/roadmap.md` / `work-items/<id>/roadmap.md`, и записывает, какой `AC<n>` каждая итерация продвигает.
   - Task Decomposition присваивает `T<iteration>.<n>` на каждую задачу (например `T1.1`, `T1.2`), каждая записывает `Satisfies: AC<n>[, AC<m>]`.
   - Development Report записывает `Tasks Completed: T<x>.<y>[, ...]`.
   - Validation evidence записывает `Acceptance Criteria Verified: AC<n>[, ...]` и задачи `T<x>.<y>`, которые произвели эту evidence.

Встраивание в workflow:

- `greenfield`, `brownfield`: стадия `task-decomposition` policy `required`, размещена после `architecture` и перед `development`.
- `work-item-feature`: `task-decomposition` policy `conditional` — выполняется, когда Feature требует несколько оцениваемых единиц; пропускается для одного тривиального изменения с зафиксированной причиной, зеркально тому, как `planning` и `architecture` уже conditional в этом workflow.
- `work-item-bugfix`, `work-item-research`, `work-item-refactor`: не добавлено — эти workflow уже малы и ограничены по конструкции (Bugfix или единичный Refactor редко требует под-декомпозиции); Task Decomposition может быть добавлен позже, если evidence покажет иное.

Схема ID не ретроактивно применяется к уже завершённым артефактам (например, выпущенные v0.5 roadmap/reports сохраняют существующие нарративные ссылки).

## Alternatives

- **Декомпозировать внутри самого Development** — отклонено: сохраняет ту же проблему (нет артефакта, который человек может просмотреть/оценить/раздать до начала реализации) и смешивает "что должно быть верно" с "как это реализовано".
- **Отдельный инструмент вне `skill/`, генерирующий tasks.md из Architecture** — отклонено: создал бы второй источник workflow-логики вне канонического дерева `skill/`, которое `.studio/standards-profile.md` явно определяет как единственное каноническое место реализации Runtime.
- **Произвольные ID, выбираемые ad hoc по каждому проекту** — отклонено: трассируемость требует предсказуемого, grep-able формата; явную схему дёшево определить один раз и обеспечивать структурно.

## Consequences

- `skill/workflows/registry.json` получает одну новую запись Runtime, а три workflow-файла получают по одной новой стадии — аддитивно, ни одна существующая стадия не удалена и не переименована.
- `skill/runtimes/briefing/SKILL.md`, `planning/SKILL.md`, `development/SKILL.md`, `validation/SKILL.md` получают требование нумерации ID в секциях Output — небольшое, обратно совместимое добавление (существующие ненумерованные артефакты остаются валидными; требование применяется вперёд).
- Development и Validation получают небольшую обязанность учёта (записывать, какие `T<x>.<y>` / `AC<n>` были затронуты) взамен на сквозную трассируемость, которой раньше не существовало.

## Affected Scope

`skill/workflows/registry.json`, `skill/workflows/greenfield.md`, `skill/workflows/brownfield.md`, `skill/workflows/work-item-feature.md`, новый `skill/runtimes/task-decomposition/SKILL.md`, `skill/runtimes/briefing/SKILL.md`, `skill/runtimes/planning/SKILL.md`, `skill/runtimes/development/SKILL.md`, `skill/runtimes/validation/SKILL.md`, `templates/`.
