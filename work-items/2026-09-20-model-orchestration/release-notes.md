# Релиз Studio OS v0.7.0

## Release Identifier And Date

Версия: v0.7.0. Дата подготовки: 2026-09-21.

## Scope And User-Visible Changes

Architecture планирует работу native-субагентов и выбирает разрешенные модели отдельных исполнителей. Ведущая модель сохраняется. Task Decomposition фиксирует границы, зависимости и проверки; Development запускает субагентов, проверяет и объединяет результаты.

Добавлены режимы без субагентов и с наследуемой моделью, ограничения параллелизма/повторов, соблюдение жестких бюджетов и проверка незавершенных заданий при возобновлении. Переходы Architecture и Interface Design сохраняют выбранную Task Decomposition.

## Compatibility And Migration

Отдельный сервис, API-ключи и новые зависимости не требуются. Старые проекты без плана могут продолжить работу одной моделью. Обновленная версия доступна через согласованные marketplace refs и ZIP после успешной публикации. Для уже запущенных сессий потребуется новая сессия с обновленным плагином.

## Validation And QA Evidence

Предыдущая проверка: validation-report.md и qa-report.md. Release preflight 2026-09-21: runner 214/214 PASS, 161 dry-сценарий PASS, release metadata v0.7.0 PASS; Codex plugin/skill validators и оба Claude plugin validators PASS. Архив проверяется из чистого checkout точного тега; результат публикации фиксируется отдельно.

## Product Outcome Evidence

product-outcome-report.md: PASS ограниченного Work Item. Родительский milestone и незавершенный Company Workspace не входят в этот релиз.

## Known Issues And Residual Risks

Реальная экономия токенов, выбор разных моделей и behavioral compatibility каждой host/model комбинации не измерялись. Native dogfood этой разработки использовал наследуемую модель. Детерминированные проверки не заменяют свежую установленную сессию в каждом хосте.

## Rollback Notes

При проблеме использовать опубликованный v0.6.0; не передвигать существующие опубликованные теги. Новый исправляющий релиз получает отдельную версию.

## Authorization And Result

Пользователь 2026-09-21 явно поручил обновить версию и выполнить push. Цель: main и новый annotated tag v0.7.0 в Aleksei2507/studio-os; tag запускает штатный GitHub Release workflow. Публикация на момент подготовки еще не выполнена.
