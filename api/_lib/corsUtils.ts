/**
 * VayuShield AI - CORS & Origin Utilities
 * Resolves allowed origins and applies secure CORS headers.
 */

import type { ExtendedRequest, ExtendedResponse } from './types';

export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://vayu-shield-ai.vercel.app',
  'https://vayushield-ai.vercel.app',
  'https://vayushield.ai',
];

/**
 * Resolves whether an incoming origin is permitted by CORS policy.
 * @param incomingOrigin - The incoming HTTP origin header
 * @returns Allowed origin string or null
 */
export function resolveAllowedOrigin(incomingOrigin: string | undefined): string | null {
  if (!incomingOrigin) return '*';
  try {
    const parsed = new URL(incomingOrigin);
    if (parsed.hostname.includes('..')) {
      return null;
    }
    if (parsed.protocol === 'https:' && parsed.hostname.endsWith('.vercel.app')) {
      return incomingOrigin;
    }
  } catch {
    return null;
  }
  return ALLOWED_ORIGINS.includes(incomingOrigin) ? incomingOrigin : null;
}

/**
 * Applies secure CORS headers to the response object.
 * @param req - Extended request object
 * @param res - Extended response object
 */
export function applyCorsHeaders(req: ExtendedRequest, res: ExtendedResponse): void {
  if (typeof res.setHeader !== 'function') return;
  const originHeader = typeof req.headers?.origin === 'string' ? req.headers.origin : undefined;
  const allowedOrigin = resolveAllowedOrigin(originHeader);

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}
