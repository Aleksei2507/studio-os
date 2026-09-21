# Model Orchestration Capability

## Purpose

Plan and coordinate bounded native subagents using the current host's actual model and tool capabilities. The leading agent remains the coordinator; model selection applies to individual subagents, not to switching the main conversation model.

This capability includes a complete single-model path. Missing subagent tools or model selection alone does not make it unavailable. Missing the underlying implementation or verification capability still follows that capability's blocked behavior.

## Stage Boundary

- Architecture selects an execution strategy for accepted product scope and creates the active orchestration plan. It does not launch development subagents or implement their tasks.
- Task Decomposition binds the plan to task IDs, acceptance criteria, ownership, dependencies, and verification.
- Development refreshes host evidence, dispatches eligible subagents, verifies results, and integrates the accepted changes.
- Validation, QA, Product Outcome, and Release keep their existing responsibilities. A subagent cannot accept scope changes or advance the workflow on the coordinator's behalf.

Do not use orchestration to skip the active Brief, required stage, or confirmation. Delegating the process is not accepting unspecified product decisions.

## Host Evidence

Inspect only capabilities relevant to the current task, using the host's exposed tool contracts, model catalog/settings when available, and actual tool responses. Do not treat instructions to use subagents as evidence that a subagent tool exists.

Record the source and observation time/session for:

- coordinator model identity, if the host discloses it; otherwise `Unknown`;
- native subagent launch, status/wait, message, and cancellation capabilities, including their permissions and concurrency limit;
- supported per-subagent model selector and permitted model IDs; a displayed model catalog is not permission to override a host restriction;
- tools, repository access, context constraints, and isolation available to each candidate;
- model capability/cost evidence, usage telemetry, and enforceable budget controls, when exposed.

Mark unsupported or unreported fields `Unavailable` or `Unknown`. Never infer the actual model from an agent's self-description, brand, role name, or prior session. Separate a requested model ID from a tool-confirmed actual identity.

Use current authoritative provider information only when a material choice needs external facts and approved host evidence is insufficient. Do not preload pricing tables, keep a permanent model ranking, or use remembered prices as current evidence.

## Execution Modes

Select and record one mode:

- `single-model`: the coordinator performs the work; choose it when delegation is unavailable, unjustified, or cannot meet constraints.
- `same-model-delegation`: native subagents use the host's default/inherited model. Record that identity as `Unknown` if not disclosed; do not claim a different or cheaper model was used.
- `multi-model`: native subagents receive supported, permitted model selectors drawn from current evidence. Keep the coordinator in place. Without confirmed selection support, fall back to a mode the host actually supports.

If the user or host fixes a model, reasoning effort, provider, or tool scope, preserve that constraint. Do not change account defaults, install a CLI, create a side API client, buy credits, or create separate user-facing tasks to emulate native subagents.

## Assignment Decision

For each bounded work group, evaluate:

1. Accepted outcome and available acceptance checks.
2. Reasoning difficulty, ambiguity, risk, required tools, and necessary context.
3. Independence, dependencies, shared files/interfaces, and integration cost.
4. Candidate suitability based on host evidence or relevant observed results; model names are not competence evidence.
5. Total expected work: coordinator planning, context transfer, execution, likely retries, review, and integration.

Keep consequential decisions and poorly bounded work with the coordinator. Prefer a lower-cost suitable candidate for clear, isolated work only when cost and capability evidence support that choice. Use a stronger permitted candidate or the coordinator when risk or a failed check justifies it. Do not delegate a trivial or tightly coupled change merely to use multiple models.

When comparative evidence is absent, use a conservative host default and record the uncertainty. Do not automatically run paid benchmarks to choose a model. A separate reviewer is useful when it can find independent errors, but another subagent is not proof of independent or better reasoning.

## Plan And Limits

Architecture creates `docs/orchestration-plan.md` for lifecycle work or `work-items/<id>/orchestration-plan.md` for an active Work Item, using `templates/orchestration-plan.md`. Reference the active plan from Project Memory. Include a compact plan even for `single-model`; do not manufacture worker assignments.

Record scope/AC references, current host evidence, selected mode, assignment rationale, verification, fallback, and limits. Default limits, unless stricter host/user limits apply:

- at most two concurrently running subagents, also bounded by available host slots;
- at most two execution attempts per task in total, including changed models and coordinator fallback after a failed attempt;
- one delegation level; subagents must not create additional agents unless an explicitly bounded plan permits it;
- no automatic benchmark runs or unbounded polling/retry loops.

