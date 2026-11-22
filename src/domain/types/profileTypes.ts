/**
 * VayuShield AI - Household Profile & Impact Types
 * Contracts for household demographics, interventions, and impact ledger metrics.
 */

export type CommuteMode = 'car' | 'carpool' | 'twoWheeler' | 'metro' | 'bus' | 'walkOrCycle' | 'ev';
export type CookingFuel = 'lpg' | 'biomassChulha' | 'induction' | 'pipedGas';
export type HeatingSource = 'unventedHeater' | 'electricHeater' | 'firewood' | 'none';

export type AqiCategory =
  | 'good'
  | 'moderate'
  | 'unhealthySensitive'
  | 'unhealthy'
  | 'veryUnhealthy'
  | 'hazardous'
  | 'severe';

export interface HouseholdProfile {
  householdSize: number;
  city: string;
  hasAsthma: boolean;
  hasCopdOrCardiac: boolean;
  hasChildren: boolean;
  hasElderly: boolean;
  isPregnant: boolean;
  commuteMode: CommuteMode;
  commuteDistanceKm: number;
  cookingFuel: CookingFuel;
  heatingSource: HeatingSource;
  hasAirPurifier: boolean;
  wearsMaskOutdoors: boolean;
  rawInput?: string;
  vulnerabilityScore: number;
  vulnerabilityLevel: 'low' | 'moderate' | 'high' | 'critical';
}

export interface Interventions {
  useN95Mask: boolean;
  useAirPurifier: boolean;
  commuteMode: 'car' | 'carpool' | 'metro' | 'ev' | 'walkOrCycle';
  cookingFuel: 'lpg' | 'induction';
  roomSealImprovement: boolean;
  wetMoppingDaily: boolean;
}

export interface ImpactLedgerMetrics {
  baselineInhaledPm25DoseUgPerDay: number;
  protectedInhaledPm25DoseUgPerDay: number;
  inhaledPm25ReductionPct: number;
  baselineCigarettesPerDay: number;
  avoidedCigarettesPerDay: number;
  avoidedCigarettesPerWeek: number;
  co2SavedKgPerWeek: number;
  cleanAirHoursGainedPerDay: number;
  riskReductionScore: number;
}
