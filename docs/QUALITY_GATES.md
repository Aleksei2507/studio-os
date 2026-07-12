# Quality Gates

Переход между стадиями возможен только после появления обязательного артефакта.

| Стадия | Обязательный артефакт | Статус |
|---------|-----------------------|--------|
| Interview | Project Memory update | Required |
| Discovery | discovery-summary.md | Required |
| Research | research-summary.md | Conditional |
| Briefing | project-brief.md | Required when selected |
| Design Strategy | design-strategy.md | Conditional |
| Planning | roadmap.md | Required when selected |
| Architecture | architecture.md, delivery-estimate.md, required ADRs | Required when selected |
| Work Item Intake | work-items/*/request.md | Required for Work Items |
| Development | Working Increment, development-report.md | Required when selected |
| Validation | .studio/telemetry/validation-report.md | Required after Development |
| QA | QA Report | Required when selected |
| Release | Release Notes | Required when selected |
| Retrospective | runtime-retrospective.md | Conditional |

Если обязательный артефакт отсутствует — переход к следующей стадии запрещён.

Studio OS должна остановиться и сообщить пользователю, чего именно не хватает.

Условную стадию можно пропустить только по правилу выбранного workflow. Это не отменяет обязательные quality gates следующих стадий.
