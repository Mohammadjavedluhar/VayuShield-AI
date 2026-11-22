/**
 * VayuShield AI - Shared Test Helpers
 * Reusable mock HTTP requests, responses, and domain profile fixtures to eliminate test code duplication.
 */

import type { ExtendedRequest, ExtendedResponse } from '../api/_lib/httpUtils';
import type { HouseholdProfile, Interventions } from '../src/domain/types';

export interface MockReqResResult {
  req: ExtendedRequest;
  res: ExtendedResponse & {
    getStatusCode: () => number;
    getData: () => any;
    getHeaders: () => Record<string, string>;
  };
}

/**
 * Creates standardized mock HTTP request and response objects for serverless API testing.
 */
export function createMockReqRes(options: {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[]>;
  ip?: string;
} | any = {}): MockReqResResult {
  const isDirectBody = options && typeof options === 'object' && !('body' in options) && !('method' in options) && !('headers' in options) && !('ip' in options);
  const actualBody = isDirectBody ? options : options.body;
  const method = isDirectBody ? 'POST' : (options.method || 'POST');
  const ip = options.ip || '127.0.0.1';

  let statusCode = 200;
  let responseData: any = null;
  const headersSet: Record<string, string> = {};

  const req = {
    method,
    body: actualBody,
    headers: options.headers || { 'x-forwarded-for': ip },
    socket: { remoteAddress: ip },
  } as unknown as ExtendedRequest;

  const res = {
    statusCode: 200,
    status(code: number) {
      statusCode = code;
      (this as any).statusCode = code;
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

/**
 * Creates a valid base household profile with optional property overrides.
 */
export function createTestProfile(overrides: Partial<HouseholdProfile> = {}): HouseholdProfile {
  return {
    householdSize: 4,
    city: 'Delhi',
    hasAsthma: false,
    hasCopdOrCardiac: false,
    hasChildren: false,
    hasElderly: false,
    isPregnant: false,
    commuteMode: 'car',
    commuteDistanceKm: 12,
    cookingFuel: 'lpg',
    heatingSource: 'none',
    hasAirPurifier: false,
    wearsMaskOutdoors: false,
    vulnerabilityScore: 20,
    vulnerabilityLevel: 'low',
    ...overrides,
  };
}

/**
 * Creates standard test interventions with optional property overrides.
 */
export function createTestInterventions(overrides: Partial<Interventions> = {}): Interventions {
  return {
    useN95Mask: true,
    useAirPurifier: true,
    commuteMode: 'metro',
    cookingFuel: 'induction',
    roomSealImprovement: true,
    wetMoppingDaily: true,
    ...overrides,
  };
}
