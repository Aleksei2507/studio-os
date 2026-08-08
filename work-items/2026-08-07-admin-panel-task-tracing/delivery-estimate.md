# Delivery Estimate

## Scope

Admin-панель (read + comment-write) и Task Decomposition Runtime + Traceability ID scheme, как определено в `brief.md` и `architecture.md`.

## Estimate Summary

Диапазон: 12–18 часов эквивалентной работы, один Work Item, без внешних зависимостей. Оценка ориентировочная (модельная реализация в рамках одной сессии, не человеко-часы найма).

## Breakdown By Iteration Or Work Item

- `T1.x` — Task Decomposition Runtime + wiring в registry/workflows: 3–4ч.
- `T2.x` — Traceability ID в Briefing/Planning/Development/Validation + шаблоны: 2–3ч.
- `T3.x` — `.studio/feedback/` конвенция + проверка в `LOADER.md`: 1ч.
- `T4.x` — Dogfood: `tasks.md` для этого самого Work Item новым Runtime: 0.5ч.
- `T5.x` — Admin-панель: сервер + path-guard + статический UI (дашборд, таймлайн, браузер, борд, комментарии): 4–6ч.
- `T6.x` — Тесты (structure/runtime) + ручная dogfood-проверка панели: 1.5–2.5ч.

## Complexity Drivers

- Мини Markdown-рендерер на клиенте (ограниченное подмножество) — не тривиален, но ограничен.
- Path traversal guard для `/api/artifact` должен быть надёжен без внешней библиотеки.
- Правки четырёх существующих Runtime-контрактов (Briefing/Planning/Development/Validation) должны остаться обратно совместимыми с уже завершёнными артефактами v0.5.

## Dependencies And Critical Path

`task-decomposition` Runtime и ID scheme — предпосылка для dogfood-шага (`T4.x`), который сам служит acceptance evidence фичи. Admin-панель (`T5.x`) архитектурно независима от `T1–T4` и может строиться параллельно.

## Interface Design, Validation, QA, Migration, And Release Effort

Interface Design пропущена (см. `architecture.md`). Validation/QA этого Work Item выполняются в рамках той же сессии без model-call behavioral trials (детерминированные проверки только). Release отдельно не требуется — доставка через обычный merge в рабочую ветку.

## Operational Cost Drivers

Нет — локальный dev-инструмент и Markdown-контракты, без runtime-инфраструктуры.

## Assumptions

Один разработчик, одна сессия, существующий Node/TypeScript/tsx toolchain уже настроен и работает (подтверждено `package.json`).

## Exclusions

Экспорт задач во внешний трекер, аутентификация панели, ретроактивная простановка ID на артефакты v0.5 — см. Non Goals в `brief.md`.

## Risks

Основной риск — не техническая сложность, а обратная совместимость правок Runtime-контрактов; смягчается тем, что новые поля добавляются как необязательные для уже существующих (pre-ADR-0002) артефактов.

## Confidence

Confidence: High

## Re-estimation Triggers

Если потребуется экспорт в конкретный внешний трекер (Jira/Kaiten) — отдельная оценка вне текущего Work Item.
