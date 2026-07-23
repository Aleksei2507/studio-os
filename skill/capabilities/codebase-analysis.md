# Codebase Analysis Capability

## Purpose

Build evidence-based understanding of an existing repository before decisions or edits.

## Procedure

1. Use the repository's configured knowledge graph or code index when available.
2. Discover definitions, dependencies, and call paths through structured tools.
3. Read project documentation and configuration as supporting context.
4. Fall back to text search for literals, configuration, and non-code files.
5. When interface evidence is relevant, inspect shared components, themes, tokens, platform resources, design configuration, and actual usage rather than identifying a design system from one dependency alone.
6. Report project file evidence with paths relative to the Target Workspace.
7. For an authorized source outside the Target Workspace, preserve a stable remote identifier or project-local evidence snapshot instead of its machine path.
8. Distinguish confirmed repository evidence from inference.
9. Inspect only the scope needed for the active Runtime.

## Health Audit (Extended Procedure)

When the Runtime or user requests a codebase health audit (weak-spots review, quality sweep, bug-finding pass), follow this structured procedure in addition to the base analysis:

1. **Discover project type** from config files (package.json, pyproject.toml, docker-compose.yml, etc.) to select relevant check categories.
2. **Spawn bounded subagents** for parallel analysis when the codebase is large. Each subagent covers one category and returns structured findings. Use the explore subagent type when available.
3. **Run category-specific checks** — select from the checklist below based on project type:

   **All projects:**
   - Dead code and unused imports (grep for TODO/FIXME/HACK, unused exports)
   - Large files (>500 lines) that may be monolithic
   - Missing or thin test coverage
   - Hardcoded secrets, API keys, or credentials
   - Error handling patterns (bare except, swallowed errors, missing try/catch)

   **TypeScript / JavaScript (Next.js, React, Node):**
   - Type errors and type mismatches (tsc --noEmit or build output)
   - React hooks misuse (missing deps, conditional hooks, wrong usage)
   - SSR/CSR boundary issues (client-only libraries without dynamic import)
   - API route validation and error handling
   - Import path issues and dead exports

   **Python (Django, FastAPI, Flask):**
   - Hardcoded string literals that should be constants or enums
   - Missing type hints on public functions
   - N+1 query patterns
   - Bare except clauses and swallowed exceptions
   - Migration issues and schema drift

4. **Produce structured findings** — for each issue:
   - File path and line number
   - Category (architecture, security, code quality, testing, maintenance)
   - Severity (critical, high, medium, low)
   - One-line description with enough context to fix

5. **Summarize** with a count by category and severity, and list top-3 highest-impact items.

## Evidence

- Relevant file and symbol paths.
- Existing architecture and conventions.
- Existing interface foundations, component sources, and design-system boundaries when applicable.
- Affected dependencies or boundaries.
- Unknown or unindexed areas.
- For health audits: structured issue list with file:line, category, severity, and description.

## Unavailable Behavior

Do not claim complete codebase understanding when indexing, source access, or required generated files are unavailable. When a check category requires tools not available in the current environment (e.g., tsc for TypeScript, pylint for Python), mark it as NOT RUN with the reason.
