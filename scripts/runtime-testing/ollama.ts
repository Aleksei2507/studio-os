import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type {
  CodexPromptRequest,
  CodexPromptResult,
  CodexPromptRunner,
} from "./codex-cli.ts";

interface OllamaMessage {
  role: "assistant" | "user";
  content: string;
}

interface OllamaChatResponse {
  message?: {
    content?: unknown;
  };
}

interface OllamaAgentAction {
  action: "final" | "list_directory" | "read_file" | "write_file";
  path: string;
  content: string;
  response: string;
}

export interface OllamaPromptRunnerOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  maxSteps?: number;
  model: string;
  studioOsRoot: string;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 180_000;
const DEFAULT_MAX_STEPS = 40;
const MAX_FILE_BYTES = 512 * 1024;
const MAX_DIRECTORY_ENTRIES = 500;
const MAX_INVENTORY_ENTRIES = 2_000;
const INVENTORY_EXCLUDES = new Set([".git", "node_modules"]);

const AGENT_ACTION_SCHEMA = {
  type: "object",
  properties: {
    action: {
      type: "string",
      enum: ["final", "list_directory", "read_file", "write_file"],
    },
    path: { type: "string" },
    content: { type: "string" },
    response: { type: "string" },
  },
  required: ["action", "path", "content", "response"],
  additionalProperties: false,
};

export class OllamaPromptRunner implements CodexPromptRunner {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly maxSteps: number;
  private readonly model: string;
  private readonly studioOsRoot: string;
  private readonly timeoutMs: number;

