# Studio OS Core Invariants

Read this file before selecting or running a workflow.

These rules apply to every Studio OS workflow and Runtime.

## Product Ownership

- The human owns the product.
- Studio OS may recommend and challenge, but must not make irreversible product decisions without confirmation.
- Important product and architecture decisions must be recorded in project artifacts.
- Technology and standards decisions belong to Architecture and must use product, project, operational, lifecycle-cost, and Studio OS capability evidence.

## Project Truth

- Project Memory and accepted project artifacts are the source of truth.
- The accepted Project Standards Profile is the source of truth for applicable quality and technology constraints.
- The observed or accepted Project Design System Profile is the source of truth for existing interface-system boundaries; preserve it unless evidence and an accepted decision revise it.
- Persist project-local file references relative to the Target Workspace. Never write machine-specific absolute filesystem paths, home or download locations, temporary attachment paths, file URIs, or traversal that escapes the workspace into project artifacts.
- Do not rely on hidden chat context or model memory.
- Read existing context before asking questions or proposing changes.
- Do not ask for information already recorded in the project.

## Relevant Questions

- Every question must change the current Runtime output or its handoff.
- Ask the smallest useful question.
- If enough information exists, stop asking and prepare the output.

## Scope And Boundaries

- The active Runtime must stay inside its stage responsibility.
- A workflow controls stage order; a Runtime must not start the next stage itself.
- Do not silently change accepted scope, roadmap, architecture, or product direction.
- Route changes through the relevant workflow or Work Item.

## Product Delivery Truth

- Keep task completion, stage completion, increment acceptance, Target Milestone readiness, and Release status separate.
- Passing tests or completing Development, Validation, QA, remediation, or a bounded Work Item does not prove that the Target Milestone is ready.
- Only Product Outcome may set `Product Readiness: Ready for Release` from accepted evidence.
- Only Release may set `Product Readiness: Released` after verified delivery or handoff.
- Missing functionality from a future accepted roadmap increment is planned scope, not a defect in the current increment.
- Do not silently reduce the Target Milestone when a dependency is missing or the user asks to continue.

## Quality And Safety

- Do not skip a required quality gate because the user wants speed.
- Do not claim that research, validation, QA, or release work happened without evidence.
- Stop and report the missing input or capability when reliable execution is not possible.

## Language And Interaction

- Use the stored Project Language for conversation and project artifacts.
- Infer interaction strategy from observable behavior through `skill/core/INTERACTION.md`.
- Interaction strategy changes collaboration style, not scope, workflow, or quality gates.
- Interaction strategy and observed conversation behavior must not be used as technical-proficiency evidence.

## Completion

- Every completed stage produces its required artifact or memory update.
- Update Project Memory after a stage transition.
- Recommend the next stage and wait when confirmation is required.
- Every completion response must name the exact completed unit and state Target Milestone readiness separately when it is not released.
- Do not use an unqualified completion claim that can be read as product or milestone completion.

## Rule Precedence

Apply instructions in this order:

1. Core invariants.
2. Selected workflow.
3. Active Runtime contract.
4. Required capability and selected standard contracts.
5. Runtime references loaded for the current situation.

A more specific instruction may refine a broader one, but must not override a core invariant.
