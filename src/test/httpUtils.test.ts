import { describe, expect, it } from 'vitest';
import {
  applyCorsHeaders,
  checkRateLimit,
  getClientIp,
  handlePreflightAndRateLimit,
  parseAndValidateRequest,
  parseRequestBody,
  sendJson,
  type ExtendedRequest,
  type ExtendedResponse,
} from '../../api/_lib/httpUtils';
import { EventEmitter } from 'events';
import { z } from 'zod';

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

    // Array forwarded header
    const reqArray = {
      headers: { 'x-forwarded-for': ['203.0.113.55', '10.0.0.2'] },
    } as unknown as ExtendedRequest;
    expect(getClientIp(reqArray)).toBe('203.0.113.55');
  });

  it('parses JSON body when already parsed as object or string', async () => {
    const reqObj = { body: { city: 'Delhi' } } as unknown as ExtendedRequest;
    const resObj = await parseRequestBody(reqObj);
    expect(resObj).toEqual({ city: 'Delhi' });

    const reqStr = { body: '{"city":"Jaipur"}' } as unknown as ExtendedRequest;
    const resStr = await parseRequestBody(reqStr);
    expect(resStr).toEqual({ city: 'Jaipur' });

    const reqInvalidStr = { body: '{"invalid:json' } as unknown as ExtendedRequest;
    const resInvalid = await parseRequestBody(reqInvalidStr);
    expect(resInvalid).toEqual({});
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

    // Chained res.status().json() path
    let chainedStatus = 0;
    let chainedData: any = null;
    const chainedRes = {
      status: (code: number) => ({
        json: (data: any) => {
          chainedStatus = code;
          chainedData = data;
        },
      }),
    } as unknown as ExtendedResponse;
    sendJson(chainedRes, 201, { created: true });
    expect(chainedStatus).toBe(201);
    expect(chainedData).toEqual({ created: true });
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

    // Localhost origin support
    const reqLocalhost = {
      headers: { origin: 'http://localhost:5173' },
    } as unknown as ExtendedRequest;
    const headersLocalhost: Record<string, string> = {};
    const resLocalhost = {
      setHeader: (k: string, v: string) => {
        headersLocalhost[k] = v;
      },
    } as unknown as ExtendedResponse;
    applyCorsHeaders(reqLocalhost, resLocalhost);
    expect(headersLocalhost['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
  });

  it('handles stream errors and invalid or whitespace-only bodies in parseRequestBody', async () => {
    // Whitespace only stream
    const reqWhitespace = new EventEmitter() as unknown as ExtendedRequest;
    const wsPromise = parseRequestBody(reqWhitespace);
    reqWhitespace.emit('data', Buffer.from('   \n  '));
    reqWhitespace.emit('end');
    expect(await wsPromise).toEqual({});

    // Invalid JSON stream
    const reqInvalid = new EventEmitter() as unknown as ExtendedRequest;
    const invPromise = parseRequestBody(reqInvalid);
    reqInvalid.emit('data', Buffer.from('{invalid json'));
    reqInvalid.emit('end');
    expect(await invPromise).toEqual({});

    // Stream error
    const reqErr = new EventEmitter() as unknown as ExtendedRequest;
    const errPromise = parseRequestBody(reqErr);
    reqErr.emit('error', new Error('Network stream aborted'));
    await expect(errPromise).rejects.toThrow('Network stream aborted');

    // getClientIp fallback to 127.0.0.1
    const reqNoIp = { headers: {} } as unknown as ExtendedRequest;
    expect(getClientIp(reqNoIp)).toBe('127.0.0.1');

    // Invalid URL and double-dot hostname origin rejection in resolveAllowedOrigin
    const reqMalformedOrigin = {
      headers: { origin: 'not-a-valid-url' },
    } as unknown as ExtendedRequest;
    const resMalformed = { setHeader: () => {} } as unknown as ExtendedResponse;
    applyCorsHeaders(reqMalformedOrigin, resMalformed);

    const reqDoubleDot = {
      headers: { origin: 'https://evil..vercel.app' },
    } as unknown as ExtendedRequest;
    const headersDoubleDot: Record<string, string> = {};
    const resDoubleDot = {
      setHeader: (k: string, v: string) => {
        headersDoubleDot[k] = v;
      },
    } as unknown as ExtendedResponse;
    applyCorsHeaders(reqDoubleDot, resDoubleDot);
    expect(headersDoubleDot['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('verifies handlePreflightAndRateLimit and parseAndValidateRequest', async () => {
    // OPTIONS preflight
    let statusCode = 0;
    const resOptions = {
      statusCode: 200,
      setHeader: () => {},
      end: () => {},
      status: (code: number) => {
        statusCode = code;
        return { json: () => {} };
      },
    } as unknown as ExtendedResponse;
    const reqOptions = { method: 'OPTIONS', headers: {} } as unknown as ExtendedRequest;
    expect(handlePreflightAndRateLimit(reqOptions, resOptions)).toBe(false);
    expect(statusCode).toBe(200);

    // Wrong HTTP method (e.g. GET)
    let getStatus = 0;
    const resGet = {
      status: (code: number) => {
        getStatus = code;
        return { json: () => {} };
      },
    } as unknown as ExtendedResponse;
    const reqGet = { method: 'GET', headers: {} } as unknown as ExtendedRequest;
    expect(handlePreflightAndRateLimit(reqGet, resGet, 'POST')).toBe(false);
    expect(getStatus).toBe(405);

    // Rate limited
    const spamIp = '198.18.0.55';
    for (let i = 0; i < 60; i++) {
      checkRateLimit(spamIp);
    }
    let limitStatus = 0;
    const resLimit = {
      status: (code: number) => {
        limitStatus = code;
        return { json: () => {} };
      },
    } as unknown as ExtendedResponse;
    const reqLimit = { method: 'POST', headers: { 'x-forwarded-for': spamIp } } as unknown as ExtendedRequest;
    expect(handlePreflightAndRateLimit(reqLimit, resLimit)).toBe(false);
    expect(limitStatus).toBe(429);

    // Valid preflight
    const validIp = '198.18.0.99';
    const reqValid = { method: 'POST', headers: { 'x-forwarded-for': validIp } } as unknown as ExtendedRequest;
    const resValid = { setHeader: () => {} } as unknown as ExtendedResponse;
    expect(handlePreflightAndRateLimit(reqValid, resValid)).toBe(true);

    // parseAndValidateRequest valid and invalid
    const TestSchema = z.object({ name: z.string().min(2) });
    const reqValidBody = { body: { name: 'Vayu' } } as unknown as ExtendedRequest;
    const validData = await parseAndValidateRequest(reqValidBody, resValid, TestSchema);
    expect(validData).toEqual({ name: 'Vayu' });

    let badReqStatus = 0;
    const resBadReq = {
      status: (code: number) => {
        badReqStatus = code;
        return { json: () => {} };
      },
    } as unknown as ExtendedResponse;
    const reqBadBody = { body: { name: 'X' } } as unknown as ExtendedRequest;
    const badData = await parseAndValidateRequest(reqBadBody, resBadReq, TestSchema);
    expect(badData).toBeNull();
    expect(badReqStatus).toBe(400);
  });
});
