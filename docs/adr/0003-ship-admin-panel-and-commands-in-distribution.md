# ADR-0003: Поставка Admin-Панели И `commands/` В Дистрибутиве

Status: Accepted

Date: 2026-08-08

## Context

`scripts/admin-panel/` (локальный read + comment-write инструмент над `.studio/`, `docs/`, `work-items/`) был построен в рамках ADR-0002 и изначально работал только когда Studio OS Root равен Target Workspace — случай self-hosting, когда кто-то разрабатывает сам Studio OS. `scripts/` целиком находится под `forbiddenPrefixes` в `scripts/release-manifest.json` (fail-closed allowlist из ADR-0001), и ни один установленный экземпляр не содержит `package.json` или `node_modules` — поэтому панель была недостижима для реального целевого сценария: пользователь, установивший Studio OS как плагин на свой продукт, хочет открыть панель там.

Пользователь явно запросил эту работу: "надо сделать, чтобы в любой [LLM] мог написать открой админку и студия это сделала" — подтверждено, что это включает случай установленного плагина, а не только этот checkout, после того как ему был показан trade-off (затрагивает `forbiddenPrefixes`, осознанный security-ориентированный deny-list).

## Decision

1. **Переписать `scripts/admin-panel/server.ts` как чистый `scripts/admin-panel/server.js`** — без TypeScript, без `tsx`, только `node:*` built-ins. Это более жёсткое ограничение, чем "без новых зависимостей": установленная копия не поставляет вообще никакого `package.json`, поэтому нельзя полагаться ни на что, кроме голого `node`.
2. **Отвязать обслуживаемый проект от расположения самого инструмента.** `STUDIO_OS_ROOT`/`PUBLIC_DIR` (где живёт код и статика) и корень workspace (чьи `.studio`/`docs`/`work-items` рендерятся) теперь независимы. `createAdminServer(workspaceRoot)` принимает workspace явным параметром; `main()` резолвит его из аргумента `--workspace <path>`, по умолчанию `process.cwd()`. Self-hosting (этот репозиторий) — случай, когда они совпадают.
3. **Добавить `scripts/admin-panel` в `includeTrees`** в `scripts/release-manifest.json`, и сузить единую широкую запись `"scripts"` в `forbiddenPrefixes` до десяти конкретных dev-only путей, которые всё ещё обязаны никогда не поставляться (`scripts/adapter-testing`, `scripts/build-release.ts`, `scripts/check-compatibility-baseline.ts`, `scripts/check-installed-adapters.ts`, `scripts/check-release-candidate.ts`, `scripts/compatibility-baseline`, `scripts/release-candidate`, `scripts/release-manifest.json`, `scripts/run-runtime-tests.ts`, `scripts/runtime-testing`). `validateReleaseManifest` отклоняет любой манифест, где запись `includeTrees`/`includeFiles` пересекается с записью `forbiddenPrefixes`, поэтому оба списка не могли одновременно упоминать `scripts` на разной степени детализации — широкую запись пришлось заменить, а не дополнить.
4. **Добавить override в `.gitattributes`**: `scripts/admin-panel -export-ignore` под уже существующим `scripts export-ignore`, чтобы автоматический source-архив тега на GitHub (генерируемый независимо от `build-release.ts`) не расходился молча с официальным release-артефактом.
5. **Добавить `commands/` в `includeTrees`** для новой команды `/studio-os:admin` в Claude Code (тонкий делегатор, без самостоятельной логики — см. правило Bootstrap "Local Tooling Requests").

## Why This Is Safe To Carve Out

`forbiddenPrefixes` существует, чтобы держать вне поставки maintainer-only, потенциально чувствительный или просто нерелевантный для установленных пользователей материал (lifecycle-телеметрия, прочие dev-скрипты, тестовые fixtures). `scripts/admin-panel/` не подпадает под эту причину:

- Не содержит секретов, специфичных для мейнтейнера данных и логики, зависящей именно от этого репозитория — это универсальный рендерер файлового дерева, параметризуемый через `--workspace`.
- Единственная запись на диск — файлы комментариев, авторские пользователем, под `<workspace>/.studio/feedback/`, защищённые тем же guard резолвинга пути (`resolveArtifactPath`), который ограничивает чтение `docs/`, `work-items/`, `.studio/` — покрыто `tests/structure/admin-panel.test.ts`, включая случай, доказывающий, что панель нацелена на произвольный workspace и никогда — на репозиторий, где живёт собственный код инструмента.
- Не делает вызовов модели и не исполняет Runtime/workflow-логику (сохранено из ADR-0002) — поставка не создаёт второй, установленный на стороне плагина источник workflow-поведения.

## Alternatives

- **Оставить dev-only, говорить установленным пользователям отдельно клонировать репозиторий ради панели** — отклонено: обесценивает цель, названную пользователем (сравнение Studio OS с инструментом, уже используемым на их реальных, не-Studio-OS-checkout проектах); никто, оценивающий Studio OS на продуктовом репозитории, не станет дополнительно клонировать и настраивать второй checkout просто чтобы читать артефакты.
- **Поставлять prebuilt/bundled single-file версию, оставить `scripts/` полностью forbidden** — отклонено: добавляет build-шаг и расходящийся генерируемый артефакт ради ~250-строчного файла без зависимостей; излишняя сложность для того, что голый `node` и так запускает напрямую.
- **Расширить гранулярность `forbiddenPrefixes` по всему проекту (по файлу, а не по директории) как общую политику** — отклонено как вне scope: только `scripts/` потребовал разбиения для этого решения; у остальных forbidden-деревьев (`node_modules`, `test-results`, `.studio`, `website`, `docs/adr` и т.д.) сегодня нет сравнимой потребности в частичной поставке.

## Consequences

- В `forbiddenPrefixes` `scripts/release-manifest.json` больше нет единой широкой записи `"scripts"`; любой новый файл, добавленный прямо под `scripts/` (не внутри уже названной поддиректории), не будет автоматически пойман `forbiddenPrefixes`, если кто-то по ошибке также добавит его в `includeTrees` — смягчено тем, что существующие overlap-проверки `validateReleaseManifest` по-прежнему покрывают каждый перечисленный сегодня путь, и тем, что этот список требует осознанных, рецензируемых правок (JSON, не wildcard), чтобы вообще измениться.
- Следующий version bump обязателен, прежде чем какая-либо установленная копия реально получит панель; сам этот ADR ничего не публикует.
- `scripts/admin-panel/server.ts` (TypeScript, зависящий от `tsx`) удалён, а не устарел — есть ровно одна реализация, используемая идентично в dev-checkout и в установленных копиях.

## Affected Scope

`scripts/release-manifest.json`, `.gitattributes`, `tests/structure/release-distribution.test.ts`, `scripts/admin-panel/server.js` (заменяет `server.ts`), `package.json`, `tests/structure/admin-panel.test.ts`, `commands/admin.md`, `adapters/universal/BOOTSTRAP.md`, `skill/core/CONVERSATION_ROUTER.md`.
