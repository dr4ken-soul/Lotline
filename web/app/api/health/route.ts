import { NextResponse } from "next/server";
import { checkKestra } from "@/lib/server/kestra-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const kestra = await checkKestra();
  const mode = kestra.reachable ? "kestra" : "simulation";
  return NextResponse.json({
    status: "ready",
    mode,
    kestraConfigured: kestra.configured,
    kestraReachable: kestra.reachable,
    syntheticOnly: true,
  }, { headers: { "Cache-Control": "no-store" } });
}
