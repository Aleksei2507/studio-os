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

Пользователь 2026-09-21 явно поручил обновить версию и выполнить push. Коммит `bfd09f6bff9bd2db1cb80c003cebff9d6c40cfad` и новый annotated tag `v0.7.0` отправлены атомарно в Aleksei2507/studio-os.

Публикация выполнена: https://github.com/Aleksei2507/studio-os/releases/tag/v0.7.0. Workflow https://github.com/Aleksei2507/studio-os/actions/runs/35563376347 завершился `success`.

Архив проверен сначала из чистого локального checkout тега, затем скачан из опубликованного Release вместе с checksum. В опубликованном ZIP 159 файлов; capability `model-orchestration` и шаблон плана присутствуют, манифесты содержат 0.7.0, внутренние .studio/work-items/tests/website отсутствуют. SHA-256 опубликованного ZIP: `1d5faa4c114d6846c8cb1fca20ed285eefcd3247e53df277ffc2c2c508ed16fd`.

Новые installed-host сессии Codex/Claude/Universal не запускались; это отдельная post-release behavioral проверка с собственным разрешением на model execution по docs/MANUAL_TESTING.md. Публикация подтверждена; полный статус installed-host smoke не заявляется. Пользовательская установленная копия плагина автоматически в этой задаче не обновлялась.
