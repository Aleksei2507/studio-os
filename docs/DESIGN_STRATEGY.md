# Design Strategy Stage

Design Strategy — стадия Studio OS между Briefing и Planning.

Она отвечает на вопрос:

> Какой пользовательский опыт нужен этому продукту?

Эта стадия не занимается детальной отрисовкой интерфейса и не пишет код.

---

## Input

Design Strategy использует:

- docs/discovery-summary.md
- docs/project-brief.md
- docs/research-summary.md, если есть
- .studio/active-context.md

---

## Output

Design Strategy создаёт:

- docs/design-strategy.md

---

## Что должен содержать design-strategy.md

```md
# Design Strategy

## Product

Название продукта.

## User Context

В какой ситуации пользователь использует продукт.

## Primary Device

Mobile / Desktop / Mixed.

## UX Strategy

Ключевые UX-принципы.

Например:

- Mobile First
- Fast Interaction
- Large Touch Targets
- High Contrast
- Low Cognitive Load

## UI Recommendation

Рекомендуемый визуальный подход.

## Why

Почему эта стратегия подходит продукту.

## Alternatives

2–3 альтернативных направления с плюсами и минусами.

## User Decision

- Accepted
- Rejected
- Needs changes
