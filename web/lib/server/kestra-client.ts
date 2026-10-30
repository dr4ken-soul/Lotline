import { syntheticFixture } from "@/lib/demo-fixture";
import {
  apiUrl,
  getDemoServerConfig,
  hasSafeKestraConfig,
  kestraHeaders,
} from "@/lib/server/config";

export type KestraState = "CREATED" | "QUEUED" | "RUNNING" | "PAUSED" | "SUCCESS" | "WARNING" | "FAILED" | "CANCELLED" | "UNKNOWN";

export interface KestraRunStatus {
  executionId: string;
  state: KestraState;
  updatedAt?: string;
  error?: string;
}

function flowPath(): string {
  const config = getDemoServerConfig();
  return `api/v1/${encodeURIComponent(config.kestraTenant)}/flows/${encodeURIComponent(config.kestraNamespace)}/${encodeURIComponent(config.kestraFlowId)}`;
}

function executionPath(executionId: string): string {
  const config = getDemoServerConfig();
  return `api/v1/${encodeURIComponent(config.kestraTenant)}/executions/${encodeURIComponent(executionId)}`;
}

export async function checkKestra(): Promise<{ configured: boolean; reachable: boolean }> {
  const config = getDemoServerConfig();
  if (!hasSafeKestraConfig(config)) return { configured: false, reachable: false };
  try {
    const response = await fetch(apiUrl(flowPath(), config), {
      headers: kestraHeaders(config),
      cache: "no-store",
      signal: AbortSignal.timeout(2_500),
    });
    return { configured: true, reachable: response.ok };
  } catch {
    return { configured: true, reachable: false };
  }
}

export async function startKestraRun(): Promise<string> {
  const config = getDemoServerConfig();
  if (!hasSafeKestraConfig(config)) throw new Error("Kestra connection is not configured.");
  const url = new URL(
    `api/v1/${encodeURIComponent(config.kestraTenant)}/executions/webhook/${encodeURIComponent(config.kestraNamespace)}/${encodeURIComponent(config.kestraFlowId)}/${encodeURIComponent(config.kestraWebhookKey)}`,
    `${config.kestraBaseUrl}/`,
  );
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...syntheticFixture, aiMode: "template" }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Kestra did not accept the synthetic event (HTTP ${response.status}).`);
  const body = await response.json().catch(() => ({})) as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : typeof body.executionId === "string" ? body.executionId : "";
  if (!id || !/^[A-Za-z0-9_-]{6,100}$/.test(id)) {
    throw new Error("Kestra accepted the request but did not return an execution ID.");
  }
  return id;
}

export async function getKestraRun(executionId: string): Promise<KestraRunStatus> {
  const config = getDemoServerConfig();
  if (!hasSafeKestraConfig(config)) throw new Error("Kestra connection is not configured.");
  const response = await fetch(apiUrl(executionPath(executionId), config), {
    headers: kestraHeaders(config),
    cache: "no-store",
    signal: AbortSignal.timeout(4_000),
  });
  if (!response.ok) throw new Error(`Kestra could not read this execution (HTTP ${response.status}).`);
  const execution = await response.json() as {
    id?: string;
    state?: { current?: string; endDate?: string; startDate?: string };
    currentState?: string;
  };
  const rawState = execution.state?.current ?? execution.currentState ?? "UNKNOWN";
  const allowed: KestraState[] = ["CREATED", "QUEUED", "RUNNING", "PAUSED", "SUCCESS", "WARNING", "FAILED", "CANCELLED"];
  return {
    executionId,
    state: allowed.includes(rawState as KestraState) ? rawState as KestraState : "UNKNOWN",
    updatedAt: execution.state?.endDate ?? execution.state?.startDate,
  };
}

export async function resumeKestraRun(
  executionId: string,
  decision: string,
  rationale: string,
): Promise<void> {
  const config = getDemoServerConfig();
  const form = new FormData();
  form.set("decision", decision);
  form.set("rationale", rationale);
  const response = await fetch(apiUrl(
    `api/v1/${encodeURIComponent(config.kestraTenant)}/executions/${encodeURIComponent(executionId)}/actions/resume`,
    config,
  ), {
    method: "POST",
    headers: kestraHeaders(config),
    body: form,
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`Kestra could not resume this execution (HTTP ${response.status}).`);
}
