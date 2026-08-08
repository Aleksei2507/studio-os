# Project Brief

## Executive Summary

Два developer-experience дополнения к Studio OS, оба направлены на снятие трения, обнаруженного при dogfooding раннтайма: (1) сырые Markdown-артефакты неудобно читать, и нет канала для обратной связи, которую Runtime реально увидит; (2) нет артефакта между принятой roadmap-итерацией и полной реализацией, который разработчик может оценить, раздать или трассировать к требованию — пробел, названный при сравнении с внутренним spec-driven инструментом (`sp`), уже используемым в продакшене в другой команде.

## Studio Assessment

Outcome: Go

Confidence: High

## Assessment Evidence

### Strong

- Каждый текущий артефакт (`project-state.md`, `active-context.md`, `docs/*.md`, `work-items/<id>/*.md`, `.studio/telemetry/*.md`) уже является обычным файлом по детерминированному пути — viewer'у не нужен новый протокол, только читатель.
- Репозиторий уже поставляет zero-dependency статический сайт (`website/`) и Node/TypeScript tooling (`scripts/`) — обе целевые возможности расширяют проверенные in-repo паттерны, а не вводят новый стек.
- Пробел в task-level декомпозиции и трассировке конкретен и продемонстрирован: `grep` по `skill/` на концепты task-decomposition или traceability ничего не находит; Development читает acceptance criteria уровня roadmap напрямую без промежуточной оцениваемой единицы.

### Mixed

- "Удобно читать" и "удобно взаимодействовать" субъективны; acceptance criteria ниже ограничивают это конкретным, проверяемым поведением (рендерит реальный project state, принимает комментарий, создаёт файл), а не оценкой качества дизайна.

### Weak Or Unknown

- Ни один внешний пользователь ещё не оценил, действительно ли admin-панель или артефакт Task Decomposition изменят восприятие Studio OS коллегами пользователя по сравнению с `sp`. Этот brief определяет объём поставки, а не исход будущего сравнения.

## Recommendation

Строить обе возможности в объёме MVP Scope ниже. Держать admin-панель строго read + comment-write с нулевыми вызовами модели, а Task Decomposition — стадией Runtime (Markdown-контракт), а не новым слоем логики вне `skill/` — оба варианта сохраняют существующую model-agnostic, filesystem-native архитектуру вместо добавления параллельной системы.

## What Would Change The Decision

Свидетельство, что любая из возможностей требует production-зависимости, фонового сервиса или вызовов модели внутри панели, изменило бы подход (не решение Go) — Architecture должна была бы пересмотреть zero-dependency ограничение.

## Product Vision

Артефакты Studio OS должны быть так же легко инспектируемы и actionable, как спеки настоящего продукта, без ослабления свойства, что любой LLM-хост может выполнять сам workflow.

## Product Positioning Or Current Product Direction

Current Product Scope (Brownfield): Studio OS — filesystem-native, model-agnostic Runtime-система; всё workflow-состояние и артефакты уже живут как Markdown/JSON-файлы под `.studio/`, `docs/`, `work-items/`.

Stable Areas: Runtime-контракты под `skill/`, adapter entry-контракты, формат файлов Project Memory.

Legacy Areas: не затронуты этим Work Item.

Product Boundaries: этот Work Item добавляет viewer/инструмент и одну новую Runtime-стадию; не меняет Project Mode detection, Interaction Layer или продуктовую ответственность существующих Runtime.

Technical Boundaries: по умолчанию без новых production/runtime зависимостей; каноническая Runtime-логика остаётся под `skill/`.

## Problem Statement

1. Артефакты Studio OS сегодня читаемы только как сырой Markdown; нет структурированного способа просматривать статус проекта или оставлять обратную связь, которую увидит следующий ход Runtime.
2. Между принятой roadmap-итерацией/архитектурным решением и Development нет ограниченного, оцениваемого, трассируемого к требованию артефакта задачи — Development сейчас сам декомпозирует итерацию без записанной трассировки к требованию, которое она удовлетворяет.

## Target Users

Мейнтейнер и любая команда, оценивающая или использующая Studio OS в повседневной работе над реальным проектом, включая команды, сравнивающие его со spec-driven инструментом, который уже производит отслеживаемые, трассируемые задачи.

## Product Value

- Более быстрый, структурированный обзор состояния проекта и артефактов вместо открытия сырых файлов по одному.
- Канал обратной связи, переживающий чат-сессии и разные LLM-хосты.
- Конкретный, оцениваемый список задач с Traceability ID, который может использовать разработчик (или таск-трекер) — закрывает разрыв паритета с `tasks.md` у `sp`.

## MVP Scope Or Current Product Scope

