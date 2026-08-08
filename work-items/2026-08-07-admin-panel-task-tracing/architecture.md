# Architecture

## Scope And Inputs

Bounded Work Item architecture — документирует impact двух дополнений, не переписывает существующую систему. Входы: `work-items/2026-08-07-admin-panel-task-tracing/brief.md`, `.studio/standards-profile.md`, `skill/workflows/registry.json`, существующие `skill/runtimes/*/SKILL.md`, `website/` (паттерн статического сайта), `package.json`.

## Studio Delivery And Support Model

Без изменений: Studio OS остаётся ответственным за реализацию и сопровождение через Work Item workflows.

## System Context

Admin-панель — новый локальный инструмент разработчика, читающий Target Workspace того же репозитория, в котором работает Runtime. Task Decomposition — новая стадия внутри существующего Runtime-конвейера. Ни одно дополнение не меняет Project Mode detection, Interaction Layer или существующие Runtime-контракты за пределами перечисленных ниже точек.

## Technology Selection And Alternatives

**Admin-панель: Node.js built-in `node:http` + статический HTML/CSS/JS, без новых зависимостей.**

Альтернативы:
- Express/Fastify + шаблонизатор — отклонено: вводит production-зависимость ради тонкого read-слоя над файлами; проект уже показывает паттерн "статический сайт без фреймворка" (`website/`).
- React/Vite SPA — отклонено: overkill для read+comment панели, требует build-шаг и новые devDependencies, ломает "zero new dependency" ограничение из Brief без веской причины.
- Markdown-рендеринг: минимальный vanilla-JS парсер подмножества Markdown (заголовки, списки, жирный/курсив, код, ссылки) на клиенте — вместо npm-пакета markdown-парсера. Обоснование: артефакты Studio OS используют ограниченное, предсказуемое подмножество Markdown; полноценный CommonMark-парсер не нужен.

**Task Decomposition: новая Runtime-стадия (Markdown-контракт под `skill/runtimes/task-decomposition/SKILL.md`), не отдельный инструмент.**

Альтернатива (отклонено): реализовать декомпозицию как часть Development runtime — отклонено, потому что смешивает "что нужно оценить и раздать" с "как это реализовано", и именно это Development уже делает неявно и нетрассируемо сегодня — проблема, которую и решает эта фича.

ADR: `docs/adr/0002-task-decomposition-and-traceability-id.md` (Task Decomposition + Traceability ID меняют канонический workflow registry — system truth). Admin-панель не меняет system truth Runtime-конвейера и не получает отдельный canonical ADR; её решения зафиксированы здесь.

## Architecture Overview

```text
scripts/admin-panel/
  server.ts        # node:http, маршруты ниже, без внешних зависимостей
  public/
    index.html
    styles.css
    script.js       # fetch к /api/*, мини markdown-рендер, рендер дашборда/таймлайна/борда

.studio/feedback/
  <slug>-<timestamp>.md      # открытые комментарии
  resolved/<slug>-...md      # архив после разрешения (перемещение файла)
```

Маршруты `server.ts`:

- `GET /` — отдаёт `public/index.html` (+ статику `styles.css`, `script.js`).
- `GET /api/state` — сырой текст `.studio/project-state.md` (+ `active-context.md` опционально через `?include=active-context`).
- `GET /api/artifacts` — JSON-дерево `docs/`, `work-items/`, ограниченное `.md`-файлами.
- `GET /api/artifact?path=...` — сырой текст одного артефакта; `path` обязан резолвиться внутри `docs/`, `work-items/` или `.studio/` относительно корня репозитория (см. Security).
- `POST /api/feedback` — тело `{ artifactPath, comment }`; пишет `.studio/feedback/<slug>-<timestamp>.md`.
- `POST /api/feedback/resolve` — тело `{ file }`; перемещает файл из `.studio/feedback/` в `.studio/feedback/resolved/`.

## Components And Responsibilities

- **`server.ts`** — HTTP-сервер, маршрутизация, чтение/запись файлов, валидация путей. Не рендерит HTML сложнее статической отдачи; вся разметка — в `public/`.
- **`public/script.js`** — фетчит `/api/*`, рендерит дашборд (Mode/Stage/Readiness/Progress из `project-state.md`), таймлайн (`Completed Stages`), браузер артефактов, борд Work Items (парсит `Active Work Item` + список директорий `work-items/`), форму комментария.
- **`skill/runtimes/task-decomposition/SKILL.md`** — новый Runtime, контракт декомпозиции.
- **`skill/core/LOADER.md`** — один дополнительный шаг: проверка `.studio/feedback/*.md` (без `resolved/`) при Progressive Startup Loading.

## Data Ownership And Model

- Артефакты Studio OS (`.studio/`, `docs/`, `work-items/`) остаются источником истины; панель их не мутирует, кроме файлов `.studio/feedback/`.
- Новый класс данных: `.studio/feedback/<slug>-<timestamp>.md` — plain Markdown, git-native, без БД. Формат:

