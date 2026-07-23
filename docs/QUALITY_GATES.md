# Quality Gates

Переход между стадиями возможен только после появления обязательного артефакта.

| Стадия | Обязательный артефакт | Статус |
|---------|-----------------------|--------|
| Interview | Project Memory update | Required |
| Brownfield Onboarding | discovery-summary.md, observed standards-profile.md, observed design-system-profile.md | Required for new Brownfield projects |
| Discovery | discovery-summary.md | Required |
| Research | research-summary.md | Conditional |
| Briefing | project-brief.md | Required when selected |
| Design Strategy | design-strategy.md | Conditional |
| Planning | roadmap.md | Required when selected |
| Architecture | architecture.md, delivery-estimate.md, accepted standards-profile.md, required ADRs | Required when selected |
| Interface Design | interface-design.md and applicable design-system-profile.md with platform, state, design-system, accessibility, and handoff decisions | Conditional |
| Work Item Intake | work-items/*/request.md | Required for Work Items |
| Development | Working Increment, development-report.md with standards and design-system evidence when applicable | Required when selected |
| Validation | .studio/telemetry/validation-report.md with standards coverage | Required after Development |
| QA | QA Report with applicable domain-standard and design-system conformance coverage | Required when selected |
| Product Outcome | product-outcome-report.md with milestone evidence matrix | Required before Greenfield, Brownfield, or Feature milestone Release |
| Release | Release Notes | Required when selected |
| Retrospective | runtime-retrospective.md | Conditional |

Если обязательный артефакт отсутствует — переход к следующей стадии запрещён.

Studio OS должна остановиться и сообщить пользователю, чего именно не хватает.

Условную стадию можно пропустить только по правилу выбранного workflow. Это не отменяет обязательные quality gates следующих стадий.

Validation и QA подтверждают текущий инкремент. Только Product Outcome может установить `Product Readiness: Ready for Release`, а при незавершённом roadmap возвращает workflow к следующей итерации.

Every stage that writes a persisted artifact must pass the Artifact Portability Gate: local file references resolve inside the Target Workspace and contain no machine-specific path.