  constructor(options: OllamaPromptRunnerOptions) {
    this.baseUrl = (options.baseUrl ?? "http://127.0.0.1:11434").replace(
      /\/$/,
      "",
    );
    this.fetchImpl = options.fetch ?? fetch;
    this.maxSteps = options.maxSteps ?? DEFAULT_MAX_STEPS;
    this.model = options.model;
    this.studioOsRoot = realpathSync(options.studioOsRoot);
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async run(request: CodexPromptRequest): Promise<CodexPromptResult> {
    const startedAt = Date.now();
    const sessionRoot = request.workingDirectory
      ? undefined
      : mkdtempSync(path.join(tmpdir(), "studio-os-ollama-"));
    const workspace = request.workingDirectory
      ? realpathSync(request.workingDirectory)
      : sessionRoot as string;

    try {
      const response = request.outputSchema
        ? await this.runStructuredResponse(
            request.prompt,
            request.outputSchema,
            startedAt,
          )
        : await this.runAgent(request, workspace, startedAt);

      return {
        response,
        durationMs: Date.now() - startedAt,
      };
    } finally {
      if (sessionRoot) {
        rmSync(sessionRoot, { recursive: true, force: true });
      }
    }
  }

  private async runStructuredResponse(
    prompt: string,
    schema: object,
    startedAt: number,
  ): Promise<string> {
    return this.chat(
      [{ role: "user", content: prompt }],
      schema,
      remainingTime(startedAt, this.timeoutMs),
    );
  }

  private async runAgent(
    request: CodexPromptRequest,
    workspace: string,
    startedAt: number,
  ): Promise<string> {
    const inventory = buildWorkspaceInventory(workspace);
    const messages: OllamaMessage[] = [
      {
        role: "user",
        content: [
          "Act as a filesystem-capable Studio OS Runtime agent.",
          "Return exactly one JSON action per response using the supplied schema.",
          "Use read_file and list_directory to inspect evidence before deciding.",
          "The Target Workspace inventory below is authoritative for existing path names.",
          "Never invent a substitute path for an existing project artifact. If a requested path is missing, inspect its parent directory and use the actual path from the inventory.",
          "Use write_file only when the Runtime contract and user confirmation permit it.",
          "Paths may be project-relative. Read access is limited to the Target Workspace and Studio OS runtime root.",
          "Write access is limited to the Target Workspace and is unavailable in read-only mode.",
          "Do not claim a file operation unless its action succeeded.",
          "When the user-facing answer is ready, return action=final and put only that answer in response.",
          "For fields unused by an action, return an empty string.",
          "",
          "## Target Workspace Inventory",
          inventory.length > 0 ? inventory.join("\n") : "(empty)",
          "",
          "## Runtime Request",
          request.prompt,
        ].join("\n"),
      },
    ];

    for (let step = 0; step < this.maxSteps; step += 1) {
      const rawAction = await this.chat(
        messages,
        AGENT_ACTION_SCHEMA,
        remainingTime(startedAt, this.timeoutMs),
      );
      const action = parseAgentAction(rawAction);
      messages.push({ role: "assistant", content: rawAction });

      if (action.action === "final") {
        if (!action.response.trim()) {
          throw new Error("Ollama agent returned an empty final response.");
        }
        return action.response.trim();
      }

      let result: string;
      try {
        result = executeAgentAction(
          action,
          workspace,
          this.studioOsRoot,
          request.sandbox === "workspace-write",
        );
      } catch (error) {
        if (!(error instanceof AgentToolError) || !error.recoverable) {
          throw error;
        }
        result = [
          `ERROR: ${error.message}`,
          "Do not create a substitute path. Inspect the parent directory and use an existing canonical path when one applies.",
        ].join("\n");
      }
      messages.push({
        role: "user",
        content: [
          `Tool result for ${action.action} ${JSON.stringify(action.path)}:`,
          result,
          "Continue with the next JSON action.",
        ].join("\n"),
      });
    }

    throw new Error(
      `Ollama agent exceeded ${this.maxSteps} filesystem action(s).`,
    );
  }

  private async chat(
    messages: OllamaMessage[],
    format: object,
    timeoutMs: number,
  ): Promise<string> {
    const response = await this.fetchImpl(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        format,
        options: {
          temperature: 0,
        },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Ollama returned HTTP ${response.status}: ${body || response.statusText}`,
      );
    }

    const parsed = await response.json() as OllamaChatResponse;
    if (
      typeof parsed.message?.content !== "string" ||
      !parsed.message.content.trim()
    ) {
      throw new Error("Ollama returned an empty chat response.");
    }
    return parsed.message.content.trim();
  }
}

function buildWorkspaceInventory(workspace: string): string[] {
  const entries: string[] = [];
  walkInventory(workspace, "", entries);
  return entries;
}

function walkInventory(
  workspace: string,
  relativeDirectory: string,
  target: string[],
): void {
  if (target.length >= MAX_INVENTORY_ENTRIES) {
    return;
  }
  const directory = path.join(workspace, relativeDirectory);
  const entries = readdirSync(directory, { withFileTypes: true }).sort(
    (left, right) => left.name.localeCompare(right.name),
  );

  for (const entry of entries) {
    if (
      target.length >= MAX_INVENTORY_ENTRIES ||
      INVENTORY_EXCLUDES.has(entry.name)
    ) {
      continue;
    }
    const relativePath = relativeDirectory
      ? path.posix.join(
          relativeDirectory.split(path.sep).join(path.posix.sep),
          entry.name,
        )
      : entry.name;
    const absolutePath = path.join(directory, entry.name);
    if (lstatSync(absolutePath).isSymbolicLink()) {
      target.push(`symlink ${relativePath} (not accessible)`);
      continue;
    }
    if (entry.isDirectory()) {
      target.push(`dir ${relativePath}/`);
      walkInventory(
        workspace,
        relativePath.split(path.posix.sep).join(path.sep),
        target,
      );
      continue;
    }
    if (entry.isFile()) {
      target.push(`file ${relativePath}`);
    }
  }
}

function parseAgentAction(source: string): OllamaAgentAction {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch (error) {
    throw new Error(
      `Ollama agent action must be valid JSON: ${errorMessage(error)}`,
    );
  }
  if (!isRecord(value)) {
    throw new Error("Ollama agent action must be a JSON object.");
  }

  const action = value.action;
  if (
    action !== "final" &&
    action !== "list_directory" &&
    action !== "read_file" &&
    action !== "write_file"
  ) {
    throw new Error("Ollama agent returned an unsupported action.");
  }
  for (const field of ["path", "content", "response"] as const) {
    if (typeof value[field] !== "string") {
      throw new Error(`Ollama agent field ${field} must be a string.`);
    }
  }

  return {
    action,
    path: value.path as string,
    content: value.content as string,
    response: value.response as string,
  };
}

function executeAgentAction(
  action: OllamaAgentAction,
  workspace: string,
  studioOsRoot: string,
  writable: boolean,
): string {
  if (action.action === "read_file") {
    const target = resolveReadablePath(
      action.path,
      workspace,
      studioOsRoot,
    );
    const stats = statSync(target);
    if (!stats.isFile()) {
      throw new AgentToolError(
        `read_file target is not a file: ${action.path}`,
        true,
      );
    }
    if (stats.size > MAX_FILE_BYTES) {
      throw new AgentToolError(
        `read_file target is too large: ${action.path}`,
        true,
      );
    }
    return readFileSync(target, "utf8");
  }

  if (action.action === "list_directory") {
    const target = resolveReadablePath(
      action.path || ".",
      workspace,
      studioOsRoot,
    );
    if (!statSync(target).isDirectory()) {
      throw new AgentToolError(
        `list_directory target is not a directory: ${action.path}`,
        true,
      );
    }
    const entries = readdirSync(target, { withFileTypes: true }).filter(
      (entry) =>
        target !== studioOsRoot ||
        ["adapters", "skill", "templates"].includes(entry.name),
    );
    if (entries.length > MAX_DIRECTORY_ENTRIES) {
      throw new AgentToolError(
        `list_directory target has more than ${MAX_DIRECTORY_ENTRIES} entries.`,
        true,
      );
    }
    return entries
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((entry) => `${entry.isDirectory() ? "dir" : "file"} ${entry.name}`)
      .join("\n");
  }

  if (!writable) {
    throw new AgentToolError(
      "write_file is unavailable in read-only mode.",
      false,
    );
  }
  const target = resolveWritablePath(action.path, workspace);
  if (Buffer.byteLength(action.content, "utf8") > MAX_FILE_BYTES) {
    throw new AgentToolError(
      `write_file content is too large: ${action.path}`,
      false,
    );
  }
  assertNoSymlinkAncestors(workspace, path.dirname(target));
  mkdirSync(path.dirname(target), { recursive: true });
  if (existsSync(target) && lstatSync(target).isSymbolicLink()) {
    throw new AgentToolError(
      `write_file target must not be a symlink: ${action.path}`,
      false,
    );
  }
  writeFileSync(target, action.content);
  return `Wrote ${path.relative(workspace, target).split(path.sep).join("/")}.`;
}

function resolveReadablePath(
  requestedPath: string,
  workspace: string,
  studioOsRoot: string,
): string {
  if (!requestedPath.trim()) {
    throw new AgentToolError(
      "Filesystem action path must not be empty.",
      true,
    );
  }
  const candidate = path.isAbsolute(requestedPath)
    ? path.resolve(requestedPath)
    : path.resolve(workspace, requestedPath);
  if (!existsSync(candidate)) {
    throw new AgentToolError(
      `Filesystem path does not exist: ${requestedPath}`,
      true,
    );
  }
  const resolved = realpathSync(candidate);
  if (
    !isContainedPath(workspace, resolved) &&
    !isAllowedStudioOsPath(studioOsRoot, resolved)
  ) {
    throw new AgentToolError(
      `Read path is outside allowed roots: ${requestedPath}`,
      false,
    );
  }
  return resolved;
}

function isAllowedStudioOsPath(
  studioOsRoot: string,
  candidate: string,
): boolean {
  if (candidate === studioOsRoot) {
    return true;
  }
  return ["adapters", "skill", "templates"].some((directory) =>
    isContainedPath(path.join(studioOsRoot, directory), candidate),
  );
}

function resolveWritablePath(requestedPath: string, workspace: string): string {
  if (
    !requestedPath.trim() ||
    path.isAbsolute(requestedPath) ||
    requestedPath.includes("\0")
  ) {
    throw new AgentToolError("Write path must be project-relative.", false);
  }
  const target = path.resolve(workspace, requestedPath);
  if (!isContainedPath(workspace, target) || target === workspace) {
    throw new AgentToolError(
      "Write path must remain inside the Target Workspace.",
      false,
    );
  }
  return target;
}

function isContainedPath(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  );
}

function assertNoSymlinkAncestors(root: string, targetDirectory: string): void {
  let current = targetDirectory;
  while (isContainedPath(root, current) && current !== root) {
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
      throw new AgentToolError(
        `Write path contains a symlink: ${current}`,
        false,
      );
    }
    current = path.dirname(current);
  }
}

function remainingTime(startedAt: number, timeoutMs: number): number {
  const remaining = timeoutMs - (Date.now() - startedAt);
  if (remaining <= 0) {
    throw new Error(`Ollama runner timed out after ${timeoutMs} ms.`);
  }
  return remaining;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

class AgentToolError extends Error {
  constructor(
    message: string,
    readonly recoverable: boolean,
  ) {
    super(message);
    this.name = "AgentToolError";
  }
}
