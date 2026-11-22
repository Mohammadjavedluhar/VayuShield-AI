/**
 * VayuShield AI - Universal API Client
 * Calls Vercel serverless routes with seamless automatic client-side fallback.
 */

import {
  fallbackAsk,
  fallbackIntake,
  fallbackVisionAudit,
} from '../../api/_lib/deterministicFallbacks';
import {
  calculateHouseholdVulnerability,
  calculateMasterImpactLedger,
} from '../domain/impactEngine';
import {
  computeCleanHourWindows,
  getDefaultActionChecklist,
} from '../domain/cleanHours';
import {
  AirQualityData,
  HouseholdProfile,
  ImpactLedgerMetrics,
  Interventions,
  PersonalizedPlan,
  VisionAuditResult,
} from '../domain/types';

/**
 * Shared JSON POST helper with network error suppression for graceful offline degradation.
 */
async function postJson<T>(endpoint: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    console.warn(`[ApiClient] ${endpoint} offline, falling back to client-side engine:`, err);
  }
  return null;
}

export async function callIntakeApi(text: string, cityHint?: string): Promise<{
  profile: HouseholdProfile;
  tier: string;
}> {
  const json = await postJson<{ profile?: HouseholdProfile; tier?: string }>(
    '/api/intake',
    { text, cityHint }
  );

  if (json?.profile) {
    return { profile: json.profile, tier: json.tier || 'tier2_flash' };
  }

  // Graceful client-side fallback
  const fallback = fallbackIntake(text, cityHint);
  const vuln = calculateHouseholdVulnerability(fallback);
  return {
    profile: {
      ...fallback,
      rawInput: text,
      vulnerabilityScore: vuln.score,
      vulnerabilityLevel: vuln.level,
    },
    tier: 'tier4_fallback',
  };
}

export async function callVisionAuditApi(
  imageBase64: string,
  mimeType: string,
  roomContext?: string
): Promise<{
  audit: VisionAuditResult;
  tier: string;
  numbersGrounded: boolean;
}> {
  const json = await postJson<{
    audit?: VisionAuditResult;
    tier?: string;
    numbersGrounded?: boolean;
  }>('/api/vision-audit', { imageBase64, mimeType, roomContext });

  if (json?.audit) {
    return {
      audit: json.audit,
      tier: json.tier || 'tier2_flash',
      numbersGrounded: Boolean(json.numbersGrounded),
    };
  }

  const fallback = fallbackVisionAudit(roomContext);
  return {
    audit: fallback,
    tier: 'tier4_fallback',
    numbersGrounded: true,
  };
}

export async function callPlanApi(
  profile: HouseholdProfile,
  airQuality: AirQualityData,
  interventions: Interventions
): Promise<PersonalizedPlan> {
  const groundTruthLedger = calculateMasterImpactLedger(
    airQuality.pm25,
    profile,
    interventions
  );

  const json = await postJson<{
    impactMetrics?: ImpactLedgerMetrics;
    windows?: PersonalizedPlan['windows'];
    actionChecklist?: PersonalizedPlan['actionChecklist'];
    aiExplanation?: string;
  }>('/api/plan', { profile, airQuality, interventions });

  if (json) {
    return {
      householdProfile: profile,
      airQuality,
      impactMetrics: json.impactMetrics || groundTruthLedger,
      windows: json.windows || computeCleanHourWindows(airQuality.hourlyForecast || [], airQuality.pm25),
      actionChecklist: json.actionChecklist || getDefaultActionChecklist(groundTruthLedger),
      aiExplanation: json.aiExplanation || '',
      certifiedNumbersOnly: true,
    };
  }

  // Client-side deterministic plan
  return {
    householdProfile: profile,
    airQuality,
    impactMetrics: groundTruthLedger,
    windows: computeCleanHourWindows(airQuality.hourlyForecast || [], airQuality.pm25),
    actionChecklist: getDefaultActionChecklist(groundTruthLedger),
    aiExplanation: `With your selected interventions, your family will achieve a verified ${groundTruthLedger.inhaledPm25ReductionPct}% reduction in inhaled PM2.5, avoiding ${groundTruthLedger.avoidedCigarettesPerWeek} cigarettes equivalent of toxic particulate exposure per week and eliminating ${groundTruthLedger.co2SavedKgPerWeek} kg of CO2 emissions.`,
    certifiedNumbersOnly: true,
  };
}

export async function callAskApi(
  question: string,
  context: { city?: string; aqi?: number; pm25?: number; profile?: HouseholdProfile; ledger?: ImpactLedgerMetrics }
): Promise<{
  answer: string;
  recommendations: string[];
  isGrounded: boolean;
  tier: string;
}> {
  const json = await postJson<{
    answer?: string;
    recommendations?: string[];
    isGrounded?: boolean;
    tier?: string;
  }>('/api/ask', { question, context });

  if (json?.answer) {
    return {
      answer: json.answer,
      recommendations: json.recommendations || [],
      isGrounded: Boolean(json.isGrounded),
      tier: json.tier || 'tier2_flash',
    };
  }

  const fb = fallbackAsk(question, context);
  return {
    answer: fb.answer,
    recommendations: [
      'Wear tight-fitting N95 masks during outdoor exposure.',
      'Run Corsi-Rosenthal DIY box fan purifiers in living areas.',
      'Restrict vigorous exercise during early morning smog spikes.',
    ],
    isGrounded: true,
    tier: 'tier4_fallback',
  };
}
