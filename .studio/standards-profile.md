# Project Standards Profile

Scope: Project

Status: Accepted

## Product Domains And Delivery Surfaces

- Runtime-продукт: Markdown-контракты и JSON-реестры для полного цикла продуктовой разработки.
- Host adapters: Codex plugin, Claude Code plugin и Universal Bootstrap для filesystem-capable агентов.
- Инструменты разработки: TypeScript ESM и Node.js-скрипты для структурных, Runtime и release-проверок.
- Публичная поверхность: статический сайт на HTML, CSS и JavaScript, публикуемый через GitHub Pages.
- Дистрибуция: Git tags, GitHub Releases, versioned ZIP и SHA-256 checksum.

## Studio Delivery, Operations, And Support Model

По принятой модели Studio OS отвечает за реализацию, подготовку релиза, operational readiness, дальнейшую поддержку и обслуживание через Work Item workflows. Внешний владелец или обязательная передача сопровождения не зафиксированы.

## Accepted Technology Stack

Architecture принимает и сохраняет существующий стек:

- Markdown и JSON для Runtime-контрактов, реестров и сценариев;
- TypeScript, ESM, Node.js и `tsx` для test/release tooling;
- статические HTML, CSS и JavaScript для сайта;
- GitHub Actions, Pages и Releases для CI и дистрибуции;
- npm и lockfile для воспроизводимой установки dev-зависимостей.

Новые production или runtime dependencies для `v0.5` не приняты. Release composition расширяется versioned JSON manifest в существующем TypeScript/Node tooling.

## Architecture And ADR References

- `README.md`
- `docs/HOW_IT_WORKS.md`
- `docs/STAGE_BOUNDARIES.md`
- `docs/STANDARDS_LAYER.md`
- `docs/PROJECT_MEMORY.md`
- `skill/workflows/registry.json`
- `skill/capabilities/registry.json`
- `skill/standards/registry.json`
- `docs/architecture.md`
- `docs/delivery-estimate.md`
- `docs/adr/0001-manifest-driven-runtime-package.md`

ADR-0001 принимает manifest-driven allowlist как package source of truth.

## Selected Core Standards

- `code-quality`; источник: `skill/standards/core/code-quality.md`; применяется в Architecture, Development и Validation; подтверждение: ограниченные изменения, локальные паттерны и соответствующие проверки.
- `testing`; источник: `skill/standards/core/testing.md`; применяется в Architecture, Development и Validation; подтверждение: детерминированные тесты, scenario validation и evidence-bounded behavioral trials.
- `security-privacy`; источник: `skill/standards/core/security-privacy.md`; применяется от Architecture до Release; подтверждение: отсутствие секретов и приватных данных в fixtures, ограниченный filesystem access и переносимые ссылки.

## Selected Domain Standards

- `web-frontend`; источник: `skill/standards/domains/web-frontend.md`; применяется к публичному сайту на стадиях Architecture, Interface Design, Development, Validation и QA.
- `accessibility`; источник: `skill/standards/core/accessibility.md`; применяется к семантике, клавиатурному управлению, адаптивности и reduced motion сайта.
- `product-design`; источник: `skill/standards/domains/product-design.md`; применяется к Design Strategy, Interface Design, Development и QA публичного опыта.

## Selected Stack Or Project Standards

- Runtime lifecycle и границы стадий: `docs/HOW_IT_WORKS.md`, `docs/STAGE_BOUNDARIES.md`, `docs/QUALITY_GATES.md`; все Runtime-стадии; подтверждение через runtime scenarios и fixture assertions.
- Behavioral assurance: `docs/BEHAVIORAL_ASSURANCE.md`, `docs/runtime-testing.md`, `tests/runtime/behavioral-policy.json`; Validation и QA; идентичность модели, нулевые автоматические retries и три валидных trial для compatibility baseline.
- Release contract: `docs/RELEASING.md`, `.gitattributes`, `.github/workflows/release.yml`, `docs/adr/0001-manifest-driven-runtime-package.md`; Release; manifest-driven allowlist, синхронные версии, clean tagged checkout, ZIP inspection и adapter smoke tests.
- Public site contract: `tests/structure/site.test.ts`, `.github/workflows/pages.yml`; Development, Validation и Release; self-contained assets, переносимые ссылки и GitHub Pages deployment.