An execution attempt is one bounded run of an assignment, including its ordinary local edits and checks. A returned failure, failed job, or incomplete handoff ends that attempt; re-dispatch or coordinator takeover to repair it starts another. Status queries and individual local test runs are not separate attempts. Do not hide repeated failed handoffs inside one purported attempt.

Honor any user-supplied monetary, token, time, or provider budget. Name which limits are enforceable by the host and which are planning estimates. If a hard money/token limit cannot be enforced, do not launch extra subagents under an assurance that the limit is protected; retain an authorized single-model path or ask one focused budget decision when necessary. Never silently raise the budget, move to a more expensive provider, or treat missing prices as zero cost.

Lack of a user-supplied numeric budget does not require a new approval for every ordinary subagent within already authorized host capabilities. Use the bounded defaults, disclose unknown cost, and avoid unsupported savings claims.

## Subagent Task Contract

Before dispatch, give each subagent only the context required for its task:

- task ID and linked acceptance criteria; expected outcome and explicit non-goals;
- permitted files/modules and shared interface ownership; other agents' work must be preserved;
- dependency inputs and the exact evidence they produced;
- relevant project instructions, standards, graph evidence/coverage gaps when required, and project-relative source references;
- selected permitted model or host-default choice, tool/data limits, and no further delegation by default;
- required outputs: change summary, changed files, checks with outcomes, unresolved issues, and limitations;
- acceptance checks, attempt allowance, stop/escalation conditions, and who integrates the result.

Do not send the whole conversation, secrets, or unrelated repository content by default. Existing authorization and data boundaries apply to each model recipient. A worker may request missing context; it must not invent dependencies or expand scope to compensate.

## Native Dispatch And Integration

1. Refresh capabilities and the plan before dispatch. Confirm required selected stages and dependencies are complete.
2. Use the actual native subagent tool. Pass a model selector only when supported and authorized; otherwise retain host-default/inherited behavior. Record the returned task/agent ID and observed model identity separately from the requested identity.
3. Run in parallel only when write ownership and dependencies permit it. Serialize overlapping writes or agree an isolated integration strategy before launch. Tell workers they are not alone and must preserve others' changes.
4. Track `planned`, `running`, `returned`, `accepted`, `failed`, or `blocked` with attempts and evidence. Use the host's bounded wait/status mechanism; do not call a queued or running job complete.
5. Inspect the actual changes and run appropriate acceptance checks. A worker's confident report or passing local check alone is not acceptance of the integrated result.
6. Integrate accepted work in dependency order and verify affected boundaries. The coordinator owns conflicts and final consistency; workers cannot remove failing tests or overwrite unrelated changes to pass.
7. Record failures and decide a bounded retry, stronger permitted candidate, coordinator fallback, or blocker. All execution attempts share the task limit. Stop additional dispatch once the allowance is exhausted; preserve work and report the remaining issue.

Use meaningful progress changes rather than repeated identical polling updates. Do not leave workers modifying files after reporting completion; wait for them or stop them through the host before closing the delivery unit.

## Resume And Legacy Projects

On a new session, host change, interruption, or unexpected model/tool failure, revalidate the environment and only the affected assignments. Query the host for known unfinished job IDs before dispatching replacements. If a prior writer's status is unknown, avoid another writer in that scope until the first is confirmed stopped or its changes are safely isolated and reconciled. Do not replay already accepted work.

If a legacy or bounded workflow reaches Development without a plan, create a compact `single-model` plan from its accepted scope and current capability evidence. Do not restart onboarding or force Architecture solely to add optimization metadata. Route a material strategy, ownership, or scope change to the responsible stage; a routine supported assignment update within accepted constraints does not require another product interview.

## Evidence

- Active scoped plan and source of host/model information.
- Actual dispatch IDs, requested versus observed model identities, task states, attempts, and changed-file ownership.
- Coordinator acceptance and integration checks, failures, and unresolved limitations.
- Reported input/output tokens, cost, or latency only when available from reliable host telemetry; label estimates and `Unknown` separately. Include coordinator, workers, review, and retries when totals are available, without double-counting cumulative counters.
- Savings require a comparable measured baseline. Better quality requires outcome evidence. Without those, report the intended optimization and verified result without numerical savings or superiority claims.

## Unavailable Behavior

Use the supported single-model path when subagents or model selection are missing. Explain the limitation once and continue authorized work. Stop only the affected work when underlying implementation, verification, permission, or an enforceable hard requirement is missing; do not pretend native delegation occurred.
