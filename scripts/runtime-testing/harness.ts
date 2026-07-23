import type {
  HarnessEvaluation,
  ResponseJudge,
  RuntimeExecutor,
  RuntimeScenario,
} from "./contracts.ts";

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

    if (!execution.response.trim()) {
      return {
        status: "FAIL",
        details: [`Runtime executor ${this.executor.name} returned an empty response.`],
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
        ],
        execution,
      };
    }

    if (verdict.expectations.length !== scenario.expect.length) {
      return {
        status: "PARTIAL",
        details: [
          verdict.summary,
          `Judge assessment count ${verdict.expectations.length} does not match ${scenario.expect.length} expectation(s).`,
        ],
        execution,
        verdict,
      };
    }

    const details = [
      verdict.summary,
      ...verdict.expectations.map(
        (assessment) =>
          `${assessment.met ? "MET" : "NOT MET"}: ${assessment.expectation} - ${assessment.evidence}`,
      ),
    ];

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
