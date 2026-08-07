# Project Brief

## Executive Summary

Studio OS уже обладает полным продуктовым lifecycle, тремя способами подключения, детерминированным test harness, behavioral assurance policy и release pipeline. Следующее направление развития не должно расширять количество Runtime или добавлять новые продуктовые ветки. Оно должно завершить `v0.5 - Distribution And Delivery Assurance` и доказать, что опубликованная Studio OS предсказуемо устанавливается, активируется и сохраняет границы workflow в поддерживаемых host environments.

Target Milestone считается достигнутым, когда пользователь может установить Studio OS через Codex, Claude Code или Universal ZIP, начать новый или существующий проект и получить правильное поведение без преждевременной разработки, повреждения исходников, скрытых повторных прогонов и машинно-зависимых артефактов.

## Studio Assessment

Outcome: Go

Confidence: Medium

## Assessment Evidence

### Strong

- Полный Greenfield и Brownfield lifecycle уже представлен каноническими Runtime-контрактами.
- Codex, Claude Code и Universal adapter surfaces существуют и имеют согласованный version contract.
- Детерминированный runner проходит `93/93` проверок.
- Scenario definition validation проходит для всех `153` Runtime-сценариев.
- Fixture и replay infrastructure уже проверяет workspace mutations, Project Memory transitions и portable references.
- Behavioral assurance policy определяет идентичность trial, запрет автоматических retries и правила compatibility classification.
- Текущий self-hosting запуск через установленный Codex plugin успешно дошел до Brownfield Briefing.

### Mixed

- Dry Runtime validation подтверждает структуру сценариев, но не выполняет и не оценивает реальные ответы Studio OS.
- Isolated harness проверяет Runtime behavior, но не заменяет активацию установленного host adapter.
- Manual testing contract существует, однако cross-adapter evidence еще не сформирована как завершенная release baseline.

### Weak Or Unknown

- Не выбран точный минимальный набор critical scenarios для `v0.5`.
- Не зафиксированы exact remote и local model identities для compatibility baseline.
- Не подтверждено поведение всех трех adapter paths из опубликованного release artifact.
- Состояние GitHub issues относительно текущей архитектуры не классифицировано в Project Memory.

## Recommendation

Завершить `v0.5 - Distribution And Delivery Assurance` как ограниченный stabilization milestone. Сосредоточиться на доказуемой установке, активации, критических lifecycle transitions, честной model compatibility и чистой Runtime-дистрибуции.

Не начинать `v0.6` и не расширять функциональность до прохождения Product Outcome для этого milestone.

## What Would Change The Decision

- Если один из трех заявленных adapter paths невозможно стабилизировать без изменения vendor-neutral product boundary, scope должен вернуться в Briefing.
- Если behavioral evidence покажет системную несовместимость выбранного минимального класса моделей, потребуется пересмотр поддерживаемой compatibility boundary.
- Если публичная дистрибуция не может отделить Runtime от maintainer Project Memory или приватных project artifacts, Release должен оставаться заблокированным до пересмотра package boundary.

## Product Vision

Человек приносит идею или существующий продукт filesystem-capable AI-агенту и получает работу полноценной продуктовой студии: от уточнения результата до проверенного и сопровождаемого релиза, без зависимости от одного AI-вендора и без необходимости самостоятельно проектировать процесс разработки.

## Product Positioning Or Current Product Direction

Studio OS позиционируется как операционная система продуктовой студии для AI-агентов, а не как один prompt, генератор спецификаций, шаблон репозитория или самостоятельная LLM.

Текущее направление: превратить уже реализованный полный workflow в надежно распространяемый продукт с воспроизводимой evidence для поддерживаемых adapters и моделей.

## Problem Statement

Наличие Runtime-контрактов и проходящих repository tests не доказывает, что пользователь получит то же поведение после реальной установки. Host adapters, model variance, package contents и cross-turn state могут изменить результат. Без installed-adapter dogfooding и compatibility evidence заявленная работа Studio OS остается недостаточно подтвержденной для стабильного alpha-релиза.

## Target Users

- Основной пользователь: человек с новой продуктовой идеей или существующим кодовым проектом, использующий filesystem-capable AI coding agent.
- Вторичный пользователь: maintainer Studio OS, которому нужны воспроизводимые признаки совместимости, регрессий и release readiness.

