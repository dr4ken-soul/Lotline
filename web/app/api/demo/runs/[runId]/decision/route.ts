import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDemoServerConfig } from "@/lib/server/config";
import { getKestraRun, resumeKestraRun } from "@/lib/server/kestra-client";
import { checkRateLimit, isSameOriginRequest } from "@/lib/server/rate-limit";
import { verifySessionToken } from "@/lib/server/session-token";
import { readLimitedRequestBody } from "@/lib/server/request-body";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ runId: string }> };
const decisions = new Set(["hold", "escalate", "simulated_release"]);

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message, requestId: randomUUID() } }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request, context: Context) {
  if (!isSameOriginRequest(request)) return errorResponse("ORIGIN_REJECTED", "Submit this sample review from the Lotline page.", 403);
  const { runId } = await context.params;
  if (!/^[A-Za-z0-9_-]{6,100}$/.test(runId)) return errorResponse("RUN_NOT_FOUND", "Run not found.", 404);
  if (!checkRateLimit(request, `decision:${runId}`, 3, 20 * 60_000)) {
    return errorResponse("ATTEMPTS_EXCEEDED", "This run has used its sample decision attempts. Start a new fixture run.", 429);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse("INVALID_CONTENT_TYPE", "A decision and rationale are required.", 415);
  }
  const rawBody = await readLimitedRequestBody(request, 2_048);
  if (rawBody === null) return errorResponse("RATIONALE_TOO_LONG", "Keep the sample rationale under 1,000 characters.", 413);
  let body: { decision?: unknown; rationale?: unknown };
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return errorResponse("INVALID_REQUEST", "A decision and rationale are required.", 400);
    }
    body = parsed as { decision?: unknown; rationale?: unknown };
  } catch {
    return errorResponse("INVALID_REQUEST", "A decision and rationale are required.", 400);
  }
  const rationale = typeof body.rationale === "string" ? body.rationale.trim() : "";
  if (typeof body.decision !== "string" || !decisions.has(body.decision)) {
    return errorResponse("INVALID_DECISION", "Choose one of the listed sample decisions.", 400);
  }
  if (rationale.length < 8 || rationale.length > 1_000) {
    return errorResponse("INVALID_RATIONALE", "Enter a rationale between 8 and 1,000 characters.", 400);
  }

  const token = request.headers.get("x-lotline-demo-token") ?? "";
  const config = getDemoServerConfig();
  if (!verifySessionToken(token, runId, config.demoSigningKey)) {
    return errorResponse("SESSION_EXPIRED", "Run session expired. Start a new synthetic run.", 401);
  }

  try {
    const status = await getKestraRun(runId);
    if (status.state !== "PAUSED") return errorResponse("RUN_NOT_PAUSED", "The Kestra execution is not paused for review yet.", 409);
    await resumeKestraRun(runId, body.decision, rationale);
    return NextResponse.json({
      state: "RESUMED",
      decisionRecorded: true,
      executionId: runId,
      message: "Sample decision sent to the paused Kestra execution. No inventory system is connected.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("DECISION_NOT_RECORDED", "Kestra did not record this sample decision. Confirm the execution is paused and retry.", 502);
  }
}
