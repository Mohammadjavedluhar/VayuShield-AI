/**
 * VayuShield AI - Deterministic Impact Engine
 * Aggregates exposure, cigarette equivalence, CO2 savings, and air cleaning impact.
 */

import type { HouseholdProfile, ImpactLedgerMetrics, Interventions } from './types';
import { calculateInhaledPm25Dose, calculateAvoidedCigarettesWeekly } from './impact/doseCalculator';
import { calculateCo2SavingsWeekly } from './impact/savingsCalculator';

export * from './impact/constants';
export * from './impact/doseCalculator';
export * from './impact/savingsCalculator';
export * from './impact/crSizingCalculator';
export * from './impact/vulnerabilityCalculator';

/**
 * Comprehensive Master Impact Engine Calculator
 * Aggregates all user choices and outputs deterministic ledger metrics.
 * @param outdoorPm25 - Ambient outdoor PM2.5 in ug/m3
 * @param profile - User household demographic profile
 * @param interventions - Applied physical interventions
 * @returns Master calculated impact ledger metrics
 */
export function calculateMasterImpactLedger(
  outdoorPm25: number,
  profile: HouseholdProfile,
  interventions: Interventions
): ImpactLedgerMetrics {
  const outdoorEff = interventions.useN95Mask ? 0.95 : 0.0;
  
  let indoorEff = 0.0;
  if (interventions.useAirPurifier) indoorEff += 0.85;
  if (interventions.roomSealImprovement) indoorEff += 0.05;
  if (interventions.wetMoppingDaily) indoorEff += 0.04;
  indoorEff = Math.min(0.96, indoorEff);

  const dose = calculateInhaledPm25Dose({
    outdoorPm25,
    outdoorHours: 3,
    indoorHours: 21,
    outdoorFiltrationEff: outdoorEff,
    indoorFiltrationEff: indoorEff,
  });

  const cigs = calculateAvoidedCigarettesWeekly({
    outdoorPm25,
    outdoorHours: 3,
    indoorHours: 21,
    outdoorFiltrationEff: outdoorEff,
    indoorFiltrationEff: indoorEff,
  });

  const co2 = calculateCo2SavingsWeekly({
    baselineCommuteMode: profile.commuteMode,
    chosenCommuteMode: interventions.commuteMode,
    oneWayDistanceKm: profile.commuteDistanceKm,
    commuteDaysPerWeek: 5,
    baselineCookingFuel: profile.cookingFuel,
    chosenCookingFuel: interventions.cookingFuel,
  });

  const cleanAirHoursGainedPerDay = interventions.useAirPurifier ? 21 : 0;
  const riskReductionScore = Math.min(
    100,
    Math.round(dose.percentageReduction * 0.7 + (interventions.useN95Mask ? 30 : 0))
  );

  return {
    baselineInhaledPm25DoseUgPerDay: dose.baselineDoseUg,
    protectedInhaledPm25DoseUgPerDay: dose.protectedDoseUg,
    inhaledPm25ReductionPct: dose.percentageReduction,
    baselineCigarettesPerDay: cigs.baselineCigarettesPerDay,
    avoidedCigarettesPerDay: cigs.avoidedCigarettesPerDay,
    avoidedCigarettesPerWeek: cigs.avoidedCigarettesPerWeek,
    co2SavedKgPerWeek: co2.totalCo2SavedWeekly,
    cleanAirHoursGainedPerDay,
    riskReductionScore,
  };
}
