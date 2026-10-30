import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const SESSION_TTL_MS = 20 * 60 * 1000;

interface SessionPayload {
  runId: string;
  issuedAt: number;
  nonce: string;
  mode: "kestra";
}

function signature(encodedPayload: string, key: string): string {
  return createHmac("sha256", key).update(encodedPayload).digest("base64url");
}

export function createSessionToken(runId: string, key: string): string {
  const payload: SessionPayload = {
    runId,
    issuedAt: Date.now(),
    nonce: randomUUID(),
    mode: "kestra",
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded, key)}`;
}

export function verifySessionToken(token: string, runId: string, key: string): boolean {
  if (!token || !key || token.length > 2_048) return false;
  const [encoded, providedSignature, extra] = token.split(".");
  if (!encoded || !providedSignature || extra) return false;
  const expected = signature(encoded, key);
  const left = Buffer.from(expected);
  const right = Buffer.from(providedSignature);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return payload.mode === "kestra" && payload.runId === runId &&
      Number.isFinite(payload.issuedAt) && Date.now() - payload.issuedAt <= SESSION_TTL_MS &&
      payload.issuedAt <= Date.now() + 5_000;
  } catch {
    return false;
  }
}
