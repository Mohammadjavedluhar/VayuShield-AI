/**
 * VayuShield AI - Shared Test Helpers
 * Reusable mock HTTP requests, responses, and domain profile fixtures to eliminate test code duplication.
 */

import type { ExtendedRequest, ExtendedResponse } from '../api/_lib/httpUtils';
import type { AirQualityData, HouseholdProfile, ImpactLedgerMetrics, Interventions } from '../src/domain/types';

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

/**
 * Creates standardized mock air quality data with optional property overrides.
 */
export function createMockAirQualityData(overrides: Partial<AirQualityData> = {}): AirQualityData {
  return {
    city: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    timestamp: '2026-11-22T08:00:00.000Z',
    currentAqi: 350,
    pm25: 220,
    pm10: 380,
    no2: 85,
    category: 'hazardous',
    categoryLabel: 'Hazardous',
    dominantPollutant: 'PM2.5',
    healthAdvisory: 'Health alert: serious risk of respiratory damage for all individuals.',
    hourlyForecast: [],
    ...overrides,
  };
}

/**
 * Creates standardized mock impact ledger metrics with optional property overrides.
 */
export function createMockImpactLedger(overrides: Partial<ImpactLedgerMetrics> = {}): ImpactLedgerMetrics {
  return {
    baselineInhaledPm25DoseUgPerDay: 1450.5,
    protectedInhaledPm25DoseUgPerDay: 210.2,
    inhaledPm25ReductionPct: 85.5,
    baselineCigarettesPerDay: 14.5,
    avoidedCigarettesPerDay: 12.4,
    avoidedCigarettesPerWeek: 86.8,
    co2SavedKgPerWeek: 21.5,
    cleanAirHoursGainedPerDay: 14.0,
    riskReductionScore: 88,
    ...overrides,
  };
}
