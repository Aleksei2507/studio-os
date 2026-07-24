import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { OllamaPromptRunner } from "../../scripts/runtime-testing/ollama.ts";

function createWorkspace(): {
  bootstrapPath: string;
  studioOsRoot: string;
  workspace: string;
} {
  const root = mkdtempSync(path.join(tmpdir(), "studio-os-ollama-test-"));
  const studioOsRoot = path.join(root, "studio-os");
  const workspace = path.join(root, "workspace");
  const bootstrapPath = path.join(
    studioOsRoot,
    "adapters",
    "universal",
    "BOOTSTRAP.md",
  );
  mkdirSync(path.dirname(bootstrapPath), { recursive: true });
  mkdirSync(path.join(workspace, ".studio"), { recursive: true });
  writeFileSync(bootstrapPath, "# Universal Bootstrap\n");
  writeFileSync(
    path.join(workspace, ".studio", "project-state.md"),
    "Mode: Brownfield\nCurrent Stage: QA\n",
  );
  return { bootstrapPath, studioOsRoot, workspace };
}

function responseQueue(
  responses: unknown[],
  requests: Array<Record<string, unknown>>,
): typeof fetch {
  return (async (_input, init) => {
    requests.push(JSON.parse(String(init?.body)));
    const response = responses.shift();
    assert.notEqual(response, undefined);
    return new Response(
      JSON.stringify({
        message: {
          content: JSON.stringify(response),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }) as typeof fetch;
}

describe("direct Ollama Runtime runner", () => {
  it("uses bounded read and write actions before returning a final response", async () => {
    const { bootstrapPath, studioOsRoot, workspace } = createWorkspace();
    const requests: Array<Record<string, unknown>> = [];
    const fetchImpl = responseQueue(
      [
        {
          action: "read_file",
          path: bootstrapPath,
          content: "",
          response: "",
        },
        {
          action: "read_file",
          path: ".studio/project-state.md",
          content: "",
          response: "",
        },
        {
          action: "write_file",
          path: ".studio/project-state.md",
          content:
            "Mode: Brownfield\nWorkflow: brownfield\nCurrent Stage: QA\n",
          response: "",
        },
        {
          action: "final",
          path: "",
          content: "",
          response: "Routing migration applied.",
        },
      ],
      requests,
    );
    const runner = new OllamaPromptRunner({
      fetch: fetchImpl,
      model: "local-test",
      studioOsRoot,
      timeoutMs: 10_000,
    });

    const result = await runner.run({
      prompt: `Read and follow ${bootstrapPath}.`,
      sandbox: "workspace-write",
      workingDirectory: workspace,
    });

    assert.equal(result.response, "Routing migration applied.");
    assert.match(
      readFileSync(
        path.join(workspace, ".studio", "project-state.md"),
        "utf8",
      ),
      /Workflow: brownfield/,
    );
    assert.equal(requests.length, 4);
    assert.match(JSON.stringify(requests[0]), /file \.studio\/project-state\.md/);
    assert.match(JSON.stringify(requests[1]), /Universal Bootstrap/);
    assert.match(JSON.stringify(requests[2]), /Current Stage: QA/);
  });

  it("rejects writes outside the disposable Target Workspace", async () => {
    const { studioOsRoot, workspace } = createWorkspace();
    const runner = new OllamaPromptRunner({
      fetch: responseQueue(
        [
          {
            action: "write_file",
            path: "../outside.md",
            content: "not allowed",
            response: "",
          },
        ],
        [],
      ),
      model: "local-test",
      studioOsRoot,
      timeoutMs: 10_000,
    });

    await assert.rejects(
      () =>
        runner.run({
          prompt: "Write outside the workspace.",
          sandbox: "workspace-write",
          workingDirectory: workspace,
        }),
      /inside the Target Workspace/,
    );
  });

  it("does not expose test definitions from the Studio OS repository", async () => {
    const { studioOsRoot, workspace } = createWorkspace();
    mkdirSync(path.join(studioOsRoot, "tests"), { recursive: true });
    writeFileSync(
      path.join(studioOsRoot, "tests", "expectations.json"),
      '{"secret":"expected result"}\n',
    );
    const runner = new OllamaPromptRunner({
      fetch: responseQueue(
        [
          {
            action: "read_file",
            path: path.join(
              studioOsRoot,
              "tests",
              "expectations.json",
            ),
            content: "",
            response: "",
          },
        ],
        [],
      ),
      model: "local-test",
      studioOsRoot,
      timeoutMs: 10_000,
    });

    await assert.rejects(
      () =>
        runner.run({
          prompt: "Read test expectations.",
          sandbox: "workspace-write",
          workingDirectory: workspace,
        }),
      /outside allowed roots/,
    );
  });

  it("returns missing-file errors to the model so it can recover", async () => {
    const { studioOsRoot, workspace } = createWorkspace();
    const requests: Array<Record<string, unknown>> = [];
    const runner = new OllamaPromptRunner({
      fetch: responseQueue(
        [
          {
            action: "read_file",
            path: ".studio/missing.md",
            content: "",
            response: "",
          },
          {
            action: "list_directory",
            path: ".studio",
            content: "",
            response: "",
          },
          {
            action: "final",
            path: "",
            content: "",
            response: "Recovered after inspecting the directory.",
          },
        ],
        requests,
      ),
      model: "local-test",
      studioOsRoot,
      timeoutMs: 10_000,
    });

    const result = await runner.run({
      prompt: "Inspect Project Memory.",
      sandbox: "workspace-write",
      workingDirectory: workspace,
    });

    assert.equal(
      result.response,
      "Recovered after inspecting the directory.",
    );
    assert.match(JSON.stringify(requests[1]), /does not exist/);
    assert.match(JSON.stringify(requests[2]), /project-state\.md/);
  });

  it("uses the supplied schema directly for response judgment", async () => {
    const { studioOsRoot } = createWorkspace();
    const requests: Array<Record<string, unknown>> = [];
    const schema = {
      type: "object",
      properties: {
        status: { type: "string" },
      },
      required: ["status"],
    };
    const verdict = {
      status: "PASS",
      summary: "Met.",
      expectations: [],
    };
    const fetchImpl = (async (_input, init) => {
      requests.push(JSON.parse(String(init?.body)));
      return new Response(
        JSON.stringify({
          message: {
            content: JSON.stringify(verdict),
          },
        }),
        { status: 200 },
      );
    }) as typeof fetch;
    const runner = new OllamaPromptRunner({
      fetch: fetchImpl,
      model: "local-test",
      studioOsRoot,
      timeoutMs: 10_000,
    });

    const result = await runner.run({
      prompt: "Judge this response.",
      outputSchema: schema,
    });

    assert.deepEqual(JSON.parse(result.response), verdict);
    assert.deepEqual(requests[0].format, schema);
  });
});
