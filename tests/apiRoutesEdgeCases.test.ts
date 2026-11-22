import { describe, expect, it } from 'vitest';
import askHandler from '../api/ask';
import intakeHandler from '../api/intake';
import planHandler from '../api/plan';
import visionHandler from '../api/vision-audit';
import { getGeminiClient, hasGeminiKey } from '../api/_lib/geminiClient';
import type { ExtendedRequest, ExtendedResponse } from '../api/_lib/httpUtils';

function createMockReqRes(options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  ip?: string;
}) {
  let statusCode = 200;
  let responseData: any = null;
  const headersSet: Record<string, string> = {};

  const req = {
    method: options.method || 'POST',
    body: options.body,
    headers: options.headers || { 'x-forwarded-for': options.ip || '127.0.0.1' },
    socket: { remoteAddress: options.ip || '127.0.0.1' },
  } as unknown as ExtendedRequest;

  const res = {
    statusCode: 200,
    status(code: number) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      responseData = data;
      return this;
    },
    setHeader(k: string, v: string) {
      headersSet[k] = v;
    },
    end(str?: string) {
      if (str && !responseData) {
        try {
          responseData = JSON.parse(str);
        } catch {
          responseData = str;
        }
      }
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => headersSet,
  } as unknown as ExtendedResponse & {
    getStatusCode: () => number;
    getData: () => any;
    getHeaders: () => Record<string, string>;
  };

  return { req, res };
}

describe('API Routes Edge Cases & Security - tests/apiRoutesEdgeCases.test.ts', () => {
  describe('HTTP Method and Options Preflight Handling', () => {
    it('handles OPTIONS preflight across all endpoints', async () => {
      const endpoints = [askHandler, intakeHandler, planHandler, visionHandler];
      for (const handler of endpoints) {
        const { req, res } = createMockReqRes({ method: 'OPTIONS' });
        await handler(req, res);
        expect(res.getStatusCode()).toBe(200);
        expect(res.getData()).toEqual({ ok: true });
      }
    });

    it('rejects non-POST methods with 405 Method Not Allowed', async () => {
      const endpoints = [askHandler, intakeHandler, planHandler, visionHandler];
      for (const handler of endpoints) {
        const { req, res } = createMockReqRes({ method: 'GET' });
        await handler(req, res);
        expect(res.getStatusCode()).toBe(405);
        expect(res.getData().error).toContain('Method not allowed');
      }
    });
  });

  describe('Validation & Bad Request Handling (400)', () => {
    it('rejects invalid request body with 400 on /api/intake', async () => {
      const { req, res } = createMockReqRes({ body: { text: '' } }); // too short
      await intakeHandler(req, res);
      expect(res.getStatusCode()).toBe(400);
      expect(res.getData().error).toBe('Invalid request body');
    });

    it('rejects invalid request body with 400 on /api/ask', async () => {
      const { req, res } = createMockReqRes({ body: { question: '' } }); // too short
      await askHandler(req, res);
      expect(res.getStatusCode()).toBe(400);
      expect(res.getData().error).toBe('Invalid request body');
    });

    it('rejects invalid request body with 400 on /api/plan', async () => {
      const { req, res } = createMockReqRes({ body: { profile: null } });
      await planHandler(req, res);
      expect(res.getStatusCode()).toBe(400);
      expect(res.getData().error).toBe('Invalid request body');
    });

    it('rejects invalid request body with 400 on /api/vision-audit', async () => {
      const { req, res } = createMockReqRes({ body: { imageBase64: 'short' } });
      await visionHandler(req, res);
      expect(res.getStatusCode()).toBe(400);
      expect(res.getData().error).toBe('Invalid request body');
    });
  });

  describe('Rate Limiting (429)', () => {
    it('returns 429 when IP rate limit is exceeded on intake, ask, plan, and vision-audit', async () => {
      const spamIp = '198.51.100.99';
      for (let i = 0; i < 60; i++) {
        const { req, res } = createMockReqRes({
          ip: spamIp,
          body: { text: 'Family of 4 living in Delhi' },
        });
        await intakeHandler(req, res);
      }

      // 61st request should be blocked across all endpoints
      const endpoints = [intakeHandler, askHandler, planHandler, visionHandler];
      for (const handler of endpoints) {
        const { req, res } = createMockReqRes({
          ip: spamIp,
          body: { text: 'Family of 4 living in Delhi' },
        });
        await handler(req, res);
        expect(res.getStatusCode()).toBe(429);
        expect(res.getData().error).toContain('Rate limit exceeded');
      }
    });
  });

  describe('Internal Server / Stream Error Fallbacks (catch blocks)', () => {
    it('handles stream rejection errors gracefully across all endpoints', async () => {
      const failingHandlers = [
        { handler: askHandler, expectedStatus: 200 },
        { handler: intakeHandler, expectedStatus: 200 },
        { handler: planHandler, expectedStatus: 500 },
        { handler: visionHandler, expectedStatus: 200 },
      ];

      for (const { handler, expectedStatus } of failingHandlers) {
        const { res } = createMockReqRes({});
        // Create an EventEmitter request that throws an error when stream is parsed
        const { EventEmitter } = await import('events');
        const req = new EventEmitter() as any;
        req.method = 'POST';
        req.headers = { 'x-forwarded-for': `10.99.${Math.floor(Math.random() * 200)}.1` };
        req.socket = { remoteAddress: '10.99.1.1' };

        setImmediate(() => {
          req.emit('error', new Error('Simulated network transmission fault'));
        });

        await handler(req, res);
        expect(res.getStatusCode()).toBe(expectedStatus);
      }
    });
  });

  describe('geminiClient.ts coverage', () => {
    it('tests hasGeminiKey and getGeminiClient with present and absent keys', () => {
      const originalKey = process.env.GEMINI_API_KEY;

      try {
        process.env.GEMINI_API_KEY = '';
        process.env.GOOGLE_API_KEY = '';
        process.env.VITE_GEMINI_API_KEY = '';
        expect(hasGeminiKey()).toBe(false);
        expect(getGeminiClient()).toBeNull();

        process.env.GEMINI_API_KEY = 'test-gemini-valid-key-abcdef';
        expect(hasGeminiKey()).toBe(true);
        const client = getGeminiClient();
        expect(client).toBeDefined();
        // Caching test
        expect(getGeminiClient()).toBe(client);
      } finally {
        process.env.GEMINI_API_KEY = originalKey;
      }
    });
  });
});
