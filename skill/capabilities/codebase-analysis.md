# Codebase Analysis Capability

## Purpose

Build evidence-based understanding of an existing repository before decisions or edits.

## Procedure

1. Use the repository's configured knowledge graph or code index when available.
2. Discover definitions, dependencies, and call paths through structured tools.
3. Read project documentation and configuration as supporting context.
4. Fall back to text search for literals, configuration, and non-code files.
5. Distinguish confirmed repository evidence from inference.
6. Inspect only the scope needed for the active Runtime.

## Evidence

- Relevant file and symbol paths.
- Existing architecture and conventions.
- Affected dependencies or boundaries.
- Unknown or unindexed areas.

## Unavailable Behavior

Do not claim complete codebase understanding when indexing, source access, or required generated files are unavailable.
