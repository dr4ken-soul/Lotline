import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDemoServerConfig, hasSafeKestraConfig } from "@/lib/server/config";
import { checkKestra, startKestraRun } from "@/lib/server/kestra-client";
import { checkRateLimit, isSameOriginRequest } from "@/lib/server/rate-limit";
import { readLimitedRequestBody } from "@/lib/server/request-body";
import { createSessionToken } from "@/lib/server/session-token";

export const dynamic = "force-dynamic";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message, requestId: randomUUID() } }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return errorResponse("ORIGIN_REJECTED", "Run this demo from the Lotline page.", 403);
  if (!checkRateLimit(request, "run-minute", 3, 60_000) || !checkRateLimit(request, "run-hour", 15, 60 * 60_000)) {
    return errorResponse("RATE_LIMITED", "Please wait before starting another sample run.", 429);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse("INVALID_CONTENT_TYPE", "A JSON fixture selection is required.", 415);
  }

  const rawBody = await readLimitedRequestBody(request, 1_024);
  if (rawBody === null) return errorResponse("REQUEST_TOO_LARGE", "Only the named synthetic fixture can be run.", 413);
  let body: { fixtureId?: unknown; aiMode?: unknown };
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return errorResponse("INVALID_REQUEST", "Choose the available synthetic fixture.", 400);
    }
    body = parsed as { fixtureId?: unknown; aiMode?: unknown };
  } catch {
    return errorResponse("INVALID_REQUEST", "Choose the available synthetic fixture.", 400);
  }
  if (body.fixtureId !== "excursion-01" || (body.aiMode !== undefined && body.aiMode !== "template")) {
    return errorResponse("FIXTURE_ONLY", "Lotline accepts only the built-in synthetic fixture.", 400);
  }

  const config = getDemoServerConfig();
  const connection = hasSafeKestraConfig(config) ? await checkKestra() : { configured: false, reachable: false };
  if (!connection.reachable) {
    return NextResponse.json({
      mode: "simulation",
      sessionId: randomUUID(),
      state: "READY",
      message: "No Kestra execution was created. This run stays in this browser session.",
    }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const executionId = await startKestraRun();
    return NextResponse.json({
      mode: "kestra",
      executionId,
      state: "CREATED",
      sessionToken: createSessionToken(executionId, config.demoSigningKey),
      message: "A Kestra execution was created for the built-in synthetic fixture.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("KESTRA_START_FAILED", "Kestra did not create the sample execution. Retry the connection or use the labelled UI-only simulation.", 502);
  }
}
