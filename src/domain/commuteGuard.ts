/**
 * VayuShield AI - School & Elderly Morning Commute Guard
 * Models ground-level thermal inversion boundary layer dynamics during peak hours.
 */

import { HourlyForecastItem } from './types';
import { WHO_24H_PM25_THRESHOLD_UG_M3 } from './sources';
import {
  CommuterType,
  TravelMode,
  MaskGrade,
  TRAVEL_MODE_PENETRATION,
  MASK_EFFICIENCY,
  COMMUTER_LABELS,
  getBreathingRate,
} from './commute/constants';
import {
  getInversionFactor,
  determineMaskVerdict,
  computeSuggestedDeparture,
  getRouteModeAdvice,
} from './commute/inversionModel';

export * from './commute/constants';
export * from './commute/inversionModel';

export interface MorningCommuteParams {
  outdoorPm25: number;
  departureTime: string;
  durationMinutes: number;
  commuterType: CommuterType;
  travelMode: TravelMode;
  currentMask: MaskGrade;
  hourlyForecast?: HourlyForecastItem[];
}

export interface MorningCommuteVerdict {
  departureTime: string;
  effectiveAmbientPm25: number;
  inversionPenaltyFactor: number;
  inversionRiskLevel: 'critical' | 'high' | 'moderate' | 'low';
  travelModePenetration: number;
  maskFiltrationEff: number;
  inhaledDoseUg: number;
  unprotectedDoseUg: number;
  whoCommuteSafeBudgetUg: number;
  whoSafeLimitMultiplier: number;
  maskVerdict: string;
  maskRecommendation: string;
  suggestedDepartureTime: string;
  delayedDepartureSavingsPct: number;
  departureShiftAdvice: string;
  routeModeAdvice: string;
  summary: string;
}

/**
 * School & Elderly Commute Guard Analyzer
 * @param params - Morning commute schedule, route mode, and protective gear
 * @returns Comprehensive commute risk assessment and optimal departure time
 */
export function analyzeMorningCommute(params: MorningCommuteParams): MorningCommuteVerdict {
  const outdoorPm25 = Math.max(5, params.outdoorPm25);
  const durationHours = Math.max(0.15, params.durationMinutes / 60);
  const breathingRate = getBreathingRate(params.commuterType, params.travelMode);

  const { factor: inversionFactor, riskLevel: inversionRiskLevel } = getInversionFactor(params.departureTime);
  const effectiveAmbientPm25 = Math.round(outdoorPm25 * inversionFactor);

  const travelModePenetration = TRAVEL_MODE_PENETRATION[params.travelMode] ?? 1.0;
  const maskFiltrationEff = MASK_EFFICIENCY[params.currentMask] ?? 0.0;

  const cabinPm25 = effectiveAmbientPm25 * travelModePenetration;
  const unprotectedDoseUg = cabinPm25 * durationHours * breathingRate;
  const inhaledDoseUg = unprotectedDoseUg * (1 - maskFiltrationEff);

  const whoCommuteSafeBudgetUg = WHO_24H_PM25_THRESHOLD_UG_M3 * durationHours * breathingRate;
  const whoSafeLimitMultiplier = Number((inhaledDoseUg / whoCommuteSafeBudgetUg).toFixed(1));

  const suggestedDepartureTime = computeSuggestedDeparture(params.departureTime, 45);
  const { factor: delayedInversionFactor } = getInversionFactor(suggestedDepartureTime);
  const delayedAmbientPm25 = Math.round(outdoorPm25 * delayedInversionFactor);
  const delayedDose = delayedAmbientPm25 * travelModePenetration * durationHours * breathingRate * (1 - maskFiltrationEff);

  const delayedDepartureSavingsPct =
    inhaledDoseUg > 0
      ? Number((((inhaledDoseUg - delayedDose) / inhaledDoseUg) * 100).toFixed(1))
      : 0;

  const { maskVerdict, maskRecommendation } = determineMaskVerdict(effectiveAmbientPm25);

  const departureShiftAdvice =
    delayedDepartureSavingsPct > 15
      ? `Delaying departure by 45 mins (to ${suggestedDepartureTime}) cuts inhale dose by ${delayedDepartureSavingsPct}% as solar convection disperses the cold inversion layer.`
      : `Current schedule at ${params.departureTime} aligns with steady conditions. Keep commute windows tight.`;

  const routeModeAdvice = getRouteModeAdvice(params.travelMode);
  const commuterLabel = COMMUTER_LABELS[params.commuterType] ?? 'commuter';
  const summary = `For this ${commuterLabel} traveling at ${params.departureTime} via ${params.travelMode.replace('_', ' ')}, the morning thermal inversion amplifies ambient PM2.5 to ${effectiveAmbientPm25} µg/m³. Inhaled dose is ${whoSafeLimitMultiplier}x the WHO 2021 safe limit. ${maskVerdict}: ${departureShiftAdvice}`;

  return {
    departureTime: params.departureTime,
    effectiveAmbientPm25,
    inversionPenaltyFactor: inversionFactor,
    inversionRiskLevel,
    travelModePenetration,
    maskFiltrationEff,
    inhaledDoseUg: Number(inhaledDoseUg.toFixed(1)),
    unprotectedDoseUg: Number(unprotectedDoseUg.toFixed(1)),
    whoCommuteSafeBudgetUg: Number(whoCommuteSafeBudgetUg.toFixed(1)),
    whoSafeLimitMultiplier,
    maskVerdict,
    maskRecommendation,
    suggestedDepartureTime,
    delayedDepartureSavingsPct: Math.max(0, delayedDepartureSavingsPct),
    departureShiftAdvice,
    routeModeAdvice,
    summary,
  };
}