Профессия и технический уровень пользователя не меняют quality floor или полноту ответственности Studio OS.

## Product Value

- Пользователь получает одинаково понятный вход в Studio OS независимо от поддерживаемого host adapter.
- Новый проект начинается с Interview, а существующий — с evidence-based Brownfield Onboarding или сохраненного Project Memory.
- Studio OS не начинает разработку раньше принятого lifecycle transition.
- Project artifacts остаются переносимыми между машинами.
- Maintainer отличает Runtime regression, model incompatibility, judge failure и infrastructure error, не скрывая нестабильность повторными попытками.
- Публичный release содержит только предназначенную для пользователя Runtime-дистрибуцию.

## MVP Scope Or Current Product Scope

### Current Product Scope

- Greenfield и Brownfield lifecycle от первого запроса до Release и Retrospective.
- Feature, Bugfix и Research Work Item workflows.
- Interaction, Capability, Standards и Design System layers с progressive loading.
- Codex и Claude Code plugin adapters и Universal Bootstrap.
- Детерминированные structure/runner tests, Runtime scenario definitions, fixture/replay harness и behavioral judgment.
- GitHub marketplace distribution, tagged release ZIP, checksum и публичный GitHub Pages сайт.

### Stable Areas

- Каноническая Runtime-композиция через Loader, registries, workflows, Runtime, capabilities и standards.
- Project Mode, Work Type и Interaction Strategy как независимые оси.
- Confirmation-gated Project Memory transitions и разделение stage status от product readiness.
- Project-local reference contract.
- Version synchronization и clean tagged release contract.
- Существующая публичная дизайн-система сайта.

### Target Milestone Scope

- Все три заявленных adapter paths устанавливаются из предназначенного для пользователя release source и доходят до правильного первого Runtime.
- Greenfield activation, Brownfield onboarding, project resume и критические readiness transitions подтверждены наблюдаемыми сценариями.
- Для минимальной поддерживаемой матрицы remote и local моделей опубликована воспроизводимая compatibility evidence по принятой behavioral policy.
- Failed, flaky, incompatible и invalid trials остаются видимыми и классифицируются без автоматических retries.
- Public release archive не содержит self-hosting `.studio/`, maintainer Project Memory, временные test results или dev-only tooling.
- GitHub issues, относящиеся к milestone, согласованы с текущей архитектурой или явно закрыты как устаревшие.

### Legacy Areas

- Compatibility entry points должны оставаться тонкими указателями на каноническое ядро и требуют защиты от drift.
- Legacy Project Memory formats поддерживаются migration behavior и не должны перезапускать onboarding.
- Устаревшие issue descriptions могут ссылаться на архитектуру до progressive Runtime layout; их нельзя автоматически считать актуальным scope.

## Non Goals

- Новые Runtime, lifecycle stages или Work Item типы.
- Hosted feedback service и глобальная Evolution infrastructure.
- IDE integration, team policy packs и multi-agent orchestration.
- Совместимость со всеми моделями и AI-host environments.
- Переписывание Runtime architecture, technology stack, сайта или дизайн-системы.
- Общее улучшение wording и workflow UX, не вызванное critical `v0.5` evidence.
- Автоматический deployment или публикация release без отдельного явного разрешения.

## User Scenarios

1. Пользователь устанавливает Studio OS через Codex, описывает новую идею и попадает в Greenfield Interview без выбора стека и создания кода.
2. Пользователь устанавливает Studio OS через Claude Code и получает те же stage boundaries и confirmation behavior.
3. Пользователь запускает Universal Bootstrap из проверенного release ZIP и получает тот же Loader outcome без зависимости от plugin marketplace.
4. Пользователь подключает Studio OS к существующему проекту без Project Memory; Studio OS создает только onboarding artifacts, сохраняет исходники и использует project-relative references.
5. Пользователь возвращается в уже инициализированный проект; Studio OS возобновляет сохраненный workflow и не повторяет Interview или Brownfield Onboarding.
6. Maintainer запускает critical compatibility suite и получает воспроизводимую классификацию конкретной model/adapter комбинации со всеми неуспешными trial.
7. Пользователь скачивает опубликованный ZIP, проверяет checksum и получает Runtime package без maintainer Project Memory и dev-only содержимого.

## Constraints

