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

## Fixture-Backed Scenarios

A scenario may declare a real disposable Target Workspace:

```yaml
fixture: tests/fixtures/runtime/brownfield-web/input
workspace_assertions: tests/fixtures/runtime/brownfield-web/assertions.json
```

Both paths are required together and resolve from the Studio OS repository
root. They must remain inside the repository. Fixture trees cannot contain
symlinks.

The assertion manifest is stored outside the fixture input so the Runtime
executor cannot read expected mutations:

```json
{
  "version": 1,
  "created": [".studio/project-state.md"],
  "unchanged": ["package.json", "src/App.tsx"],
  "absent": ["docs/roadmap.md"],
  "allowedChanges": [".studio/project-state.md"],
  "contains": {
    ".studio/project-state.md": [
      "Mode: Brownfield",
      "Current Stage: Briefing"
    ]
  },
  "notContains": {
    ".studio/project-state.md": ["/Users/", "file://"]
  }
}
```

Supported assertions:

- `created`, `modified`, and `deleted`: exact file changes required by the scenario;
- `unchanged`: fixture files that must retain the same content hash;
- `absent`: files or directories that must not exist after execution;
- `allowedChanges`: an exact allowlist for all created, modified, or deleted files;
- `contains` and `notContains`: literal content checks for generated text artifacts.

The harness copies fixture input to a temporary workspace, snapshots it before
and after execution, evaluates assertions, and deletes the copy. It never runs
the model against the source fixture. A deterministic workspace failure makes
the scenario fail even when the response judge accepts the user-facing text.

## Multi-Turn Replay

A scenario can declare follow-up turns in a repository-local replay file:

```yaml
replay: tests/fixtures/runtime/existing-project-routing/replay.json
```

The Markdown `prompt`, `expect`, and optional `workspace_assertions` define the
initial turn. The replay JSON defines one to five follow-up turns:

```json
{
  "version": 1,
  "turns": [
    {
      "id": "confirm-routing-migration",
      "prompt": "Apply the proposed routing fields.",
      "expect": [
        "Confirms the migration without starting stage work."
      ],
      "workspace_assertions": "tests/fixtures/runtime/example/after-confirmation.json"
    }
  ]
}
```

Turn IDs must be unique kebab-case values. `initial` is reserved for the
Markdown turn. A fixture-backed replay requires a separate
`workspace_assertions` manifest for every follow-up; a synthetic replay cannot
declare workspace assertions.

The executor keeps one disposable fixture workspace for the whole replay and
evaluates each manifest against the previous turn's checkpoint. Codex CLI
sessions remain isolated: the harness supplies prior observable user and Studio
OS messages to each fresh executor session. Expectations and assertion
manifests are never included in executor prompts. One separate judge evaluates
all turn responses in declared order.

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

This command does not start Studio OS, produce a Runtime response, or judge
behavior. A result such as `150/150 PASS` means that 150 scenario definitions
have valid frontmatter, expectations, and bodies. It is not evidence that 150
conversations were executed successfully.

Runtime contract evaluation executes Universal Bootstrap in a disposable
workspace and evaluates observable responses with a separate LLM judge
session:

```bash
npm run test:runtime -- \
  --confirm-llm-cost \
  --id bootstrap-001-explicit-greenfield-activation
```

Behavioral mode requires:

- an installed and authenticated Codex CLI;
- an explicit `--confirm-llm-cost` flag;
- one Runtime executor call per declared turn, plus one response-judge call per
  scenario.

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

# A full 150-scenario run requires a second explicit signal.
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

To keep executor and judge inference on the local machine, use the direct
Ollama engine and an installed local model:

```bash
npm run test:runtime -- \
  --confirm-llm-cost \
  --id fixture-002-existing-project-routing-replay \
  --engine ollama \
  --model qwen2.5-coder:14b \
  --judge-model qwen2.5-coder:14b \
  --timeout-ms 300000
```

The direct Ollama engine uses structured local `read_file`, `list_directory`,
and `write_file` actions. Reads are confined to Studio OS and the disposable
Target Workspace; writes are confined to the disposable workspace. It does not
provide a shell tool. The confirmation flag remains required because the run
still consumes model compute, even when it does not use a paid remote API.

`--local-provider ollama|lmstudio` remains available for Codex CLI's native OSS
mode when the selected model implements the protocol Codex expects. Do not
combine it with `--engine ollama`.

Run the first fixture-backed Brownfield contract with:

```bash
npm run test:runtime -- \
  --confirm-llm-cost \
  --id fixture-001-brownfield-project-memory \
  --timeout-ms 300000
```

Run the existing-project two-turn migration replay with:

```bash
npm run test:runtime -- \
  --confirm-llm-cost \
  --id fixture-002-existing-project-routing-replay \
  --timeout-ms 300000
```

Synthetic scenarios run in an empty read-only workspace. Fixture-backed
scenarios run in a disposable `workspace-write` copy. A single-turn scenario
uses two model calls. A replay with `N` declared turns uses `N + 1` calls.

Commands print per-test status and a final summary:

- `PASS`: every test passed structural validation or judge evaluation.
- `FAIL`: at least one test is invalid or failed evaluation.
- `PARTIAL`: no test matched, the judge returned incomplete evidence, or an evaluation could not produce a complete assessment.

`FAIL` and `PARTIAL` both return a non-zero exit code in behavioral mode.

Generated artifacts under `test-results/latest/` include:

- `summary.md`: compact result table and assurance label;
- `results.json`: machine-readable aggregate including executor and judge metadata;
- `evaluations/<scenario-id>.json`: the final Runtime response, per-expectation evidence, adapter names, durations, and fixture diff/assertion evidence when applicable.

These artifacts contain final responses and concise observable evidence only. They do not request or store hidden chain-of-thought.

## Assurance Levels

1. `npm run test:runner` deterministically tests the TypeScript runner and repository structure.
2. `npm run test:runtime:dry` deterministically validates Markdown scenario definitions only.
3. `npm run test:runtime -- --confirm-llm-cost ...` executes Universal
   Bootstrap and uses an LLM judge. Synthetic scenarios evaluate declared
   response turns; fixture scenarios additionally evaluate deterministic file
   mutations at every declared checkpoint in one disposable workspace.
4. `docs/MANUAL_TESTING.md` defines end-to-end multi-turn checks and installed Codex, Claude Code, and filesystem adapter behavior.

Level 3 is nondeterministic and model-dependent. It does not prove:

- that an installed host preserves hidden conversation state beyond the
  observable transcript and physical workspace supplied by the replay;
- that installed host adapters activate correctly;
- that undeclared product behavior is correct;
- that synthetic scenarios performed any file mutation;
- that one fixture represents every Greenfield or Brownfield project shape.

A passing fixture scenario proves only that its user-facing expectations and
declared deterministic workspace assertions passed in that run.

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
2. Runtime executor reads Universal Bootstrap and produces one user-facing
   response per declared turn without seeing `expect`.
3. Response judge receives all declared turn responses and evaluates every
   observable expectation in one separate session.
4. Harness derives the final status, rejects malformed or incomplete verdicts, and writes diagnostic artifacts.

For a synthetic scenario, the physical workspace is empty and read-only and
the Markdown body is authoritative state. For a fixture-backed scenario, the
copied physical workspace is authoritative and the body supplies only test
context. Workspace assertions remain outside the executor prompt.

Replay verifies only its declared turns and checkpoints. It is not a complete
product lifecycle or installed-adapter test.

Manual end-to-end checks for existing and new projects are documented in `docs/MANUAL_TESTING.md`.
