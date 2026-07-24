# Behavioral Assurance Policy

Status: Alpha

Policy Version: 1

## Purpose

This policy defines how maintainers run and interpret Studio OS Runtime
behavioral tests. It keeps repository defects, model incompatibility,
infrastructure errors, and statistical instability separate.

The machine-readable policy is
`tests/runtime/behavioral-policy.json`. This document is the normative
explanation of that contract.

## Assurance Layers

Run the layers in order:

1. `npm run test:runner` verifies deterministic harness and repository
   structure.
2. `npm run test:runtime:dry` verifies Runtime scenario definitions.
3. A behavioral trial executes every declared turn, evaluates fixture
   checkpoints, and asks a separate judge to assess observable responses.
4. Installed-adapter dogfooding verifies host activation and behavior that the
   isolated harness cannot reproduce.

Do not run or classify model compatibility while either deterministic layer is
failing.

## Behavioral Trial

One behavioral trial consists of:

- one selected scenario;
- one executor call for each declared turn;
- one separate judge call for the complete scenario;
- every declared workspace checkpoint;
- one immutable result record.

The planned model-call count for a trial is:

```text
declared turns + 1 judge call
```

The runner must not automatically retry a failed trial. A failure is evidence,
not permission to keep sampling until PASS.

## Trial Identity

A baseline trial must record:

- Studio OS version and Git revision;
- scenario ID and scenario revision;
- engine and adapter;
- exact executor model identity;
- exact judge model identity;
- provider or host version when available;
- timeout and trial number;
- execution timestamp.

An implicit host-default model is acceptable for exploration but is not
baseline-eligible. Mutable model tags should include a provider digest or
equivalent immutable revision when the provider exposes one.

A baseline-eligible trial also requires a clean Git working tree. Dirty-tree
runs remain useful exploratory evidence, but their exact Studio OS and scenario
revision is not reproducible from the recorded commit alone.

## Validity

A trial is valid when:

- deterministic repository gates passed before execution;
- the executor completed every declared turn;
- the judge returned a schema-valid assessment for every expectation;
- all declared workspace checkpoints were evaluated;
- the result contains the required trial identity.

Executor startup failures, unavailable providers, timeouts, truncated
responses, and malformed judge output produce an invalid trial. They are not a
behavioral PASS or FAIL for compatibility classification. The harness may
still surface an overall FAIL when independent deterministic workspace
evidence already proves a behavioral violation. The result must record
`validTrial: false` and remain excluded from the three-trial pass count. After
the infrastructure cause is corrected, run a new trial and retain the invalid
result separately.

## Compatibility Classification

A model and adapter combination needs three independent valid trials of every
critical scenario:

- **Compatible:** 3 of 3 trials PASS.
- **Flaky:** 1 or 2 of 3 trials PASS.
- **Incompatible:** 0 of 3 trials PASS.
- **Unknown:** fewer than 3 valid trials exist.

A prohibited workspace mutation, safety violation, or scope-boundary violation
in a critical scenario is immediately incompatible for that scenario. Do not
average it away with successful trials.

Compatibility is scoped to the recorded Studio OS revision, adapter, executor
model, judge model, and scenario set. It is not a permanent rating of a model.

## Failure Ownership

Classify evidence before changing Studio OS or a scenario:

- **Repository defect:** deterministic runner or structure gate fails.
- **Harness defect:** the harness supplies the wrong context, leaks hidden
  expectations, evaluates the wrong checkpoint, or records incorrect evidence.
- **Runtime contract regression:** the tested Studio OS instructions no longer
  require the expected observable behavior.
- **Model incompatibility:** the harness and contract are correct, but the
  executor response or workspace mutation violates the scenario.
- **Judge incompatibility:** observable evidence is correct, but the judge
  cannot return a complete schema-valid assessment.
- **Infrastructure error:** the selected engine, provider, host, or timeout
  prevents a valid trial.

Do not weaken a scenario merely to make a model pass. Change an expectation
only when the accepted Studio OS contract changed or the scenario was shown to
test behavior outside that contract.

## Budget And Selection

- Behavioral execution always requires `--confirm-llm-cost`, including local
  inference.
- Exploratory runs are limited to 10 selected scenarios.
- Use `--id`, `--tag`, or `--max-tests` before considering `--all`.
- A full suite requires the explicit `--all` signal.
- Estimate calls from declared turns before approving a remote run.
- Executor and judge runs are sequential unless a future policy revision
  defines a concurrency budget.

## Privacy

Repository fixtures must be synthetic and free of secrets or personal project
data. Do not send a real project fixture, transcript, or artifact to a remote
model without explicit authorization for that data.

Checked-in compatibility summaries must omit machine-specific paths, private
prompts, complete model transcripts, and disposable workspace locations.

## Promotion Gate

A compatibility baseline can be published only when:

- all deterministic gates pass;
- every critical scenario has three valid trials;
- model and adapter identities are reproducible;
- failures and invalid trials remain visible;
- a maintainer reviews the classification.

Behavioral PASS does not replace installed-adapter dogfooding or product QA.
