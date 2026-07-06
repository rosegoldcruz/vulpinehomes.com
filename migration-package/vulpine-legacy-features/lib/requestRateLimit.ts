import type { NextRequest } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
  blockedUntil: number;
};

const rateBuckets = new Map<string, Bucket>();

function cleanupStaleBuckets(now: number) {
  if (rateBuckets.size < 5000) return;
  for (const [key, bucket] of rateBuckets.entries()) {
    if (bucket.resetAt < now && bucket.blockedUntil < now) {
      rateBuckets.delete(key);
    }
  }
}

export function getRequestIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  return "unknown";
}

export function checkRateLimit(params: {
  scope: string;
  key: string;
  windowMs: number;
  maxRequests: number;
  blockMs?: number;
}): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  cleanupStaleBuckets(now);

  const compoundKey = `${params.scope}:${params.key}`;
  const existing = rateBuckets.get(compoundKey);

  if (!existing) {
    rateBuckets.set(compoundKey, {
      count: 1,
      resetAt: now + params.windowMs,
      blockedUntil: 0,
    });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (existing.blockedUntil > now) {
    return { allowed: false, retryAfterMs: existing.blockedUntil - now };
  }

  if (existing.resetAt <= now) {
    existing.count = 0;
    existing.resetAt = now + params.windowMs;
    existing.blockedUntil = 0;
  }

  existing.count += 1;

  if (existing.count > params.maxRequests) {
    if (params.blockMs && params.blockMs > 0) {
      existing.blockedUntil = now + params.blockMs;
      return { allowed: false, retryAfterMs: params.blockMs };
    }
    return { allowed: false, retryAfterMs: Math.max(existing.resetAt - now, 1000) };
  }

  return { allowed: true, retryAfterMs: 0 };
}
