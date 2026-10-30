import { NextResponse } from "next/server";
import { getDemoServerConfig } from "@/lib/server/config";
import { getKestraRun } from "@/lib/server/kestra-client";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { verifySessionToken } from "@/lib/server/session-token";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ runId: string }> };

export async function GET(request: Request, context: Context) {
  const { runId } = await context.params;
  if (!/^[A-Za-z0-9_-]{6,100}$/.test(runId)) return NextResponse.json({ error: "Run not found." }, { status: 404 });
  if (!checkRateLimit(request, `poll:${runId}`, 30, 60_000)) {
    return NextResponse.json({ error: "Polling is temporarily limited." }, { status: 429, headers: { "Cache-Control": "no-store" } });
  }
  const token = request.headers.get("x-lotline-demo-token") ?? "";
  const config = getDemoServerConfig();
  if (!verifySessionToken(token, runId, config.demoSigningKey)) return NextResponse.json({ error: "Run session expired. Start a new synthetic run." }, { status: 401 });

  try {
    const run = await getKestraRun(runId);
    return NextResponse.json({ run }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Kestra status is temporarily unavailable." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
