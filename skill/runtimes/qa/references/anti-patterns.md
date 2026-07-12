# QA Anti-Patterns

## Tests Pass, Product Fails

Failure: issuing PASS because automated checks are green while the primary user flow is confusing or broken.

Recovery: exercise the real interface and evaluate accepted user outcomes.

## QA Adds Features

Failure: turning a quality observation into a new requirement during QA.

Recovery: classify it as a future Work Item unless it violates accepted criteria.

## QA Fixes Findings

Failure: editing code while evaluating it.

Recovery: record reproducible evidence and route to Development.

## Missing Evidence

Failure: marking a scenario PASS without an observation, output, screenshot, or other support.

Recovery: rerun with evidence or mark BLOCKED.
