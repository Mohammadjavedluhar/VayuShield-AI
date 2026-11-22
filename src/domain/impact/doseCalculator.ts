/**
 * VayuShield AI - Inhaled Dose & Cigarette Equivalents
 * Mathematical formulas for inhaled PM2.5 mass doses and cigarette equivalence.
 */

import {
  BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE,
  DEFAULT_HOURLY_INHALATION_M3,
  BASELINE_INDOOR_INFILTRATION_RATIO,
} from './constants';

/**
 * Calculates cigarette-equivalent exposure from PM2.5 concentration and hours.
 * @param pm25UgM3 - PM2.5 mass concentration in ug/m3
 * @param hoursExposed - Hours of exposure (default: 24)
 * @returns Number of cigarettes equivalent
 */
export function calculateCigaretteEquivalents(pm25UgM3: number, hoursExposed: number = 24): number {
  if (pm25UgM3 <= 0 || hoursExposed <= 0) {
    return 0;
  }
  const cigs = (pm25UgM3 * hoursExposed) / BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE;
  return Number(cigs.toFixed(2));
}

export interface InhaledDoseParams {
  outdoorPm25: number;
  outdoorHours?: number;
  indoorHours?: number;
  outdoorFiltrationEff?: number;
  indoorFiltrationEff?: number;
  hourlyInhalationRateM3?: number;
}

/**
 * Calculates total micrograms of PM2.5 inhaled into lungs across outdoor and indoor hours.
 * @param params - Exposure hours, PM2.5 levels, and filtration efficiencies
 * @returns Baseline dose, protected dose, and percentage reduction
 */
export function calculateInhaledPm25Dose(params: InhaledDoseParams): {
  baselineDoseUg: number;
  protectedDoseUg: number;
  percentageReduction: number;
} {
  const outdoorPm25 = Math.max(0, params.outdoorPm25);
  const outdoorHours = Math.max(0, Math.min(24, params.outdoorHours ?? 3));
  const indoorHours = Math.max(0, Math.min(24 - outdoorHours, params.indoorHours ?? (24 - outdoorHours)));
  const rate = Math.max(0.1, params.hourlyInhalationRateM3 ?? DEFAULT_HOURLY_INHALATION_M3);

  const outdoorFiltration = Math.max(0, Math.min(1, params.outdoorFiltrationEff ?? 0));
  const indoorFiltration = Math.max(0, Math.min(1, params.indoorFiltrationEff ?? 0));

  const baselineIndoorPm25 = outdoorPm25 * BASELINE_INDOOR_INFILTRATION_RATIO;
  const baselineOutdoorInhaled = outdoorPm25 * outdoorHours * rate;
  const baselineIndoorInhaled = baselineIndoorPm25 * indoorHours * rate;
  const baselineTotalDose = baselineOutdoorInhaled + baselineIndoorInhaled;

  const protectedOutdoorPm25 = outdoorPm25 * (1 - outdoorFiltration);
  const protectedIndoorPm25 = baselineIndoorPm25 * (1 - indoorFiltration);
  const protectedOutdoorInhaled = protectedOutdoorPm25 * outdoorHours * rate;
  const protectedIndoorInhaled = protectedIndoorPm25 * indoorHours * rate;
  const protectedTotalDose = protectedOutdoorInhaled + protectedIndoorInhaled;

  const percentageReduction =
    baselineTotalDose > 0
      ? ((baselineTotalDose - protectedTotalDose) / baselineTotalDose) * 100
      : 0;

  return {
    baselineDoseUg: Number(baselineTotalDose.toFixed(1)),
    protectedDoseUg: Number(protectedTotalDose.toFixed(1)),
    percentageReduction: Number(percentageReduction.toFixed(1)),
  };
}

/**
 * Computes weekly avoided cigarette equivalents from outdoor N95 and indoor air cleaning.
 * @param params - PM2.5 level and filtration parameters
 * @returns Daily and weekly baseline, protected, and avoided cigarette counts
 */
export function calculateAvoidedCigarettesWeekly(params: {
  outdoorPm25: number;
  outdoorHours?: number;
  indoorHours?: number;
  outdoorFiltrationEff: number;
  indoorFiltrationEff: number;
}): {
  baselineCigarettesPerDay: number;
  protectedCigarettesPerDay: number;
  avoidedCigarettesPerDay: number;
  avoidedCigarettesPerWeek: number;
} {
  const outdoorPm25 = Math.max(0, params.outdoorPm25);
  const outdoorHours = Math.max(0, Math.min(24, params.outdoorHours ?? 3));
  const indoorHours = Math.max(0, Math.min(24 - outdoorHours, params.indoorHours ?? (24 - outdoorHours)));
  const baselineIndoorPm25 = outdoorPm25 * BASELINE_INDOOR_INFILTRATION_RATIO;

  const baselineDaily =
    (outdoorPm25 * outdoorHours + baselineIndoorPm25 * indoorHours) /
    BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE;

  const protectedOutdoor = outdoorPm25 * (1 - Math.max(0, Math.min(1, params.outdoorFiltrationEff)));
  const protectedIndoor = baselineIndoorPm25 * (1 - Math.max(0, Math.min(1, params.indoorFiltrationEff)));
  const protectedDaily =
    (protectedOutdoor * outdoorHours + protectedIndoor * indoorHours) /
    BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE;

  const avoidedDaily = Math.max(0, baselineDaily - protectedDaily);
  const avoidedWeekly = avoidedDaily * 7;

  return {
    baselineCigarettesPerDay: Number(baselineDaily.toFixed(2)),
    protectedCigarettesPerDay: Number(protectedDaily.toFixed(2)),
    avoidedCigarettesPerDay: Number(avoidedDaily.toFixed(2)),
    avoidedCigarettesPerWeek: Number(avoidedWeekly.toFixed(1)),
  };
}