```md
# Feedback: <artifactPath>

Date: <ISO-8601>

<текст комментария>
```

- `<slug>` — путь артефакта с заменой `/` на `-` и удалением расширения (например `docs-architecture.md` -> `docs-architecture`).
- Разрешение — перемещение файла в `.studio/feedback/resolved/`, без парсинга статуса внутри файла: наличие файла в `.studio/feedback/` (не в `resolved/`) == "открыт".

## Interfaces And Integrations

- HTTP, только `127.0.0.1` (loopback), без TLS — локальный инструмент разработчика, не публикуется наружу.
- Никаких внешних вызовов, никаких вызовов LLM/модели из `server.ts` или `public/script.js`.
- `npm run admin` — новый script в `package.json`, запускает `node --import tsx scripts/admin-panel/server.ts`.

## Security And Privacy

- Bind строго на `127.0.0.1`; не слушать `0.0.0.0`.
- **Path traversal**: любой путь из query/body (`path`, `artifactPath`, `file`) обязан пройти нормализацию (`path.resolve`) и проверку, что результат остаётся внутри разрешённых корней (`docs/`, `work-items/`, `.studio/` относительно корня репозитория, определяемого как `process.cwd()` при запуске сервера из корня репозитория) — иначе 400. Это защищает от чтения произвольных файлов ОС через локальный сервер даже без внешней аутентификации.
- Без аутентификации — соответствует Assumption из Brief (один локальный пользователь); отсутствие сетевого биндинга вовне снимает основной риск.
- Секреты и приватные данные не рендерятся отдельно — панель просто показывает то же, что уже читаемо в редакторе; отдельная санитизация не требуется, но path traversal guard обязателен.

## Reliability And Failure Handling

Локальный dev-инструмент: при ошибке чтения файла — 404/500 с текстом ошибки в JSON, без падения процесса. Отсутствие `.studio/` в Target Workspace — сервер стартует, панель показывает пустое состояние вместо краша.

## Observability

Не требуется сверх стандартного консольного лога старта сервера (`Admin panel: http://127.0.0.1:<port>`).

## Deployment And Environments

Только локальный запуск через `npm run admin`; не разворачивается, не публикуется, не входит в release manifest (`scripts/release-manifest.json`) как installable Runtime-контент — это dev-only инструмент, аналогично остальным `scripts/*`.

## Migration And Compatibility

Не затрагивает существующие артефакты. `.studio/feedback/` — новая, ранее не существовавшая директория; отсутствие директории не является ошибкой ни для Loader, ни для панели.

## Design System Compatibility

Не применимо — admin-панель не является частью публичного `website/` и его Design System Profile.

## Testing Strategy

- `tests/structure/*` — новый тест, проверяющий, что `scripts/admin-panel/server.ts` существует, экспортирует функцию создания сервера, и что path-resolution функция отклоняет traversal-попытки (`../../etc/passwd` и подобные), без реального сетевого биндинга в тесте.
- Ручная/dogfood проверка: запустить `npm run admin`, открыть `http://127.0.0.1:<port>`, убедиться что дашборд отражает реальный `project-state.md` этого репозитория, отправить тестовый комментарий, убедиться что файл создан.
- `npm run test:structure` и `npm run test:runtime:dry` — регресс существующих Runtime/registry контрактов после добавления `task-decomposition` и правок Loader/Briefing/Planning/Development/Validation.

## Applied Standards And Quality Gates

`code-quality`, `testing`, `security-privacy` (path traversal guard — прямое применение).

## Architecture Decisions And ADRs

`docs/adr/0002-task-decomposition-and-traceability-id.md`.

## Risks And Unknowns

- Мини Markdown-рендерер на клиенте покроет не 100% синтаксиса, встречающегося в артефактах (например, вложенные таблицы) — приемлемо для read-панели; сырой текст всегда доступен как fallback (toggle "raw").
- Loader-проверка feedback не должна становиться жёстким блокером для несвязанных Runtime — реализована как информационное surfacing (список в начале хода), не hard stop.

## Interface Design Handoff

Interface Design пропущена для этого Work Item (не публичная поверхность, `.studio/standards-profile.md` не требует Design System evidence вне `website/`) — записано в Project Memory.

## Development Handoff

- Стек: `node:http`, TypeScript, `tsx` — как в существующих `scripts/*`.
- Границы: `scripts/admin-panel/` изолирован; не импортирует и не дублирует `skill/`-логику, только читает файлы.
- Traceability ID scheme (детали — ADR-0002): `AC<n>` в Brief, `IT<n>` в Roadmap, `T<iteration>.<n>` в `tasks.md`, ссылки на `AC<n>`/`T<n>` в Development Report и Validation evidence.
- Task ceiling по умолчанию — 8 часов (Product Decision из Brief).
