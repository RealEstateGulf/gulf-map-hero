import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

// Central rate-limit configuration — every limit in the app lives here.
// max: how many hits are allowed within windowMs before the key is blocked.
export const RATE_LIMITS = {
  login: { max: 5, windowMs: 15 * 60 * 1000 },          // 5 attempts / 15 min
  changePassword: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts / 15 min
  upload: { max: 30, windowMs: 60 * 60 * 1000 },        // 30 uploads / hour
  track: { max: 60, windowMs: 60 * 1000 },               // 60 hits / minute
} as const;

export type RateLimitName = keyof typeof RATE_LIMITS;

/** Best-effort client IP from the headers Vercel's edge network sets. */
export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Fixed-window rate limiter backed by Postgres (not in-memory — serverless
 * function instances don't share memory, so a Map()-based counter would
 * silently under-count and give no real protection in production).
 *
 * The INSERT ... ON CONFLICT is a single atomic statement: concurrent
 * requests for the same key serialize on the row lock instead of racing
 * each other into an incorrect count.
 */
export async function checkRateLimit(
  limitName: RateLimitName,
  identifier: string
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  const { max, windowMs } = RATE_LIMITS[limitName];
  const key = `${limitName}:${identifier}`;

  const rows = await prisma.$queryRaw<{ count: number; windowStart: Date }[]>`
    INSERT INTO "RateLimit" AS rl (key, count, "windowStart")
    VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN now() - rl."windowStart" > (${windowMs}::text || ' milliseconds')::interval THEN 1
        ELSE rl.count + 1
      END,
      "windowStart" = CASE
        WHEN now() - rl."windowStart" > (${windowMs}::text || ' milliseconds')::interval THEN now()
        ELSE rl."windowStart"
      END
    RETURNING count, "windowStart"
  `;

  const row = rows[0];
  if (row.count <= max) return { allowed: true };

  const elapsedMs = Date.now() - new Date(row.windowStart).getTime();
  const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000));
  return { allowed: false, retryAfterSeconds };
}

/** Human-readable Turkish message for a rate-limited response. */
export function rateLimitMessage(retryAfterSeconds: number): string {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  if (minutes <= 1) return `Çok fazla deneme yaptınız. Lütfen ${retryAfterSeconds} saniye sonra tekrar deneyin.`;
  return `Çok fazla deneme yaptınız. Lütfen ${minutes} dakika sonra tekrar deneyin.`;
}
