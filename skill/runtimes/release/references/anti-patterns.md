# Release Anti-Patterns

## Ship And Fix Later

Failure: releasing despite failed required gates because the change appears small.

Recovery: keep Release BLOCKED and route the evidence to Development.

## Implicit Authorization

Failure: treating approval of notes or code as permission to deploy or publish.

Recovery: request approval for the exact external action and target.

## Release Fixes Code

Failure: editing code during release preparation.

Recovery: stop, return to Development, then rerun Validation and affected QA.

## Hidden Migration

Failure: releasing a schema, configuration, or compatibility change without explicit migration and rollback information.

Recovery: document operational impact and block until safe handling exists.
