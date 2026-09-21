# Задачи оркестрации моделей

## Goal

Реализовать AC1–AC8 в одном инкременте. Потолок задачи — 8 условных часов; оценки служат декомпозиции, не обещают время LLM.

## Traceability Legend

AC — критерий brief.md; T — независимо проверяемая задача.

## Task List

### T1

- Title: Контракт оркестрации и план Architecture
- Satisfies: AC1, AC2, AC5, AC6, AC8
- Estimate: 2–4h
- Dependencies: None
- Owner: ведущий агент
- Scope: capability, registry, Architecture, Loader, Project Memory, шаблон плана
- Definition Of Done: реальные возможности отделены от предположений, все режимы и ограничения описаны, ссылки согласованы.

### T2

- Title: Исполнение и проверка делегированных задач
- Satisfies: AC3, AC4, AC5, AC6, AC7, AC8
- Estimate: 2–4h
- Dependencies: контракт формата T1; независимое редактирование допускается по согласованной структуре
- Owner: исполнитель runtime integration
- Scope: Task Decomposition, Development, implementation capability, шаблоны задач и отчета
- Definition Of Done: ограниченные назначения, реальные native вызовы, проверка, восстановление и truthful отчет встроены в существующий flow.

### T3

- Title: Сценарии и проверки контрактов
- Satisfies: AC1, AC2, AC3, AC4, AC5, AC6, AC7, AC8
- Estimate: 2–4h
- Dependencies: итоговая интеграция T1, T2; подготовка сценариев независима
- Owner: исполнитель tests
- Scope: новый structural test, Runtime-сценарии Architecture и Development
- Definition Of Done: покрыты fallback, выбор модели, scope/ownership, отказ, бюджет, resume; существующие тесты не ослаблены.

### T4

- Title: Интеграция, документация и итоговая проверка
- Satisfies: AC4, AC7, AC8
- Estimate: 1–3h
- Dependencies: T1, T2, T3
- Owner: ведущий агент
- Scope: README, совместная проверка, отчеты Work Item
- Definition Of Done: обязательные проверки выполнены, ограничения реальной model evidence названы, изменения готовы к review без публикации.

## Coverage Check

AC1: T1, T3; AC2: T1, T3; AC3: T2, T3; AC4: T2, T3, T4; AC5: T1, T2, T3; AC6: T1, T2, T3; AC7: T2, T3, T4; AC8: T1, T2, T3, T4.

## Deferred

Платные межмодельные behavioral trials и Release не входят в текущий запрос. Ни один продуктовый AC не исключен.

## Development Handoff

Выполнять ограниченные назначения по architecture.md. Код и контракты исполнителей проверяет ведущий агент. Статус старого milestone и артефакты Company Workspace сохраняются.
