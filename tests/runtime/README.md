# Studio OS Runtime Regression Scenarios

Runtime scenarios live under `tests/runtime/**/*.md`.

Run structural validation without model calls:

```bash
npm run test:runtime:dry
```

Run a bounded behavioral scenario only with explicit model-cost confirmation:

```bash
npm run test:runtime -- \
  --confirm-llm-cost \
  --id <scenario-id>
```

Most scenarios use synthetic one-turn context. Scenarios with `fixture` and
`workspace_assertions` run against disposable physical workspaces and add
deterministic file assertions.

See `docs/runtime-testing.md` for the schema, assurance levels, fixture
contract, and report format.
