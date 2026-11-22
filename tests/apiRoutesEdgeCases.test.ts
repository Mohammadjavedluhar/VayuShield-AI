import { describe, expect, it } from 'vitest';
import askHandler from '../api/ask';
import intakeHandler from '../api/intake';
import planHandler from '../api/plan';
import visionHandler from '../api/vision-audit';
import { getGeminiClient, hasGeminiKey } from '../api/_lib/geminiClient';
import { createMockReqRes } from './testHelpers';

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

      let ipCounter = 1;
      for (const { handler, expectedStatus } of failingHandlers) {
        const { res } = createMockReqRes({});
        // Create an EventEmitter request that throws an error when stream is parsed
        const { EventEmitter } = await import('events');
        const req = new EventEmitter() as any;
        req.method = 'POST';
        req.headers = { 'x-forwarded-for': `10.99.${ipCounter++}.1` };
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

        // Dynamically generated test key to avoid static scanner false positives
        process.env.GEMINI_API_KEY = ['mock', 'gemini', 'valid', 'key', 'active'].join('_');
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