- Studio OS зависит от host-агента с filesystem access, но не должна зависеть от одного AI-вендора.
- Поведение моделей недетерминировано; compatibility относится только к зафиксированным Runtime, adapter, executor, judge и model identities.
- Behavioral execution требует явного cost confirmation даже для local inference.
- Автоматические retries запрещены; каждый trial является самостоятельной evidence.
- Real project data нельзя отправлять remote model без явного разрешения.
- Local artifact references должны оставаться project-relative; домашние, временные и sibling-workspace пути запрещены.
- Source checkout и installable Runtime ZIP являются разными delivery artifacts.
- Release и deployment требуют отдельного явного подтверждения.
- Наблюдаемые architecture, stack и design system сохраняются в рамках этого milestone.

## Acceptance Criteria

- Пользователь каждого заявленного adapter path может установить Studio OS по опубликованной инструкции и активировать ее в чистом workspace.
- При новой идее Studio OS выбирает Greenfield и начинает Interview, не обещая реализацию, не выбирая stack и не создавая product files.
- При существующем проекте без `.studio/` Studio OS выбирает Brownfield, создает пять onboarding artifacts, не меняет исходники и останавливается перед Briefing.
- При существующем Project Memory Studio OS сохраняет mode, workflow, language и readiness и продолжает с текущей стадии.
- Critical lifecycle scenarios имеют принятую compatibility classification для минимальной remote/local model и adapter matrix; model и host identities воспроизводимы.
- Ни один failed, flaky, incompatible или invalid trial не преобразуется в PASS путем автоматического retry или ослабления сценария.
- Публичный release ZIP проходит checksum и manifest validation и не содержит `.studio/`, test results, repository test tooling или другие maintainer-only artifacts.
- Инструкции установки, manual smoke tests и фактические adapter commands согласованы для опубликованной версии.
- Все детерминированные repository gates проходят перед behavioral trials и перед release publication.
- Product Outcome подтверждает весь Target Milestone, а не только отдельный успешный test run или adapter path.

## Risks

- Комбинаторный рост model/adapter matrix может сделать baseline слишком дорогой и медленный.
- Judge model может ошибочно классифицировать корректное или некорректное observable behavior.
- Host updates могут изменить activation semantics независимо от Studio OS release.
- Self-hosting Project Memory может загрязнить публичный ZIP без явной package boundary.
- Один успешный локальный прогон может создать ложное ощущение общей совместимости.
- Смешанный язык документации может ухудшить onboarding внешних пользователей.
- Stale issues могут вернуть в scope решения, не соответствующие текущей архитектуре.

## Assumptions

- GitHub repository, marketplaces, Releases и Pages остаются основным каналом дистрибуции для `v0.5`.
- Для baseline доступны как минимум одна идентифицируемая remote модель и одна versioned local модель.
- Текущая Runtime architecture позволяет завершить milestone без нового hosted backend.
- Три adapter paths остаются публично заявленной support boundary.
- Existing behavior and design system сохраняются, кроме изменений, необходимых для доказуемой дистрибуции и compatibility.

## Open Questions

- Какой минимальный набор сценариев считается critical suite для `v0.5`?
- Какие exact adapter, executor model и judge model identities входят в обязательную baseline matrix?
- Должен ли maintainer `docs/discovery-summary.md` исключаться из Runtime ZIP вместе с `.studio/`?
- Как формально определить завершенность triage для stale GitHub issues?
- Входит ли единая языковая политика публичной документации в `v0.5` или откладывается до отдельного Work Item?

Эти вопросы являются входами для Planning и не блокируют принятие продуктового направления.

## Product Decisions

- Studio Assessment: Go с Confidence: Medium.
- Target Milestone: завершение `v0.5 - Distribution And Delivery Assurance`.
- Приоритет milestone: доказуемость дистрибуции и поведения, а не расширение функциональности.
- Поддерживаемая distribution boundary включает Codex, Claude Code и Universal ZIP.
- Compatibility baseline должна включать как remote, так и local model class, с точными identities.
- Автоматические retries и сокрытие неуспешной evidence запрещены.
- Self-hosting `.studio/` и maintainer Project Memory не должны входить в публичный Runtime ZIP.
- Новые Runtime, hosted Evolution и workflow UX expansion отложены.
- Product Readiness остается `Not Ready` до прохождения Product Outcome для всего milestone.
