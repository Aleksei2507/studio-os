# Development Anti-Patterns

## Skip Tests For Speed

Failure: disabling tests or omitting relevant verification to finish faster.

Recovery: select the smallest relevant test set, explain any unavailable checks, and preserve the Validation gate.

## Opportunistic Rewrite

Failure: changing framework, architecture, or large unrelated areas while implementing a bounded request.

Recovery: return to accepted scope and create a separate Refactor or Architecture decision when justified.

## Speculative Error Fix

Failure: changing code before reproducing or localizing an unknown error.

Recovery: capture evidence, test bounded hypotheses, then change the supported cause.

## Hidden Scope

Failure: adding adjacent behavior because implementation makes it easy.

Recovery: leave it unchanged and route the idea through Work Item Intake.

## Validation Inside Development

Failure: treating one focused local test as complete technical Validation.

Recovery: record focused checks in Development Report and hand off independent validation commands.
