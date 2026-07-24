import type {
  RuntimeFollowUpTurn,
  RuntimeScenario,
  WorkspaceAssertionSpec,
} from "./contracts.ts";

export interface RuntimeTurn {
  id: string;
  prompt: string;
  expect: string[];
  workspace?: WorkspaceAssertionSpec;
}

export function runtimeTurns(scenario: RuntimeScenario): RuntimeTurn[] {
  const initialWorkspace = scenario.workspace
    ? {
        assertionsFile: scenario.workspace.assertionsFile,
        assertions: scenario.workspace.assertions,
      }
    : undefined;

  return [
    {
      id: "initial",
      prompt: scenario.prompt,
      expect: scenario.expect,
      workspace: initialWorkspace,
    },
    ...(scenario.replay?.turns ?? []).map(fromFollowUpTurn),
  ];
}

export function runtimeExpectationLabels(
  scenario: RuntimeScenario,
): string[] {
  const turns = runtimeTurns(scenario);
  if (turns.length === 1) {
    return scenario.expect;
  }

  return turns.flatMap((turn) =>
    turn.expect.map((expectation) => `[${turn.id}] ${expectation}`),
  );
}

function fromFollowUpTurn(turn: RuntimeFollowUpTurn): RuntimeTurn {
  return {
    id: turn.id,
    prompt: turn.prompt,
    expect: turn.expect,
    workspace: turn.workspace,
  };
}
