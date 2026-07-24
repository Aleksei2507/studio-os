export type BehavioralStatus = "PASS" | "FAIL" | "PARTIAL";

export interface WorkspaceAssertions {
  version: 1;
  created?: string[];
  modified?: string[];
  deleted?: string[];
  unchanged?: string[];
  absent?: string[];
  allowedChanges?: string[];
  contains?: Record<string, string[]>;
  notContains?: Record<string, string[]>;
}

export interface WorkspaceAssertionSpec {
  assertionsFile: string;
  assertions: WorkspaceAssertions;
}

export interface FixtureWorkspaceSpec extends WorkspaceAssertionSpec {
  fixtureDirectory: string;
}

export interface WorkspaceDiff {
  created: string[];
  modified: string[];
  deleted: string[];
}

export interface WorkspaceAssertionAssessment {
  assertion: string;
  met: boolean;
  evidence: string;
}

export interface WorkspaceEvaluation {
  status: "PASS" | "FAIL";
  diff: WorkspaceDiff;
  assertions: WorkspaceAssertionAssessment[];
}

export interface RuntimeFollowUpTurn {
  id: string;
  prompt: string;
  expect: string[];
  workspace?: WorkspaceAssertionSpec;
}

export interface RuntimeReplaySpec {
  replayFile: string;
  turns: RuntimeFollowUpTurn[];
}

export interface RuntimeScenario {
  filePath: string;
  id: string;
  title: string;
  stage: string;
  prompt: string;
  expect: string[];
  tags: string[];
  body: string;
  workspace?: FixtureWorkspaceSpec;
  replay?: RuntimeReplaySpec;
}

export interface RuntimeTurnExecution {
  id: string;
  prompt: string;
  response: string;
  durationMs: number;
  workspace?: WorkspaceEvaluation;
}

export interface RuntimeExecution {
  adapter: string;
  response: string;
  durationMs: number;
  workspace?: WorkspaceEvaluation;
  turns?: RuntimeTurnExecution[];
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
