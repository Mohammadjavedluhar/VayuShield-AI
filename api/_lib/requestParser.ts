/**
 * VayuShield AI - Request Parsing & Schema Validation
 * Safe stream aggregation and Zod schema parsing for incoming requests.
 */

import type { ZodSchema } from 'zod';
import type { ExtendedRequest, ExtendedResponse } from './types';
import { sendJson } from './responseUtils';

export const MAX_TEXT_PAYLOAD_BYTES = 100 * 1024; // 100 KB
export const MAX_VISION_PAYLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Parses incoming request body stream with strict size bounds.
 * @param req - Extended request object
 * @param maxBytes - Maximum allowed payload in bytes
 * @returns Parsed JSON body
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

    req.on('error', (err) => reject(err));
  });
}

/**
 * Parses and validates request body against a Zod schema.
 * @param req - Extended request object
 * @param res - Extended response object
 * @param schema - Zod validation schema
 * @param maxBytes - Maximum payload size
 * @returns Validated data or null if validation fails
 */
export async function parseAndValidateRequest<T>(
  req: ExtendedRequest,
  res: ExtendedResponse,
  schema: ZodSchema<T>,
  maxBytes: number = MAX_TEXT_PAYLOAD_BYTES
): Promise<T | null> {
  const rawBody = await parseRequestBody(req, maxBytes);
  const parsedInput = schema.safeParse(rawBody);

  if (!parsedInput.success) {
    sendJson(res, 400, {
      error: 'Invalid request body',
      details: parsedInput.error.format(),
    });
    return null;
  }

  return parsedInput.data;
}
