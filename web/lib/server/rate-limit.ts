import { createHash, randomUUID } from "node:crypto";

type Bucket = { startedAt: number; count: number };
const buckets = new Map<string, Bucket>();
const processSalt = randomUUID();

export function checkRateLimit(request: Request, route: string, limit: number, windowMs: number): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()
    ?? request.headers.get("x-real-ip")?.trim()
    ?? "unknown";
  const key = createHash("sha256").update(`${processSalt}:${route}:${forwarded}`).digest("hex");
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now - current.startedAt >= windowMs) {
    buckets.set(key, { startedAt: now, count: 1 });
  } else if (current.count >= limit) {
    return false;
  } else {
    current.count += 1;
  }

  if (buckets.size > 2_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (now - bucket.startedAt >= windowMs) buckets.delete(bucketKey);
    }
  }
  return true;
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
