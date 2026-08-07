# Brownfield Discovery Summary

## Executive Summary

Studio OS — это open-source Runtime-система, которая превращает filesystem-capable AI-агента в продуктовую студию: принимает новую идею или существующий проект, последовательно проводит через исследование, продуктовые решения, дизайн, планирование, разработку, проверку результата и релиз. Проект находится в alpha-стадии `0.5.0-alpha.4`; основные продуктовые слои уже реализованы, а текущий milestone сосредоточен на дистрибуции и доказуемости поведения.

Self-hosting инициализация выполняется установленным Studio OS `0.5.0-alpha.4`, а этот репозиторий рассматривается как отдельный Target Workspace. Такое разделение не позволяет незакоммиченным изменениям проверяемого Runtime незаметно изменить правила собственного onboarding.

## Current Product Capabilities

- Greenfield и Brownfield входы с Project Memory и confirmation-gated переходами.
- Компонуемые workflows для полного lifecycle и ограниченных feature, bugfix и research work items.
- Interaction Layer с Advisor, Collaborator и Executor стратегиями на основе наблюдаемого поведения пользователя.
- Capability и Standards registries с progressive loading и отдельным Design System Profile.
- Канонические Runtime-контракты для Interview, Discovery, Research, Briefing, Design Strategy, Planning, Architecture, Interface Design, Development, Validation, QA, Product Outcome, Release и Retrospective.
- Codex и Claude Code marketplace adapters, а также Universal Bootstrap для других filesystem-capable агентов.
- TypeScript Runtime harness с dry scenario validation, fixture/replay workspace assertions, отдельными executor и judge ролями и поддержкой локального Ollama engine.
- GitHub Release pipeline с version contract, runtime ZIP и checksum.
- Статический публичный сайт с установочными инструкциями и демонстрацией полного продуктового цикла.

## Current System Understanding

- `skill/` является каноническим Runtime-ядром; Loader выбирает Project Mode, Workflow и Active Runtime и затем прогрессивно загружает capabilities и standards.
- `skill/workflows/registry.json`, `skill/capabilities/registry.json` и `skill/standards/registry.json` являются машинно-читаемыми точками композиции.
- `skills/studio-os/SKILL.md`, plugin manifests и `adapters/universal/BOOTSTRAP.md` подключают ядро к разным host environments.
- `scripts/runtime-testing/` и `scripts/run-runtime-tests.ts` отделяют сценарии, исполнение Runtime, LLM judgment и проверки workspace mutations.
- Детерминированный dry summary подтверждает корректность 153 Markdown-сценариев, но сам по себе не выполняет и не оценивает ответы Studio OS.
- `docs/BEHAVIORAL_ASSURANCE.md` требует три независимых валидных trial для compatibility baseline и запрещает автоматические retries.
- `website/` является self-contained статической delivery surface с проектной дизайн-системой и GitHub Pages deployment.
- Source checkout и release ZIP имеют разные назначения: ZIP содержит Runtime-дистрибуцию, а тесты и release tooling выполняются только из Git checkout.

## Current Risks

- Self-hosting создает риск циклической проверки, если управляющий Runtime и изменяемый checkout не разделены и не зафиксированы по версии.
- `153/153 PASS` в latest dry summary означает только валидность scenario definitions; behavioral compatibility и installed-adapter dogfooding требуют отдельных прогонов.
- До стабильности `v0.5` остаются cross-adapter dogfooding, дополнительные fixture-backed lifecycle transitions и compatibility baselines для remote и local моделей.
- Release builder формирует ZIP через `git archive`, но `.studio/` пока не исключена через `export-ignore`; после коммита self-hosting Project Memory может попасть в публичную Runtime-дистрибуцию, если до следующего тега не будет принято отдельное решение.
- В `package.json` нет отдельных lint, format и typecheck gates, поэтому эта часть engineering assurance не выражена самостоятельными командами.
- Каноническое ядро и compatibility entry points создают риск drift; его необходимо продолжать удерживать структурными тестами.
- Существующая документация смешивает русский и английский языки, а единая политика языка для самого open-source продукта явно не принята.

## Product Boundaries

- Studio OS определяет процесс, роли, артефакты и quality gates, но не содержит собственную hosted LLM и не заменяет host-агента.
- Продукт рассчитан на агентов с доступом к файловой системе; chat-only среды без доступа к проекту не являются полной поддерживаемой поверхностью.
- Studio OS ведет разработку и поддержку под ключ по умолчанию; технический уровень пользователя не используется как основание для уменьшения качества решения.
- Workflows управляют collaboration style и стадиями, но не расширяют scope без явного продуктового решения.
- Публичный сайт объясняет и распространяет продукт, но не является Runtime execution environment.
- Глобальный сбор project retrospectives и hosted feedback service пока не реализованы; roadmap предусматривает opt-in Evolution intake в будущем.

## Technical Boundaries

- Runtime-логика хранится в Markdown и JSON; TypeScript используется для development-time validation, behavioral harness и release tooling.
- Публичный сайт использует только локальные HTML, CSS, JavaScript и raster assets без внешних runtime-зависимостей.
- Версии синхронизируются между npm manifest/lockfile и тремя adapter manifest families.
- Release publication запускается annotated Git tag и требует clean, matching checkout.
- Сохраняемые Project Memory и product artifacts должны использовать только project-relative локальные ссылки; временные, домашние и sibling-workspace пути запрещены.
- Behavioral trials могут зависеть от внешних или локальных моделей и не заменяют детерминированные gates, product QA или installed-adapter smoke tests.

## Current Decisions

- Project Mode: Brownfield.
- Workflow: `brownfield`.
- Project Language для новых Project Memory артефактов: русский.
- Управляющая версия self-hosting: установленный Studio OS `0.5.0-alpha.4`.
- Наблюдаемые Runtime architecture, technology stack и дизайн-система сохраняются; onboarding не принимает их замену или миграцию.
- Work Type и Target Milestone не выбраны.

## Unknowns

- Какой следующий пользовательский или maintainer outcome должен стать Target Milestone после onboarding.
- Какие critical scenarios и adapter/model combinations должны первыми получить baseline evidence.
- Должен ли следующий milestone завершать `v0.5` или начинать часть `v0.6` Behavioral Assurance.
- Должны ли `.studio/` и maintainer onboarding summary исключаться из публичного release archive.
- Нужны ли отдельные lint, format, typecheck и browser-compatibility contracts.
- Какую языковую политику следует принять для публичной документации и внутренних Runtime-контрактов.

## Recommended Next Step

Briefing
