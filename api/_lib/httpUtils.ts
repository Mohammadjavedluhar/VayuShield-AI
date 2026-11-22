import type { IncomingMessage, ServerResponse } from 'http';

export interface ExtendedRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
  ip?: string;
}

export interface ExtendedResponse extends ServerResponse {
  status?: (statusCode: number) => ExtendedResponse;
  json?: (data: unknown) => void;
}

// In-memory rate limiting map: IP -> { count, resetTime }
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_MAP = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute
const MAX_TEXT_PAYLOAD_BYTES = 100 * 1024; // 100 KB
const MAX_VISION_PAYLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Checks whether an incoming request exceeds the rate limit.
 * Returns true if allowed, false if rate limited.
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

/**
 * Resolves client IP address safely from forwarded headers or socket.
 */
export function getClientIp(req: ExtendedRequest): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Parses and validates incoming JSON request body with strict size bounds.
 */
export async function parseRequestBody(
  req: ExtendedRequest,
  maxBytes: number = MAX_TEXT_PAYLOAD_BYTES
): Promise<unknown> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let rawData = '';
    let bytesReceived = 0;

    req.on('data', (chunk: Buffer | string) => {
      const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytesReceived += bufferChunk.length;

      if (bytesReceived > maxBytes) {
        req.destroy();
        reject(new Error(`Payload too large. Maximum size is ${maxBytes} bytes.`));
        return;
      }

      rawData += bufferChunk.toString('utf8');
    });

    req.on('end', () => {
      if (!rawData.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(rawData));
      } catch {
        resolve({});
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Returns safe CORS origin header matching allowed patterns or same-origin.
 */
function resolveAllowedOrigin(incomingOrigin?: string): string {
  if (!incomingOrigin) return '';
  // Allow localhost for local development
  if (/^http:\/\/localhost(:\d+)?$/.test(incomingOrigin)) {
    return incomingOrigin;
  }
  // Allow Vercel deployment and custom domains
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/.test(incomingOrigin)) {
    return incomingOrigin;
  }
  return '';
}

/**
 * Sends a JSON response with security headers and status code.
 */
export function sendJson(res: ExtendedResponse, statusCode: number, data: unknown): void {
  if (typeof res.status === 'function') {
    const chained = res.status(statusCode);
    if (chained && typeof chained.json === 'function') {
      chained.json(data);
      return;
    }
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  res.end(JSON.stringify(data));
}

/**
 * Sets secure CORS headers on response if origin matches allowed policy.
 */
export function applyCorsHeaders(req: ExtendedRequest, res: ExtendedResponse): void {
  const originHeader = typeof req.headers?.origin === 'string' ? req.headers.origin : undefined;
  const allowedOrigin = resolveAllowedOrigin(originHeader);

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}

export { MAX_TEXT_PAYLOAD_BYTES, MAX_VISION_PAYLOAD_BYTES };
