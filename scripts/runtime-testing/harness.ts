import type {
  HarnessEvaluation,
  ResponseJudge,
  RuntimeExecutor,
  RuntimeScenario,
} from "./contracts.ts";
import {
  runtimeExpectationLabels,
  runtimeTurns,
} from "./scenario.ts";

export class RuntimeHarness {
  constructor(
    private readonly executor: RuntimeExecutor,
    private readonly judge: ResponseJudge,
  ) {}

  async evaluate(scenario: RuntimeScenario): Promise<HarnessEvaluation> {
    let execution;

    try {
      execution = await this.executor.execute(scenario);
    } catch (error) {
      return {
        status: "FAIL",
        details: [
          `Runtime executor ${this.executor.name} failed: ${errorMessage(error)}`,
        ],
      };
    }

    const emptyTurn = execution.turns?.find(
      (turn) => !turn.response.trim(),
    );
    if (!execution.response.trim() || emptyTurn) {
      return {
        status: "FAIL",
        details: [
          emptyTurn
            ? `Runtime executor ${this.executor.name} returned an empty response for turn ${emptyTurn.id}.`
            : `Runtime executor ${this.executor.name} returned an empty response.`,
          ...workspaceDetails(execution),
        ],
        execution,
      };
    }

    let verdict;

    try {
      verdict = await this.judge.evaluate(scenario, execution);
    } catch (error) {
      return {
        status: "FAIL",
        details: [
          `Response judge ${this.judge.name} failed: ${errorMessage(error)}`,
          ...workspaceDetails(execution),
        ],
        execution,
      };
    }

    const expectations = runtimeExpectationLabels(scenario);
    if (verdict.expectations.length !== expectations.length) {
      return {
        status: execution.workspace?.status === "FAIL" ? "FAIL" : "PARTIAL",
        details: [
          ...workspaceDetails(execution),
          verdict.summary,
          `Judge assessment count ${verdict.expectations.length} does not match ${expectations.length} expectation(s).`,
        ],
        execution,
        verdict,
      };
    }

    const details = [
      `Runtime turns: ${runtimeTurns(scenario).length}.`,
      ...workspaceDetails(execution),
      verdict.summary,
      ...verdict.expectations.map(
        (assessment) =>
          `${assessment.met ? "MET" : "NOT MET"}: ${assessment.expectation} - ${assessment.evidence}`,
      ),
    ];

    if (execution.workspace?.status === "FAIL") {
      return {
        status: "FAIL",
        details,
        execution,
        verdict,
      };
    }

    if (verdict.status === "PARTIAL") {
      return {
        status: "PARTIAL",
        details,
        execution,
        verdict,
      };
    }

    if (verdict.expectations.some((assessment) => !assessment.met)) {
      return {
        status: "FAIL",
        details,
        execution,
        verdict,
      };
    }

    if (verdict.status === "FAIL") {
      return {
        status: "FAIL",
        details,
        execution,
        verdict,
      };
    }

    return {
      status: "PASS",
      details,
      execution,
      verdict,
    };
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function workspaceDetails(
  execution: Awaited<ReturnType<RuntimeExecutor["execute"]>>,
): string[] {
  if (!execution.workspace) {
    return [];
  }

  const { diff, assertions } = execution.workspace;
  const failed = assertions.filter((assessment) => !assessment.met);
  return [
    `Workspace diff: ${diff.created.length} created, ${diff.modified.length} modified, ${diff.deleted.length} deleted.`,
    `Workspace assertions: ${assertions.length - failed.length}/${assertions.length} met.`,
    ...failed.map(
      (assessment) =>
        `WORKSPACE NOT MET: ${assessment.assertion} - ${assessment.evidence}`,
    ),
  ];
}