## Repository Instructions And Conventions

- Для исследования кода сначала используется проектный knowledge graph; текстовый поиск применяется к документации, конфигурации и строковым значениям.
- Каноническая Runtime-реализация находится под `skill/`; совместимые entry points не должны становиться независимыми источниками логики.
- Контекст загружается прогрессивно через Loader, workflow, Runtime, capabilities и standards registries.
- Локальные ссылки в сохраняемых артефактах должны быть project-relative; домашние, временные, Downloads и sibling-workspace пути запрещены.
- Release archive намеренно исключает dev-only файлы; для разработки и полной проверки требуется Git checkout.

## Required Interface Design Evidence

- Семантическая структура, tab semantics, ARIA-связи и keyboard behavior в `website/index.html` и `website/script.js`.
- Сохранение токенов, responsive breakpoints и reduced-motion правил из `website/styles.css`.
- Отсутствие внешних script/style зависимостей и горизонтального переполнения.
- Визуальная проверка ключевых desktop и mobile состояний при изменениях интерфейса.

## Required Development Evidence

- Изменения соответствуют активному Runtime и принятому scope.
- Реестры, пути, entry points и compatibility contracts остаются согласованными.
- Для измененного поведения добавлены или обновлены минимальные детерминированные и Runtime regression tests.
- Новые локальные ссылки проходят Artifact Portability Gate.
- Release-impacting изменения проверяют фактический allowlisted archive, required entries, forbidden categories и checksum.
- Development сохраняет Runtime roots, adapter paths и existing design system, если новый принятый ADR не изменит границу.

## Required Validation Gates

- `npm run test:runner`
- `npm run test:runtime:dry`
- `npm run release:check` для release-impacting изменений
- Plugin и skill validators из `docs/RELEASING.md` перед релизом
- Behavioral trials только после детерминированных gates, с явным `--confirm-llm-cost` и ограниченным выбором сценариев

Отдельные npm-команды lint, format и typecheck в текущем manifest не обнаружены.

## Required QA Scenarios

- Stage boundaries, Project Memory transitions и scoped readiness проверяются Runtime scenarios.
- Fixture-backed сценарии проверяют workspace mutations, portability и cross-turn state.
- Публичный сайт проверяется на self-contained delivery, корректные anchor references, portable paths и локальные assets.
- Installed Codex, Claude Code и Universal adapters требуют отдельного manual smoke test; isolated harness его не заменяет.

## Required Release Conditions

- Все version sources синхронизированы согласно `docs/RELEASING.md`.
- Репозиторий чистый, checkout соответствует annotated tag.
- Детерминированные gates и release metadata check проходят.
- Созданы и проверены versioned ZIP и checksum.
- Выполнены smoke tests всех трех adapter paths до Loader и Interview без преждевременной разработки.

## Approved Deviations

- Для self-hosting Brownfield Roadmap используется `docs/development-roadmap.md`, потому что Runtime default `docs/roadmap.md` совпадает с существующим продуктовым `docs/ROADMAP.md` на case-insensitive filesystem. Existing artifact сохраняется; отклонение пересматривается после принятого общего collision contract.

## Unknowns And Review Triggers

- Compatibility baselines для remote и local моделей пока не завершены; пересмотреть при стабилизации `v0.5` или изменении behavioral policy.
- Manifest-driven package boundary принята, но должна быть реализована и проверена до следующего release tag.
- Exact remote/local model identities и installed host versions выбираются перед соответствующими evidence runs.
- Нет явных lint, format и typecheck scripts; пересмотреть при изменении TypeScript surface или отдельном quality Work Item.
- Документация содержит русский и английский языки; пересмотреть, если единый язык станет продуктовым требованием.
- Общий Runtime contract для case-insensitive output collision отсутствует; существующие artifacts нельзя перезаписывать.

## Last Updated

2026-08-03
