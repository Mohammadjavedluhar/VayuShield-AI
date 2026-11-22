/**
 * VayuShield AI - Response & Preflight Helpers
 * Dispatches secure JSON payloads and handles OPTIONS preflight checks.
 */

import { checkRateLimit } from './rateLimiter';
import { applyCorsHeaders } from './corsUtils';
import type { ExtendedRequest, ExtendedResponse } from './types';

/**
 * Sends a JSON response with security headers and status code.
 * @param res - Extended response object
 * @param statusCode - HTTP status code
 * @param data - Response body data
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
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
  }

  res.end(JSON.stringify(data));
}

/**
 * Handles CORS preflight and rate limiting checks for API handlers.
 * @param req - Extended request object
 * @param res - Extended response object
 * @param expectedMethod - HTTP method required (default: POST)
 * @returns true if allowed to proceed; false if response was already sent
 */
export function handlePreflightAndRateLimit(
  req: ExtendedRequest,
  res: ExtendedResponse,
  expectedMethod: string = 'POST'
): boolean {
  applyCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return false;
  }

  if (req.method !== expectedMethod) {
    sendJson(res, 405, { error: `Method not allowed. Use ${expectedMethod}.` });
    return false;
  }

  const clientIp = typeof req.headers?.['x-forwarded-for'] === 'string'
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket?.remoteAddress || '127.0.0.1';

  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    sendJson(res, 429, { error: 'Rate limit exceeded. Try again in 1 minute.' });
    return false;
  }

  return true;
}
