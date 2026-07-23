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

Runner and Studio OS structure tests:

```bash
npm run test:runner
```

Structure tests validate workflow registry paths, Runtime metadata, compatibility entries, and progressive loading invariants.

They also validate capability contracts and Runtime output template references.

Run only structure tests with:

```bash
npm run test:structure
```

Dry mode validates test structure without calling an LLM API:

```bash
npm run test:runtime:dry
```

This command does not start Studio OS, produce a Runtime response, or judge behavior. A result such as `137/137 PASS` means that 137 scenario definitions have valid frontmatter, expectations, and bodies. It is not evidence that 137 conversations were executed successfully.

One-turn Runtime contract evaluation executes Universal Bootstrap in a disposable read-only workspace and evaluates the final response with a separate LLM judge session:

```bash
npm run test:runtime -- \
  --confirm-llm-cost \
  --id bootstrap-001-explicit-greenfield-activation
```

Behavioral mode requires:

- an installed and authenticated Codex CLI;
- an explicit `--confirm-llm-cost` flag;
- two model calls per scenario: one Runtime executor and one response judge.

The runner does not execute behavioral tests without the cost confirmation. Use filters before a full run:

```bash
# Exact scenario IDs are OR filters.
npm run test:runtime -- \
  --confirm-llm-cost \
  --id bootstrap-001-explicit-greenfield-activation \
  --id loader-001-greenfield-start

# Every supplied tag must match. Runs remain sequential.
npm run test:runtime -- \
  --confirm-llm-cost \
  --tag severity:critical \
  --max-tests 10

# A full 148-scenario run requires a second explicit signal.
npm run test:runtime -- \
  --confirm-llm-cost \
  --all
```

`--all` cannot be combined with `--id`, `--tag`, or `--max-tests`.

Optional execution settings:

```bash
npm run test:runtime -- \
  --confirm-llm-cost \
  --max-tests 1 \
  --model <executor-model> \
  --judge-model <judge-model> \
  --timeout-ms 180000
```

Use `--codex-command <path>` or `STUDIO_OS_CODEX_COMMAND` when `codex` is not on `PATH`.

Commands print per-test status and a final summary:

- `PASS`: every test passed structural validation or judge evaluation.
- `FAIL`: at least one test is invalid or failed evaluation.
- `PARTIAL`: no test matched, the judge returned incomplete evidence, or an evaluation could not produce a complete assessment.

`FAIL` and `PARTIAL` both return a non-zero exit code in behavioral mode.

Generated artifacts under `test-results/latest/` include:

- `summary.md`: compact result table and assurance label;
- `results.json`: machine-readable aggregate including executor and judge metadata;
- `evaluations/<scenario-id>.json`: the final Runtime response, per-expectation evidence, adapter names, and durations.

These artifacts contain final responses and concise observable evidence only. They do not request or store hidden chain-of-thought.

## Assurance Levels

1. `npm run test:runner` deterministically tests the TypeScript runner and repository structure.
2. `npm run test:runtime:dry` deterministically validates Markdown scenario definitions only.
3. `npm run test:runtime -- --confirm-llm-cost ...` executes Universal Bootstrap against synthetic one-turn scenario context and uses an LLM judge.
4. `docs/MANUAL_TESTING.md` defines end-to-end multi-turn checks, file mutations, and installed Codex, Claude Code, and filesystem adapter behavior.

Level 3 is nondeterministic and model-dependent. It does not prove:

- that expected files were created or changed;
- that state persists correctly across multiple turns;
- that installed host adapters activate correctly;
- that a real Brownfield fixture matches the synthetic scenario context.

Use a different `--judge-model` when independent model judgment matters. Without it, executor and judge are separate sessions but may use the same default model.

Behavioral evaluation is intentionally excluded from the GitHub release workflow because it requires credentials, incurs model usage, and is nondeterministic. Release automation continues to require deterministic runner tests and Runtime scenario validation.

## Custom Test Directory

Use `--tests-dir` with either dry or behavioral mode:

```bash
npm run test:runtime:dry -- --tests-dir path/to/runtime-tests
```

## Harness Contract

The harness keeps four responsibilities separate:

1. Runner discovers and validates Markdown scenario definitions.
2. Runtime executor reads Universal Bootstrap and produces one user-facing response without seeing `expect`.
3. Response judge receives the response and evaluates every observable expectation in a separate session.
4. Harness derives the final status, rejects malformed or incomplete verdicts, and writes diagnostic artifacts.

The physical workspace is empty and read-only. The Markdown body is supplied as authoritative synthetic state for the turn. This makes contract checks practical without pretending they are full fixture or lifecycle tests.

Manual end-to-end checks for existing and new projects are documented in `docs/MANUAL_TESTING.md`.
