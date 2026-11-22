/**
 * VayuShield AI - In-Memory IP Rate Limiter
 * Enforces per-minute request rate limits for API endpoints.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_MAP = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

/**
 * Checks whether an incoming request from clientIp exceeds the rate limit.
 * @param clientIp - Client IP address string
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(clientIp);

  if (!record || now > record.resetTime) {
    RATE_LIMIT_MAP.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

export { MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS };
