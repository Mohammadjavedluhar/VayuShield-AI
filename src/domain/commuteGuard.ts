/**
 * VayuShield AI - School & Elderly Morning Commute Guard
 *
 * Models ground-level thermal inversion boundary layer dynamics during
 * peak morning hours (6:30 AM – 9:00 AM) and computes exact inhaled
 * doses against WHO 2021 air quality guidelines.
 *
 * Key physics:
 * In winter, nocturnal radiative cooling produces a ground inversion layer
 * (boundary layer height ~100-200m). Vehicle emissions and smoke cannot disperse
 * until solar convection warms the ground between 8:30 AM and 10:00 AM.
 */

import { HourlyForecastItem } from './types';
import { WHO_24H_PM25_THRESHOLD_UG_M3, INHALATION_VOLUMES } from './sources';

export type CommuterType = 'child' | 'elderly' | 'adult' | 'asthma_patient';
export type TravelMode =
  | 'open_walk_cycle'
  | 'two_wheeler'
  | 'auto_rickshaw'
  | 'bus'
  | 'closed_car'
  | 'metro';
export type MaskGrade = 'none' | 'cloth' | 'surgical' | 'kn95' | 'n95';

export interface MorningCommuteParams {
  outdoorPm25: number;
  departureTime: string; // e.g. "07:00", "07:30", "08:00", "08:30"
  durationMinutes: number; // e.g. 30, 45, 60
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

// Mode vehicle penetration coefficients (ratio of outdoor PM2.5 entering passenger zone)
export const TRAVEL_MODE_PENETRATION: Record<TravelMode, number> = {
  open_walk_cycle: 1.0,  // Completely exposed to ambient air
  two_wheeler: 1.0,      // Ambient air + direct tailpipe turbulence
  auto_rickshaw: 0.90,   // Canvas curtains offer minor windbreak
  bus: 0.80,             // Partial enclosure, frequent door openings
  closed_car: 0.40,      // AC on recirculation + standard cabin filter
  metro: 0.30,           // Underground or sealed air-conditioned train
};

// Mask particulate filtration efficiency (for sub-2.5 micron particles)
export const MASK_EFFICIENCY: Record<MaskGrade, number> = {
  none: 0.0,
  cloth: 0.20,     // Only traps coarse dust, porous to PM2.5
  surgical: 0.35,  // Good material, but significant perimeter gap leakages
  kn95: 0.90,      // Certified filter media with ear loops
  n95: 0.95,       // NIOSH / FFP2 headband respirator with tight facial seal
};

// Hourly breathing rates in m³/hour based on EPA Exposure Factors Handbook
export function getBreathingRate(commuterType: CommuterType, travelMode: TravelMode): number {
  let baseHourlyRate = 0.60; // Standard adult average (14.4 m³/day / 24)

  if (commuterType === 'child') {
    // Child (6-11 years): higher ventilation per kg body mass
    baseHourlyRate = 0.50;
  } else if (commuterType === 'elderly') {
    baseHourlyRate = 0.54;
  } else if (commuterType === 'asthma_patient') {
    baseHourlyRate = 0.58;
  }

  // Active exertion multiplier (e.g. walking/cycling increases breathing rate)
  if (travelMode === 'open_walk_cycle') {
    baseHourlyRate *= 1.4; // Light/moderate exertion
  } else if (travelMode === 'two_wheeler') {
    baseHourlyRate *= 1.1; // Alert wind draft breathing
  }

  return Number(baseHourlyRate.toFixed(2));
}

/**
 * Computes diurnal boundary layer inversion factor based on time of morning
 */
export function getInversionFactor(timeStr: string): { factor: number; riskLevel: 'critical' | 'high' | 'moderate' | 'low' } {
  const parts = timeStr.split(':');
  const hour = parseInt(parts[0], 10) || 7;
  const minute = parseInt(parts[1], 10) || 0;
  const totalMinutes = hour * 60 + minute;

  // 6:30 AM (390) to 7:45 AM (465): Cold inversion layer compressed (<150m)
  if (totalMinutes < 465) {
    return { factor: 1.35, riskLevel: 'critical' };
  }
  // 7:45 AM (465) to 8:30 AM (510): Inversion layer still dense
  if (totalMinutes < 510) {
    return { factor: 1.20, riskLevel: 'high' };
  }
  // 8:30 AM (510) to 9:15 AM (555): Solar radiation begins breaking the layer
  if (totalMinutes < 555) {
    return { factor: 0.95, riskLevel: 'moderate' };
  }
  // 9:15 AM onwards: Convective boundary layer mixing expands
  return { factor: 0.75, riskLevel: 'low' };
}

/**
 * School & Elderly Commute Guard Analyzer
 */
export function analyzeMorningCommute(params: MorningCommuteParams): MorningCommuteVerdict {
  const outdoorPm25 = Math.max(5, params.outdoorPm25);
  const durationHours = Math.max(0.15, params.durationMinutes / 60);
  const breathingRate = getBreathingRate(params.commuterType, params.travelMode);

  // 1. Inversion Dynamics
  const { factor: inversionFactor, riskLevel: inversionRiskLevel } = getInversionFactor(params.departureTime);
  const effectiveAmbientPm25 = Math.round(outdoorPm25 * inversionFactor);

  // 2. Mode Penetration & Mask Filtration
  const travelModePenetration = TRAVEL_MODE_PENETRATION[params.travelMode] ?? 1.0;
  const maskFiltrationEff = MASK_EFFICIENCY[params.currentMask] ?? 0.0;

  // Inhaled dose (micrograms)
  const cabinPm25 = effectiveAmbientPm25 * travelModePenetration;
  const unprotectedDoseUg = cabinPm25 * durationHours * breathingRate;
  const inhaledDoseUg = unprotectedDoseUg * (1 - maskFiltrationEff);

  // 3. WHO Safe Commute Budget (Pro-rated 24h budget of 15 µg/m³)
  const whoCommuteSafeBudgetUg = WHO_24H_PM25_THRESHOLD_UG_M3 * durationHours * breathingRate;
  const whoSafeLimitMultiplier = Number((inhaledDoseUg / whoCommuteSafeBudgetUg).toFixed(1));

  // 4. Departure Delay Optimization (e.g., delaying by 45 minutes)
  const parts = params.departureTime.split(':');
  const currentH = parseInt(parts[0], 10) || 7;
  const currentM = parseInt(parts[1], 10) || 0;
  const delayedTotalMinutes = currentH * 60 + currentM + 45;
  const delayedH = Math.floor(delayedTotalMinutes / 60);
  const delayedM = delayedTotalMinutes % 60;
  const suggestedDepartureTime = `${delayedH.toString().padStart(2, '0')}:${delayedM.toString().padStart(2, '0')}`;

  const { factor: delayedInversionFactor } = getInversionFactor(suggestedDepartureTime);
  const delayedAmbientPm25 = Math.round(outdoorPm25 * delayedInversionFactor);
  const delayedDose = delayedAmbientPm25 * travelModePenetration * durationHours * breathingRate * (1 - maskFiltrationEff);

  const delayedDepartureSavingsPct =
    inhaledDoseUg > 0
      ? Number((((inhaledDoseUg - delayedDose) / inhaledDoseUg) * 100).toFixed(1))
      : 0;

  // 5. Mask Grade Verdict
  let maskVerdict = 'N95 Mandatory';
  let maskRecommendation = 'Certified N95 / FFP2 respirator with tight nose seal required.';

  if (effectiveAmbientPm25 <= 50) {
    maskVerdict = 'Low Risk / Optional';
    maskRecommendation = 'Air is within acceptable ranges. Sensitive individuals may wear a mask.';
  } else if (effectiveAmbientPm25 <= 100) {
    maskVerdict = 'Surgical / KN95 Advisory';
    maskRecommendation = 'Sensitive individuals should wear certified KN95 or surgical mask.';
  } else if (effectiveAmbientPm25 <= 200) {
    maskVerdict = 'KN95 / N95 Recommended';
    maskRecommendation = 'KN95 or N95 strongly advised. Avoid cloth masks.';
  } else {
    maskVerdict = 'N95 Mandatory';
    maskRecommendation = 'Extreme particulate hazard. Headband-style N95 mandatory with 0% gap leakage.';
  }

  // 6. Advice Strings
  const departureShiftAdvice =
    delayedDepartureSavingsPct > 15
      ? `Delaying departure by 45 mins (to ${suggestedDepartureTime}) cuts inhale dose by ${delayedDepartureSavingsPct}% as solar convection disperses the cold inversion layer.`
      : `Current schedule at ${params.departureTime} aligns with steady conditions. Keep commute windows tight.`;

  let routeModeAdvice = '';
  if (params.travelMode === 'open_walk_cycle' || params.travelMode === 'two_wheeler') {
    routeModeAdvice = 'Open transit exposes lungs to direct diesel exhaust plumes. Switch to closed public metro or carpool with recirculate mode ON.';
  } else if (params.travelMode === 'closed_car') {
    routeModeAdvice = 'Set car air-conditioning to internal RECIRCULATE mode; cuts cabin particulate infiltration by ~60%.';
  } else {
    routeModeAdvice = 'Public transit enclosed cabins offer partial buffering; ensure N95 is worn during boarding and platform wait.';
  }

  const commuterLabel =
    params.commuterType === 'child'
      ? 'school child'
      : params.commuterType === 'elderly'
      ? 'elderly family member'
      : params.commuterType === 'asthma_patient'
      ? 'asthma patient'
      : 'commuter';

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
