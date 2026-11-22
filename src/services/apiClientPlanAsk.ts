/**
 * VayuShield AI - Plan & Ask Assistant API Calls
 * Handles personalized intervention planning and conversational clinical guidance.
 */

import { postJson } from './apiClientCore';
import { fallbackAsk } from '../../api/_lib/deterministicFallbacks';
import { calculateMasterImpactLedger } from '../domain/impactEngine';
import { computeCleanHourWindows, getDefaultActionChecklist } from '../domain/cleanHours';
import type {
  AirQualityData,
  HouseholdProfile,
  ImpactLedgerMetrics,
  Interventions,
  PersonalizedPlan,
} from '../domain/types';

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
