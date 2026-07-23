export type BehavioralStatus = "PASS" | "FAIL" | "PARTIAL";

export interface RuntimeScenario {
  filePath: string;
  id: string;
  title: string;
  stage: string;
  prompt: string;
  expect: string[];
  tags: string[];
  body: string;
}

export interface RuntimeExecution {
  adapter: string;
  response: string;
  durationMs: number;
}

export interface ExpectationAssessment {
  expectation: string;
  met: boolean;
  evidence: string;
}

export interface JudgeVerdict {
  adapter: string;
  status: BehavioralStatus;
  summary: string;
  expectations: ExpectationAssessment[];
  durationMs: number;
}

export interface RuntimeExecutor {
  name: string;
  execute(scenario: RuntimeScenario): Promise<RuntimeExecution>;
}

export interface ResponseJudge {
  name: string;
  evaluate(
    scenario: RuntimeScenario,
    execution: RuntimeExecution,
  ): Promise<JudgeVerdict>;
}

export interface HarnessEvaluation {
  status: BehavioralStatus;
  details: string[];
  execution?: RuntimeExecution;
  verdict?: JudgeVerdict;
}
