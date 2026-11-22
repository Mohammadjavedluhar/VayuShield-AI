import { describe, expect, it } from 'vitest';
import {
  applyCorsHeaders,
  checkRateLimit,
  getClientIp,
  parseRequestBody,
  sendJson,
  type ExtendedRequest,
  type ExtendedResponse,
} from '../../api/_lib/httpUtils';
import { EventEmitter } from 'events';

describe('HTTP Utilities & Security - httpUtils.ts', () => {
  it('enforces 60 requests per minute rate limiting per IP', () => {
    const ip = '192.168.1.100';
    for (let i = 0; i < 60; i++) {
      const res = checkRateLimit(ip);
      expect(res.allowed).toBe(true);
    }
    const blocked = checkRateLimit(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('extracts client IP from x-forwarded-for header', () => {
    const req1 = {
      headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' },
    } as unknown as ExtendedRequest;
    expect(getClientIp(req1)).toBe('203.0.113.195');

    const req2 = {
      headers: {},
      socket: { remoteAddress: '10.0.0.1' },
    } as unknown as ExtendedRequest;
    expect(getClientIp(req2)).toBe('10.0.0.1');
  });

  it('parses JSON body when already parsed as object or string', async () => {
    const reqObj = { body: { city: 'Delhi' } } as unknown as ExtendedRequest;
    const resObj = await parseRequestBody(reqObj);
    expect(resObj).toEqual({ city: 'Delhi' });

    const reqStr = { body: '{"city":"Jaipur"}' } as unknown as ExtendedRequest;
    const resStr = await parseRequestBody(reqStr);
    expect(resStr).toEqual({ city: 'Jaipur' });
  });

  it('parses streamed incoming request chunks', async () => {
    const req = new EventEmitter() as unknown as ExtendedRequest;
    const parsePromise = parseRequestBody(req);

    req.emit('data', Buffer.from('{"query":'));
    req.emit('data', Buffer.from('"smog"}'));
    req.emit('end');

    const result = await parsePromise;
    expect(result).toEqual({ query: 'smog' });
  });

  it('rejects oversized request bodies with payload too large error', async () => {
    const req = new EventEmitter() as unknown as ExtendedRequest;
    (req as unknown as { destroy: () => void }).destroy = () => {};

    const parsePromise = parseRequestBody(req, 50); // max 50 bytes

    req.emit('data', Buffer.from('A'.repeat(60)));

    await expect(parsePromise).rejects.toThrow('Payload too large');
  });

  it('sends JSON response with nosniff and frame-options security headers', () => {
    const headers: Record<string, string> = {};
    let output = '';
    const res = {
      statusCode: 0,
      setHeader: (k: string, v: string) => {
        headers[k] = v;
      },
      end: (data: string) => {
        output = data;
      },
    } as unknown as ExtendedResponse;

    sendJson(res, 200, { success: true });
    expect(res.statusCode).toBe(200);
    expect(headers['Content-Type']).toBe('application/json; charset=utf-8');
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(JSON.parse(output)).toEqual({ success: true });
  });

  it('applies secure CORS only to permitted origins', () => {
    const headers: Record<string, string> = {};
    const res = {
      setHeader: (k: string, v: string) => {
        headers[k] = v;
      },
    } as unknown as ExtendedResponse;

    const reqVercel = {
      headers: { origin: 'https://vayushield-ai.vercel.app' },
    } as unknown as ExtendedRequest;

    applyCorsHeaders(reqVercel, res);
    expect(headers['Access-Control-Allow-Origin']).toBe('https://vayushield-ai.vercel.app');

    const reqUntrusted = {
      headers: { origin: 'https://evil-site.com' },
    } as unknown as ExtendedRequest;
    const headersUntrusted: Record<string, string> = {};
    const resUntrusted = {
      setHeader: (k: string, v: string) => {
        headersUntrusted[k] = v;
      },
    } as unknown as ExtendedResponse;

    applyCorsHeaders(reqUntrusted, resUntrusted);
    expect(headersUntrusted['Access-Control-Allow-Origin']).toBeUndefined();
  });
});
