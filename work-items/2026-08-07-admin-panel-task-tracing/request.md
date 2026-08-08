# Work Item Request

## Request

Добавить в Studio OS две developer-experience возможности:

1. Локальная, read-mostly admin-панель, которая рендерит артефакты `.studio/`, `docs/` и `work-items/` (project state, таймлайн стадий, браузер артефактов, борд Work Items) вместо чтения сырого Markdown, и позволяет человеку оставлять комментарии, которые записываются как артефакт-файлы для активного Runtime на следующем ходу.
2. Стадия Task Decomposition между Architecture/Planning и Development, превращающая принятый scope в мелкие (ограниченные по часам) задачи, каждая с Traceability ID, который проходит сквозь Brief -> Roadmap Iteration -> Task -> Development Report -> Validation evidence.

## Expected Outcome

- `npm run admin` запускает локальный сервер, рендерящий артефакты Studio OS текущего проекта; человек может читать статус стадии и артефакты без открытия сырых файлов и оставлять комментарий, который попадает в `.studio/feedback/` как обычный Markdown-файл.
- Любой активный Runtime показывает непогашенные `.studio/feedback/*.md` перед продолжением — через одну общую проверку на уровне Loader, а не дублирование в каждом Runtime.
- Новый Runtime `task-decomposition` зарегистрирован в `skill/workflows/registry.json`, встроен в workflows `greenfield`, `brownfield` и `work-item-feature` между Architecture и Development.
- Его вывод (`tasks.md`) использует Traceability ID, который также присутствует в Brief/Roadmap-итерации, которую он закрывает, и в Development Report и Validation evidence, которые его закрывают.

## Work Type

Feature

## Selected Workflow

work-item-feature

## Product Fit

Обе возможности снимают трение, названное пользователем: сырой Markdown неудобно читать/комментировать, и в Studio OS сейчас нет артефакта между roadmap-итерацией и полной реализацией, который разработчик может оценить, раздать или трассировать к требованию — пробел, обнаруженный при сравнении с внутренним spec-driven инструментом (`sp`), уже используемым командой пользователя.

## Affected Artifacts

- `skill/core/LOADER.md` (шаг проверки feedback)
- `skill/workflows/registry.json`, `skill/workflows/greenfield.md`, `skill/workflows/brownfield.md`, `skill/workflows/work-item-feature.md`
- Новый `skill/runtimes/task-decomposition/SKILL.md`
- `skill/runtimes/briefing/SKILL.md`, `skill/runtimes/planning/SKILL.md`, `skill/runtimes/development/SKILL.md`, `skill/runtimes/validation/SKILL.md` (поле Traceability ID)
- `templates/` (новый шаблон `tasks.md`; поле ID в существующих релевантных шаблонах)
- Новый `scripts/admin-panel/` (сервер + статический UI), `package.json` (новый скрипт `admin`)
- `docs/architecture.md` (запись обоих дополнений)

## Known Constraints

- Принятый Project Standards Profile (`.studio/standards-profile.md`) фиксирует: "Новые production или runtime dependencies для v0.5 не приняты." Этот Work Item — пострелизная работа после v0.5, но admin-панель по умолчанию должна оставаться без новых зависимостей (только Node built-ins), пока реальная потребность не заставит иначе — согласуется с существующим стеком TypeScript/Node/tsx и статическим HTML/CSS/JS `website/`.
- Admin-панель должна оставаться строго read + comment-write. Она не должна вызывать модель или оркестрировать стадию Runtime — model-agnostic инвариант Studio OS зависит от того, что чат-сессия остаётся единственным актором, исполняющим workflow-логику.
- Каноническая Runtime-логика находится под `skill/`; admin-панель — это viewer/инструмент, а не альтернативный источник workflow-логики.

## Acceptance Evidence

- `npm run test:structure` и `npm run test:runtime:dry` проходят после изменений registry/workflow.
- `npm run admin` отдаёт страницу, корректно отражающую собственный `.studio/project-state.md` этого репозитория (dogfood evidence).
- Комментарий, отправленный через панель, создаёт файл под `.studio/feedback/` без единого вызова модели.
- Runtime `task-decomposition` производит `work-items/2026-08-07-admin-panel-task-tracing/tasks.md` для этого самого Work Item — используется как acceptance evidence для самой фичи.

## Parent Target Milestone And Current Increment

Target Milestone `v0.5 Distribution And Delivery Assurance` выпущен (Product Readiness: Ready For Release / Published согласно `.studio/project-state.md`). Этот Work Item не переоткрывает и не меняет этот milestone; это новая пострелизная Feature-работа.

## Parent Workflow And Return Stage

Parent Workflow: `brownfield`. Return Stage: None — у родительского lifecycle нет незавершённой стадии; `Next Recommended Stage` был `None` до этого запроса.

## Product Readiness Impact

Нет влияния на выпущенный milestone `v0.5`. Этот Work Item не продвигает и не меняет его Product Readiness.

## Unknowns

- Точный часовой потолок задачи для Task Decomposition (предложение по умолчанию: 8ч, по аналогии с `sp`) — решено в Architecture.
- Должен ли Task Decomposition быть `required` или `conditional` в каждом workflow — решено в Architecture.

## Recommended Next Runtime

`briefing`
