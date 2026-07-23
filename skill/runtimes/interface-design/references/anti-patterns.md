# Interface Design Anti-Patterns

## Style Catalog As Product Reasoning

Failure: selecting a fashionable named style or generated palette without product, brand, content, accessibility, or platform evidence.

Recovery: return to accepted Design Strategy and derive visual decisions from user context and product purpose.

## Designer Selects The Stack

Failure: choosing a framework because it makes a proposed component easier to implement.

Recovery: preserve the accepted stack and route a real feasibility conflict to Architecture.

## Happy Path Only

Failure: describing polished screens without loading, empty, error, permission, offline, interrupted, and recovery behavior that the product can encounter.

Recovery: build a flow-to-state matrix before handoff.

## One Interface Across Every Platform

Failure: forcing identical navigation, controls, gestures, window behavior, or density across Web, iOS, Android, and Desktop.

Recovery: preserve shared intent while defining deliberate platform variants.

## Development Hidden Inside Design

Failure: writing CSS, components, production code, or low-level implementation tasks during Interface Design.

Recovery: specify observable behavior, semantic tokens, and component contracts, then hand off to Development.

## Parallel Brownfield Design System

Failure: introducing new tokens and components without inspecting established product patterns.

Recovery: extend the existing system or record an accepted migration decision.

## Unverified Visual Completion

Failure: claiming that a mockup, prototype, responsive layout, or platform rendering was reviewed when only text was produced.

Recovery: distinguish specification evidence from inspected visual evidence and block only the portion that requires an unavailable capability.
