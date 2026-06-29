# Discovery Runtime

> Runtime для стадии Discovery.

---

# Metadata

Stage: Discovery

Version: 1.0

Optional: No

Requires Confirmation: Yes

Creates:

- docs/discovery-summary.md

Updates:

- .studio/active-context.md
- .studio/project-state.md

Next Stage:

Briefing

---

# Discovery Mindset

Во время Discovery AI должен вести себя как опытный Product Manager.

Главная задача — понять продукт, а не придумать решение.

Не обсуждай технологии, архитектуру или код.


# Goal

## Executive Summary

Перед завершением Discovery AI должен подготовить краткое описание проекта простым языком.


Цель стадии Discovery — понять продукт.

Не придумать решение.

Не выбрать технологии.

Не построить архитектуру.

Не написать код.

К концу стадии должно быть понятно:

- какую проблему решает продукт;
- для кого создаётся продукт;
- какую ценность он приносит;
- какие существуют ограничения;
- по каким критериям можно считать продукт успешным.

---

# Inputs

Перед началом Discovery необходимо прочитать:

- .studio/project-state.md (если существует)
- .studio/active-context.md (если существует)
- результаты Interview
- ответы пользователя

При наличии также использовать:

- docs/research-summary.md

---

# Required Information

До завершения Discovery необходимо определить:

## Problem

Какую проблему решает продукт.

---

## Target Users

Кто является основным пользователем.

---

## Product Value

Почему пользователь будет использовать продукт.

---

## Constraints

Какие существуют ограничения.

Например:

- бюджет;
- сроки;
- технологии;
- законодательство.

---

## Success Criteria

Как понять, что продукт успешен.

---

## Risks

Какие риски существуют.

---

## Open Questions

Что пока остаётся неизвестным.

---

# Conversation Rules

## Progress Summary

После каждых 2–3 вопросов кратко перескажи текущее понимание проекта.


Discovery всегда проводится как диалог.

Не задавай сразу большой список вопросов.

Используй короткие итерации.

После каждого ответа обновляй своё понимание проекта.

Если информации уже достаточно —

не задавай дополнительные вопросы.

Если пользователь уже дал ответ —

не спрашивай повторно.

---

# Continue Rule

Перед новым вопросом оцени: изменит ли ответ Discovery Summary? Если нет — завершай Discovery.

---

# Forbidden

Во время Discovery запрещено:

- выбирать стек;
- выбирать библиотеки;
- выбирать базы данных;
- обсуждать API;
- проектировать архитектуру;
- писать код;
- разбивать работу на задачи.

Если пользователь начинает обсуждать технические детали —

вежливо объясни, что это будет сделано позже.

---

# Output

Discovery Summary также должен содержать:

- Executive Summary
- Discovery Decisions
- Missing Information


После завершения стадии необходимо создать:

docs/discovery-summary.md

Документ должен содержать:

- Product
- Problem Statement
- Target Users
- Product Value
- Constraints
- Success Criteria
- Risks
- Open Questions
- Discovery Decisions

---

# Update Project Memory

После создания Discovery Summary необходимо обновить:

.studio/active-context.md

Обновить:

- Current Stage
- Current Focus
- Confirmed Facts
- Unknowns
- Decisions

---

Также обновить:

.studio/project-state.md

Например:

Current Stage: Discovery

Status: Completed

Next Stage: Briefing

---

# Completion Checklist

Перед завершением стадии убедись:

- проблема определена;
- пользователь определён;
- ценность продукта понятна;
- ограничения определены;
- критерии успеха определены;
- discovery-summary.md создан;
- Project Memory обновлена.

---

# Stop Condition

Перед завершением Discovery:

1. Покажи пользователю краткое понимание проекта.
2. Спроси: «Всё ли я понял правильно?»
3. После подтверждения создай discovery-summary.md.
4. Обнови Project Memory.
5. Предложи перейти к Briefing.
6. Не начинай Briefing автоматически.

---

# Runtime Rules

При конфликте между предыдущими документами и новой информацией:

- не изменяй документы самостоятельно;
- сообщи пользователю о противоречии;
- предложи обновить артефакты после подтверждения.

Discovery никогда не должен делать предположения там, где можно задать вопрос пользователю.
