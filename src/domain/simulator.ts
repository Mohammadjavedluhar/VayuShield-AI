/**
 * VayuShield AI - Interactive "What-If" Impact Simulator Engine
 *
 * Dynamically evaluates user policy interventions across custom daily hours,
 * commute distances, and filtration equipment runtimes.
 */

import { CommuteMode, CookingFuel } from './types';
import { MaskGrade } from './commuteGuard';
import { calculateAvoidedCigarettesWeekly, calculateCo2SavingsWeekly, calculateInhaledPm25Dose } from './impactEngine';

export interface SimulatorInputs {
  ambientPm25: number;
  commuteDistanceKm: number;
  commuteDaysPerWeek: number;
  commuteMode: CommuteMode;
  baselineCommuteMode: CommuteMode;
  purifierRuntimeHours: number; // 0 - 24 h/day
  maskGrade: MaskGrade;
  cookingFuel: CookingFuel;
  baselineCookingFuel: CookingFuel;
  householdSize: number;
}

export interface SimulatorOutputs {
  inhaledPm25ReductionPct: number;
  avoidedCigarettesWeekly: number;
  co2SavedWeeklyKg: number;
  annualCo2SavedKg: number;
  cleanAirHoursGainedDaily: number;
  estimatedMonthlyRupeeSavings: number;
  protectionTier: 'maximum_shield' | 'high_defense' | 'moderate' | 'minimal';
  summarySentence: string;
}

export function runWhatIfSimulation(inputs: SimulatorInputs): SimulatorOutputs {
  const ambientPm25 = Math.max(5, inputs.ambientPm25);
  const householdSize = Math.max(1, inputs.householdSize);

  // Mask efficiency
  let outdoorEff = 0.0;
  if (inputs.maskGrade === 'n95') outdoorEff = 0.95;
  else if (inputs.maskGrade === 'kn95') outdoorEff = 0.90;
  else if (inputs.maskGrade === 'surgical') outdoorEff = 0.35;
  else if (inputs.maskGrade === 'cloth') outdoorEff = 0.20;

  // Indoor purifier efficiency scaled by runtime hours
  // 24 hours of CR-Box/HEPA = 85% reduction. If running 12 hours, eff = 0.85 * (12/24) = 42.5%
  const indoorRuntimeRatio = Math.max(0, Math.min(24, inputs.purifierRuntimeHours)) / 24;
  const indoorEff = 0.85 * indoorRuntimeRatio;

  // Inhaled dose
  const dose = calculateInhaledPm25Dose({
    outdoorPm25: ambientPm25,
    outdoorHours: 3,
    indoorHours: 21,
    outdoorFiltrationEff: outdoorEff,
    indoorFiltrationEff: indoorEff,
  });

  // Cigarettes avoided
  const cigs = calculateAvoidedCigarettesWeekly({
    outdoorPm25: ambientPm25,
    outdoorHours: 3,
    indoorHours: 21,
    outdoorFiltrationEff: outdoorEff,
    indoorFiltrationEff: indoorEff,
  });

  // Scale cigarettes avoided by household size
  const totalFamilyAvoidedCigs = Number((cigs.avoidedCigarettesPerWeek * (householdSize * 0.85)).toFixed(1));

  // CO2 savings
  const co2 = calculateCo2SavingsWeekly({
    baselineCommuteMode: inputs.baselineCommuteMode,
    chosenCommuteMode: inputs.commuteMode,
    oneWayDistanceKm: inputs.commuteDistanceKm,
    commuteDaysPerWeek: inputs.commuteDaysPerWeek,
    baselineCookingFuel: inputs.baselineCookingFuel,
    chosenCookingFuel: inputs.cookingFuel,
  });

  const co2SavedWeeklyKg = co2.totalCo2SavedWeekly;
  const annualCo2SavedKg = Math.round(co2SavedWeeklyKg * 52);

  // Estimated rupee savings (fuel saved + reduced medical / nebulizer visits)
  // Gasoline avoided: ~1 liter per 12 km -> ~₹102 / liter
  const weeklyKm = inputs.commuteDistanceKm * 2 * inputs.commuteDaysPerWeek;
  const isCarToTransit = inputs.baselineCommuteMode === 'car' && (inputs.commuteMode === 'metro' || inputs.commuteMode === 'carpool');
  const fuelSavingsMonthly = isCarToTransit ? (weeklyKm / 12) * 102 * 4.33 : 0;
  const healthSavingsMonthly = dose.percentageReduction > 60 ? 1800 : 600;
  const estimatedMonthlyRupeeSavings = Math.round(fuelSavingsMonthly + healthSavingsMonthly);

  // Protection tier
  let protectionTier: 'maximum_shield' | 'high_defense' | 'moderate' | 'minimal' = 'minimal';
  if (dose.percentageReduction >= 80) protectionTier = 'maximum_shield';
  else if (dose.percentageReduction >= 60) protectionTier = 'high_defense';
  else if (dose.percentageReduction >= 30) protectionTier = 'moderate';

  const summarySentence = `Simulated adjustments achieve ${dose.percentageReduction}% less inhaled PM2.5, preventing ${totalFamilyAvoidedCigs} cigarettes-equivalent of smoke across your ${householdSize}-member household and eliminating ${co2SavedWeeklyKg} kg of CO2 weekly.`;

  return {
    inhaledPm25ReductionPct: dose.percentageReduction,
    avoidedCigarettesWeekly: totalFamilyAvoidedCigs,
    co2SavedWeeklyKg,
    annualCo2SavedKg,
    cleanAirHoursGainedDaily: Math.round(inputs.purifierRuntimeHours),
    estimatedMonthlyRupeeSavings,
    protectionTier,
    summarySentence,
  };
}
