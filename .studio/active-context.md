# Active Context

## Current Focus

`v0.5 Distribution And Delivery Assurance` выпущен (`Product Readiness: Ready For Release`, `Release (v0.5.0)` завершён). Активная работа перешла на новый пострелизный Feature Work Item: `work-items/2026-08-07-admin-panel-task-tracing/` — (1) локальная read + comment-write admin-панель над артефактами `.studio/`, `docs/`, `work-items/` без единого вызова модели, и (2) новый Runtime `task-decomposition` плюс Traceability ID, проходящий через Brief -> Roadmap Iteration -> Task -> Development Report -> Validation evidence. Parent Workflow `brownfield` имеет `Return Stage: None` — на выпущенном milestone ничего не в ожидании.

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
