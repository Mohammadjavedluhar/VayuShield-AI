/**
 * VayuShield AI - Serverless HTTP Request/Response Utilities
 * Safe parsing, rate limiting, and response helpers for Vercel functions.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { checkRateLimit } from './rateLimiter';
import { applyCorsHeaders, resolveAllowedOrigin, ALLOWED_ORIGINS } from './corsUtils';
import { sendJson, handlePreflightAndRateLimit } from './responseUtils';
import { parseRequestBody, parseAndValidateRequest, MAX_TEXT_PAYLOAD_BYTES, MAX_VISION_PAYLOAD_BYTES } from './requestParser';

export interface ExtendedRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
  ip?: string;
}

export interface ExtendedResponse extends ServerResponse {
  status?: (statusCode: number) => ExtendedResponse;
  json?: (data: unknown) => void;
}

export {
  checkRateLimit,
  applyCorsHeaders,
  resolveAllowedOrigin,
  ALLOWED_ORIGINS,
  sendJson,
  handlePreflightAndRateLimit,
  parseRequestBody,
  parseAndValidateRequest,
  MAX_TEXT_PAYLOAD_BYTES,
  MAX_VISION_PAYLOAD_BYTES,
};

/**
 * Resolves client IP address safely from forwarded headers or socket.
 * @param req - Extended request object
 * @returns Client IP address string
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
