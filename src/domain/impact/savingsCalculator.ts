/**
 * VayuShield AI - Greenhouse Gas Savings Calculator
 * Computes weekly CO2 reduction from transit mode shift and clean cooking.
 */

import type { CommuteMode, CookingFuel } from '../types';
import { CO2_EMISSION_FACTORS, COOKING_DAILY_CO2_KG } from './constants';

/**
 * Calculates kg of CO2 saved per week from commute and cooking fuel transitions.
 * @param params - Commute modes, distances, and cooking fuel types
 * @returns Commute, cooking, and total weekly CO2 savings in kg
 */
export function calculateCo2SavingsWeekly(params: {
  baselineCommuteMode: CommuteMode;
  chosenCommuteMode: CommuteMode;
  oneWayDistanceKm: number;
  commuteDaysPerWeek?: number;
  baselineCookingFuel: CookingFuel;
  chosenCookingFuel: CookingFuel;
}): {
  commuteCo2SavedWeekly: number;
  cookingCo2SavedWeekly: number;
  totalCo2SavedWeekly: number;
} {
  const distance = Math.max(0, params.oneWayDistanceKm);
  const days = Math.max(0, Math.min(7, params.commuteDaysPerWeek ?? 5));
  const roundTripKm = distance * 2;

  const baselineFactor = CO2_EMISSION_FACTORS[params.baselineCommuteMode] ?? CO2_EMISSION_FACTORS.car;
  const chosenFactor = CO2_EMISSION_FACTORS[params.chosenCommuteMode] ?? baselineFactor;
  const diffPerKm = Math.max(0, baselineFactor - chosenFactor);
  const commuteWeeklySavings = diffPerKm * roundTripKm * days;

  const baselineCookingCo2Daily = COOKING_DAILY_CO2_KG[params.baselineCookingFuel] ?? COOKING_DAILY_CO2_KG.lpg;
  const chosenCookingCo2Daily = COOKING_DAILY_CO2_KG[params.chosenCookingFuel] ?? baselineCookingCo2Daily;
  const cookingDailyDiff = Math.max(0, baselineCookingCo2Daily - chosenCookingCo2Daily);
  const cookingWeeklySavings = cookingDailyDiff * 7;

  const totalWeekly = commuteWeeklySavings + cookingWeeklySavings;

  return {
    commuteCo2SavedWeekly: Number(commuteWeeklySavings.toFixed(2)),
    cookingCo2SavedWeekly: Number(cookingWeeklySavings.toFixed(2)),
    totalCo2SavedWeekly: Number(totalWeekly.toFixed(2)),
  };
}
