# Runtime Testing

Studio OS runtime regression tests live in `tests/runtime/**/*.md`.

Each test is a Markdown file with YAML frontmatter and a scenario body. The
frontmatter is intentionally small so tests stay readable and easy to review.

```md
---
id: loader-greenfield-basic
title: Loader routes a new project
stage: loader
prompt: Use Studio OS. I want to build a habit tracker.
expect:
  - asks for the project goal or context
  - does not write project files before planning is complete
tags: [loader, greenfield]
---

The user starts with a greenfield product idea and no existing project files.
The runtime should enter the right stage and ask the next useful question.
```

## Required Fields

- `id`: stable kebab-case test identifier.
- `title`: short human-readable test name.
- `stage`: runtime area under test, such as `loader`, `discovery`, or `planning`.
- `prompt`: initial user prompt for the runtime.
- `expect`: one or more expected behaviors.

The Markdown body must describe the conversation, fixture, or scenario.

## Commands

Dry mode validates test structure without calling an LLM API:

```bash
npm run test:runtime:dry
```

Runtime mode uses the same loader and validation path. The LLM judge interface
is reserved, but not implemented yet, so valid tests currently report
`PARTIAL`:

```bash
npm run test:runtime
```

Both commands print per-test status and a final summary:

- `PASS`: every test passed structural validation or judge evaluation.
- `FAIL`: at least one test is invalid or failed evaluation.
- `PARTIAL`: no runtime tests exist yet, or tests are structurally valid but
  judge evaluation is not complete.

## Custom Test Directory

Use `--tests-dir` to validate another directory:

```bash
npm run test:runtime:dry -- --tests-dir path/to/runtime-tests
```

## Current Judge Contract

The runner already separates validation from judged execution:

1. discover Markdown files under `tests/runtime`
2. parse YAML frontmatter
3. validate required fields and scenario body
4. pass valid tests to the future `RuntimeJudge`
5. aggregate `PASS`, `FAIL`, or `PARTIAL`

The next implementation step is replacing the current TODO judge with an LLM
adapter that runs Studio OS against each prompt and compares the answer with
`expect`.
