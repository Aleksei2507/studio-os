# Active Context

## Current Focus

`v0.6.0` выпущен и опубликован (2026-08-13): https://github.com/Aleksei2507/studio-os/releases/tag/v0.6.0 — Task Decomposition Runtime, Traceability ID, admin-панель с вкладкой Traceability, Feedback Check. Work Item `work-items/2026-08-07-admin-panel-task-tracing/` завершён (`Status: Completed`). Parent Workflow `brownfield` имеет `Return Stage: None` — ничего в ожидании, следующий шаг определяет пользователь.

При первом прогоне `release.yml` для `v0.6.0` найден реальный баг упаковки: блэклист `scripts export-ignore` + override `scripts/admin-panel -export-ignore` в `.gitattributes` не работал — `git archive` обрезает всё поддерево по атрибуту родительской директории и не пересматривает override вложенного пути (подтверждено `git check-attr` — пусто для файлов внутри `scripts/admin-panel`). Итоговый архив остался бы без admin-панели. Поймано RC-гейтом (`release:build`'s `assert.deepEqual` архива против манифеста), не пользователем — fail-closed сработал по назначению. Исправлено точечным списком `export-ignore` для конкретных dev-only путей под `scripts/` вместо блэклиста+override; тег `v0.6.0` был force-move на исправленный коммит с явного согласия пользователя (старый GitHub Release под этим тегом не публиковался, force-push ничего не сломал наружу).

Retrospective (первая с начала проекта) завершена 2026-08-13. Артефакт: `.studio/runtime-retrospective.md`. Ключевые наблюдения: пользователю понравилась прозрачность рассуждений о том, что стоит/не стоит добавлять; мешал плотный технический жаргон в объяснениях — нужно писать проще, чтобы понимал нетехнический человек; отдельных изменений пользователь не запросил. Найдены два реальных технических паттерна-риска: (1) Project Language дважды нарушался и ловился только пользователем, не автоматикой, пока не добавили явный чек; (2) оба реальных бага (symlink, `.gitattributes`) находились поздно — на ручном/CI прогоне, а не заранее автотестами. Next Recommended Stage: Evolution (не начата — ждёт подтверждения пользователя, Retrospective сама proposals не создаёт).

Исторический контекст поставки v0.5 ниже сохранён для справки; это не активный фокус.

## Work Item: admin-panel-task-tracing

- Briefing outcome: Go, High confidence. Brief — `work-items/2026-08-07-admin-panel-task-tracing/brief.md`.
- Подтверждённый MVP scope: (1) локальная read + comment-write admin-панель, без вызовов модели, без новых runtime-зависимостей по умолчанию; (2) новый Runtime `task-decomposition`, производящий задачи ≤8ч с ID, встроенный между Architecture и Development в `greenfield`/`brownfield`/`work-item-feature`; общий Traceability ID через Brief -> Roadmap Iteration -> Task -> Development Report -> Validation evidence; единая проверка `.studio/feedback/` на уровне Loader вместо дублирования по каждому Runtime.
- Non Goals: без БД/аутентификации/real-time синхронизации, без вызовов модели из панели, без экспорта в таск-трекер, без ретроактивной простановки ID на выпущенные артефакты v0.5.
- Product Decisions: потолок задачи по умолчанию 8ч; Task Decomposition `conditional` в `work-item-feature`, `required` в полном lifecycle `greenfield`/`brownfield`; проверка feedback централизована в `skill/core/LOADER.md`.
- Planning пропущена (зафиксировано в Completed Stages) — scope не требует multi-iteration секвенирования сверх того, что уже перечислено в Brief.
- Фича завершена: Runtime `task-decomposition` построен и продогфужен на себе самом (`tasks.md`, T1-T9, AC1-AC5 покрыты); admin-панель построена (`scripts/admin-panel/`) и проверена вживую против реальных `.studio/`/`docs/`/`work-items/` этого репозитория; Traceability ID схема прошита через Briefing/Planning/Development/Validation; добавлены `.studio/feedback/` + проверка в Loader.
- Validation PASS (67/67 structure, 153/153 runtime dry, живой HTTP smoke-test). QA PASS, без блокеров. Product Outcome PASS, все 5 AC VERIFIED.
- Первый инкремент закоммичен (`f34474d`), без co-author трейлера — по явной инструкции пользователя для коммитов этой сессии.

### Дополнение: дистрибуция (2026-08-08)

- Пользователь подтвердил, что scope должен распространяться на установленные копии плагина, не только на этот checkout (см. ADR-0003) — выбрал "Тоже и в установленном виде" на прямой вопрос, поскольку `scripts/` был под `forbiddenPrefixes`, а установленная копия не содержит `package.json`/`tsx`.
- `scripts/admin-panel/server.ts` переписан в `server.js` (чистый Node, без зависимостей); `createAdminServer(workspaceRoot)` теперь отвязан от `STUDIO_OS_ROOT`; `main()` читает `--workspace <path>`.
- `scripts/admin-panel` + новый `commands/` добавлены в `includeTrees`; единая широкая запись `"scripts"` в `forbiddenPrefixes` заменена на десять точечных путей; `.gitattributes` получил соответствующий `-export-ignore` override.
- Добавлены `commands/admin.md` (`/studio-os:admin`, объявлен через `"commands"` в `.claude-plugin/plugin.json`) и третий `defaultPrompt` в Codex.
- Добавлено host-agnostic распознавание "Local Tooling Requests" в `adapters/universal/BOOTSTRAP.md` + `skill/core/CONVERSATION_ROUTER.md`.
- При ручном end-to-end тестировании найден и исправлен реальный баг (не пойман начальным автоматическим набором тестов): проверка `isMain` молча ломалась на любом symlink-пути входа (macOS `/tmp` -> `/private/tmp`; правдоподобно и для реальных plugin cache) — `main()` не вызывался, exit 0, ноль вывода. Исправлено сравнением через `realpathSync`; добавлен регрессионный тест через настоящий дочерний процесс и настоящий symlink.
- Validation PASS: 71/71 structure (было 67 до этой сессии, +3 от первого инкремента, +1 symlink-регрессия), 153/153 runtime dry, плюс сквозная симуляция с нуля (скопировал `admin-panel/` за пределы репозитория, запустил голым `node`, нацелил `--workspace` на несвязанную временную папку) — подтвердила, что сценарий установленного плагина реально работает end-to-end.
- Current Stage: Release — ожидает явной авторизации пользователя на коммит; изменения не закоммичены в рабочем дереве. Та же no-co-author конвенция применяется, если не сказано иное.
- Дважды в этой сессии писал docs/adr и .studio/active-context.md на английском вместо Project Language — пользователь поймал оба раза. В `skill/core/INVARIANTS.md`, секция `## Completion`, добавлен общий пункт: проверять Project Language в момент записи каждого артефакта под `docs/`/`.studio/`/`work-items/`, не полагаясь на более раннюю проверку в разговоре — тот же паттерн "один общий чек", что и Feedback Check в Loader, вместо дублирования по каждому Runtime.
- Этот инкремент закоммичен и запушен (`a78096d`, без co-author трейлера); `feature/init-studio-os` смержена в `main`, обе ветки синхронизированы с origin.

### Дополнение: traceability-consistency test (2026-08-10)

- По запросу пользователя ("через студию подумай, чем еще можно улучшить") проведён самоанализ Studio OS по образцу Briefing (Strong/Mixed/Weak evidence). Найден и подтверждён grep'ом реальный пробел: Traceability ID (`AC<n>`/`T<n>`) нигде не проверялись структурно — только прозой, опечатка или выдуманный ID молча не ловились.
- Добавлен `tests/structure/traceability-consistency.test.ts`: для каждого Work Item с пронумерованными `AC<n>` в `brief.md` проверяет, что (1) каждый `Satisfies:` в `tasks.md` ссылается на существующий `AC<n>`; (2) `Tasks Completed` в `development-report.md` ссылается только на `T<n>`, реально определённые в `tasks.md`; (3) `Acceptance Criteria Addressed`/`Acceptance Criteria Verified` в `development-report.md`/`validation-report.md` ссылаются только на существующие `AC<n>`. Понимает и списки через запятую, и компактные диапазоны (`AC1–AC5`, `T1-T9`).
- Артефакты без нумерации (например `docs/project-brief.md` дорелизного v0.5) намеренно пропускаются — без ретроактивной простановки ID, как и решено в Brief этого Work Item.
- Проверено вручную: временная порча `AC5` -> `AC9` в `validation-report.md` детектируется тестом с понятной ошибкой; после отката `npm run test:structure` снова 76/76 PASS.
- Остальные два пункта из того же анализа (default-policy Task Decomposition в `work-item-feature`, отдельный Traceability-вид в admin-панели) сознательно не начаты — по объёму это отдельный Work Item, ждут приоритизации.

### Дополнение: живая проверка Feedback Check (2026-08-10)

- Известное ограничение из `development-report.md` («`.studio/feedback/` ни разу не прошёл через реальный ход Runtime») закрыто живым прогоном, а не только чтением кода: `npm run admin` поднят, реальный комментарий отправлен через `POST /api/feedback`, в следующем ходу Runtime найден и показан по контракту `skill/core/LOADER.md` -> Feedback Check (артефакт, excerpt, informational/non-blocking), затем резолвлен через `/api/feedback/resolve` (файл переехал в `.studio/feedback/resolved/`).
- Тестовый файл и сама папка `.studio/feedback/` удалены после проверки (не отслеживались git) — не являются реальной обратной связью, тот же паттерн, что и ранее для AC2.
- Также закрыт отдельный старый хвост вне scope этого Work Item: неидемпотентная публикация в `.github/workflows/release.yml` (`gh release create` падал на повторном прогоне по тому же тегу) — исправлено на `gh release view` + `gh release upload --clobber` при существующем релизе; закоммичено отдельно (`b96d820`, без co-author).

### Дополнение: пункты #2 и #4 самоанализа (2026-08-10)

- Пункт #2 («Task Decomposition `conditional` в `work-item-feature` — субъективная оценка модели в моменте»): на пересмотре сама условная политика признана согласованной с общим паттерном Studio OS (Research/Design Strategy/Interface Design работают так же — `conditional` + прописанное условие + явная причина пропуска в prose), менять её саму не стали. Вместо этого закрыт реальный риск позади формулировки: `tests/structure/traceability-consistency.test.ts` теперь требует, чтобы Development Report называл хотя бы один `AC<n>` в "Acceptance Criteria Addressed", даже когда `tasks.md` не существует (Task Decomposition пропущена) — трассируемость к Brief не может молча исчезнуть вместе со списком задач. Проверено вручную негативным сценарием (временно опустошённая секция → тест падает с понятной ошибкой; после отката снова 76/76 PASS).
- Пункт #4 (admin-панель рендерила `tasks.md` тем же generic Markdown, без вида покрытия AC/статуса): добавлен `GET /api/traceability` в `scripts/admin-panel/server.js` (`buildTraceability`, экспортирована для тестов) — парсит `brief.md` (AC<n> + текст), `tasks.md` (задачи, `Satisfies`, оценка), `validation-report.md` (verified-статус по AC) активного Work Item из `.studio/project-state.md`. Новая вкладка "Traceability" в UI (`index.html`/`script.js`/`styles.css`) рендерит таблицу AC -> покрывающие задачи -> verified/pending/uncovered, и таблицу задач, с переходом в Artifacts по клику. Read-only, без новых путей записи — не противоречит Non Goals исходного Brief (никакой интеграции с трекером, никакого вызова модели).
- Оба пункта покрыты тестами (`tests/structure/traceability-consistency.test.ts` — новый негативный кейс; `tests/structure/admin-panel.test.ts` — 3 новых теста: no active work item, AC coverage build, живой HTTP-запрос `/api/traceability`) и вручную (`npm run admin`, curl против реального repo state). `npm run test:structure` 79/79, `npm run test:runtime:dry` 153/153.
- Оформлено как продолжение того же Work Item (`admin-panel-task-tracing`) без новой Briefing-итерации — низкий риск, аддитивные read-only изменения к уже принятому MVP scope, тот же паттерн, что и предыдущие "Дополнение"-записи в этой сессии.

## Confirmed Facts

- Target Milestone: `v0.5 Distribution And Delivery Assurance` из `docs/project-brief.md`.
- Accepted Development Roadmap содержит пять обязательных Epics; удаленных или re-scoped increments нет.
- Epic 1 имеет Development, повторную Validation `PASS` и QA reassessment `PASS`; manifest-driven candidate boundary является `VERIFIED` evidence.
- Epic 2 реализует versioned critical suite `v0.5-critical-lifecycle` с ровно десятью принятыми scenario IDs и одной product-risk responsibility на сценарий.
- Runner поддерживает `--suite` как canonical bounded selector, сохраняет declared order и portable suite identity, запрещает смешивание с другими selectors и custom test directories.
- Epic 2 Validation: `PASS`; focused critical tests 12/12, repository runner 108/108, full Runtime dry 153/153, scoped critical dry 10/10 и release metadata check `PASS`.
- Epic 2 QA: `PASS`; accepted risk coverage, maintainer preflight UX, fixture/replay boundaries, scope honesty и cost recovery проверены без model calls.
- Epic 2 Product Outcome: `CONTINUE`; Epics 1 и 2 `VERIFIED`.
- Epic 3 Development добавил canonical `tests/installed-adapters/matrix.json` с шестью exact cases: три adapters, каждый в Greenfield и Brownfield mode.
- Epic 3 Validation: `PASS`; все шесть installed-host cases проверены (evidence run `run-20260806-epic3`).
- Epic 3 QA: `PASS`; девять сценариев без model calls; Evidence Contract, adapter isolation, portable evidence, tooling integrity и acceptance criteria coverage подтверждены.
- Epic 3 Product Outcome: `CONTINUE`; Epics 1, 2 и 3 `VERIFIED`; прогресс `3/5`.
- Все три adapter paths (Codex marketplace, Claude Code marketplace, Universal ZIP) подтверждают правильный Studio OS Root, Greenfield Interview boundary, Brownfield onboarding boundary и source preservation.
- Epic 4 Development добавил compatibility baseline contract: `tests/compatibility/baseline.json` (2 combinations), `scripts/compatibility-baseline/contracts.ts` (types, classifiers, parsers), `scripts/compatibility-baseline/aggregator.ts` (aggregation, summary writing), `scripts/check-compatibility-baseline.ts` (CLI entry), `tests/compatibility/summary.json` (initial Unknown state), structure и runner тесты, package.json scripts, MANUAL_TESTING.md section.
- Epic 4 Validation: `PASS`; все тесты (structure + runner) проходят, CLI dry-mode работает, все поля соответствуют BEHAVIORAL_ASSURANCE.md контракту.
- Epic 4 QA: `PASS`; десять QA сценариев без model calls: baseline schema enforcement, classification algebra, trial record immutability, invalid trial handling, workspace mutation protocol, summary portability, CLI usability, gitignore coverage, MANUAL_TESTING.md documentation, package.json scripts.
- Epic 4 Product Outcome: `CONTINUE`; deterministic tooling принято; Epics 1–4 `VERIFIED`; прогресс `4/5`.
- Compatibility classification rules: Compatible=3/3, Flaky=1-2/3, Incompatible=0/3 или workspaceMutationViolation=true, Unknown=<3 valid trials.
- Zero-retry policy и explicit LLM cost gate (`--confirm-llm-cost`) сохраняются для всех behavioral trials.
- Behavioral trials (~132 model calls per combination) требуют отдельной explicit authorization; не выполнены как часть Epic 4 Development/Validation.
- Trial records gitignored под `test-results/` (line 66 `.gitignore`); checked-in summaries не содержат machine paths, transcripts, secrets.
- Evidence checker запрещает machine-specific, temporary, Downloads, attachment-cache и secret-like material.
- Architecture и Project Standards Profile покрывают весь milestone, включая critical-suite contract, existing Runtime harness, zero-retry policy, privacy и release boundaries.
- Interface Design для Epics 3–5 не требуется; public site и Design System Profile не меняются.

## Current Decisions

- Epic 4 принят; Product Outcome issued `CONTINUE`; прогресс `4/5`.
- Product Readiness сохраняется `Not Ready`; четыре accepted increments не делают milestone готовым к Release.
- Current Increment: `Epic 5 - v0.5 Release Candidate`; status `Planned`; progress `4/5`.
- Следующий шаг: Development Epic 5 только после явного подтверждения пользователя.
- Epic 5 scope: aggregate release evidence (package, installed-adapter, compatibility), align manifests, complete issue triage, conduct final Validation/QA/Product Outcome; no publication without separate Release authorization.
- Behavioral trials для Epic 4 (compatibility baseline execution) могут выполняться параллельно с Epic 5 Development, но требуют explicit cost authorization (`--confirm-llm-cost`).
- Raw host transcripts остаются local/ignored; persistent evidence содержит только bounded observations и portable identifiers.
- Tag push, GitHub Release и deployment не авторизованы.

## Unknowns

- Доступность authenticated host sessions и достаточного compute для трёх independent valid trials per combination (behavioral trials Epic 4).
- Candidate revision и новая неиспользованная semantic version для публикации (Epic 5).
- Milestone-relevant GitHub issues и их alignment с current architecture (Epic 5 scope).
- Статус behavioral trial execution: combination `remote-o4-mini` и `local-llama3.2` пока не имеют trial records; `tests/compatibility/summary.json` содержит placeholder Unknown state.
- Общий Runtime guard для case-insensitive artifact path collisions остается вне принятого v0.5 scope.

## References

- `docs/project-brief.md`
- `docs/development-roadmap.md`
- `docs/architecture.md`
- `.studio/standards-profile.md`
- `docs/BEHAVIORAL_ASSURANCE.md`
- `work-items/2026-08-07-admin-panel-task-tracing/request.md`
- `docs/runtime-testing.md`
- `tests/runtime/critical-suite.json`
- `tests/installed-adapters/matrix.json`
- `tests/compatibility/baseline.json`
- `tests/compatibility/summary.json`
- `scripts/compatibility-baseline/contracts.ts`
- `scripts/compatibility-baseline/aggregator.ts`
- `scripts/check-compatibility-baseline.ts`
- `scripts/check-installed-adapters.ts`
- `docs/MANUAL_TESTING.md`
- `scripts/runtime-testing/suite.ts`
- `.studio/telemetry/development-report.md`
- `.studio/telemetry/validation-report.md`
- `docs/qa-report.md`
- `.studio/telemetry/product-outcome-report.md`
- `test-results/installed-adapters/run-20260806-epic3.json`