1. **Admin-панель**
   - Локальный Node-сервер (`npm run admin`), без новых runtime-зависимостей.
   - Рендерит: дашборд project-state (Mode, Stage, Readiness, Increment Progress), таймлайн стадий (Completed Stages), браузер артефактов (`docs/`, `work-items/<id>/`), борд Work Items.
   - Поле комментария на каждый артефакт; отправка пишет Markdown-файл под `.studio/feedback/`.
   - Нет вызовов модели, нет исполнения стадий, нет иного пути записи кроме файла комментария.
2. **Task Decomposition + Traceability ID**
   - Новый Runtime `task-decomposition` между Architecture и Development в workflows `greenfield`, `brownfield`, `work-item-feature`.
   - Производит `docs/tasks.md` или `work-items/<id>/tasks.md`: задачи ограничены ≤8 часами, каждая с ID и явной ссылкой на Acceptance Criterion/требование, которое она удовлетворяет.
   - Общая схема Traceability ID связывает Brief -> Roadmap Iteration -> Task -> Development Report -> Validation evidence.
   - Единая общая проверка на уровне Loader (не дублирование в каждом Runtime) показывает активному Runtime непогашенные записи `.studio/feedback/`.

## Non Goals

- Никакой БД, аутентификации, multi-user real-time синхронизации для admin-панели.
- Никакого исполнения стадий, никакого вызова LLM/агента из панели.
- Никаких изменений в Project Mode detection, Interaction Layer или продуктовой ответственности существующих Runtime.
- Никакой ретроактивной простановки Traceability ID на уже выпущенные артефакты `v0.5`.
- Никакой интеграции с таск-трекером (Jira/Kaiten/и т.п.) в этом Work Item — `tasks.md` остаётся переносимым Markdown-артефактом; экспорт — future scope при запросе.

## User Scenarios

1. Мейнтейнер запускает `npm run admin`, открывает дашборд и видит реальную текущую стадию и Work Item этого репозитория без ручного открытия файлов.
2. Мейнтейнер читает артефакт в панели, оставляет комментарий; следующий ход Runtime (в любом LLM-хосте) показывает этот комментарий перед продолжением.
3. После того как Architecture приняла дизайн, Task Decomposition производит ограниченный список задач с ID; ID каждой задачи также появляется в Development Report и Validation evidence, которые её закрывают.

## Constraints

- По умолчанию без новых production/runtime зависимостей (только Node built-ins): соответствует принятой философии стека, хотя формальный freeze зависимостей `v0.5` формально не распространяется на пострелизную работу.
- Admin-панель не должна становиться альтернативным источником workflow-логики; каноническая логика остаётся под `skill/`.
- Формат Traceability ID не должен требовать переписывания уже завершённых артефактов.

## Acceptance Criteria

- AC1: `npm run admin` запускает сервер, корректно рендерящий реальное содержимое `.studio/project-state.md` этого репозитория.
- AC2: Отправка комментария в панели создаёт файл под `.studio/feedback/` без сетевого/модельного вызова.
- AC3: `skill/workflows/registry.json` содержит `active` Runtime `task-decomposition`, встроенный в `greenfield`, `brownfield`, `work-item-feature`.
- AC4: Task Decomposition, применённый к этому самому Work Item, производит `work-items/2026-08-07-admin-panel-task-tracing/tasks.md` с ID, трассируемыми к Acceptance Criteria этого Brief.
- AC5: `npm run test:structure` и `npm run test:runtime:dry` проходят после всех изменений.

IDs добавлены задним числом по правилу `task-decomposition` Runtime (Brief создан до появления этого Runtime в том же Work Item) — проза критериев не менялась, только пронумерована.

## Risks

- Расползание scope в сторону полноценного веб-приложения (auth, БД) нарушило бы zero-dependency, model-agnostic ограничение — смягчено Non Goals выше.
- Слишком агрессивная проверка feedback на уровне Loader может прерывать несвязанные Runtime устаревшими комментариями — смягчено требованием явного resolved/archived состояния в Architecture.

## Assumptions

- Мейнтейнер — единственный пользователь admin-панели пока (локально, одна машина).
- 8 часов — приемлемый потолок задачи по умолчанию; настраивается позже без изменения механизма.

## Open Questions

Нет блокирующих для Planning; два прежних Unknown разрешены выше как Product Decisions.

## Product Decisions

- Потолок задачи по умолчанию — ≤8 часов на задачу (соответствует ориентиру `sp`, названному пользователем).
- Политика стадии Task Decomposition: `conditional` в `work-item-feature` (пропускается для тривиальных Work Item), `required` в полном lifecycle `greenfield`/`brownfield`.
- Проверка feedback находится один раз в `skill/core/LOADER.md`, не дублируется по каждому Runtime.
