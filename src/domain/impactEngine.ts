/**
 * VayuShield AI - Deterministic Impact Engine
 *
 * Ground truth mathematical formulas for air quality health risks,
 * inhaled particulate doses, cigarette equivalence, and GHG reductions.
 *
 * Formulas derived from:
 * 1. Berkeley Earth (Richard Muller & Elizabeth Muller):
 *    1 cigarette/day ≈ 22 ug/m3 PM2.5 over 24 hours (22 * 24 = 528 ug*h/m3).
 * 2. US EPA Exposure Factors Handbook (mean adult inhalation rates: 0.54 - 0.60 m3/h).
 * 3. US EPA & UK DEFRA Greenhouse Gas Emission Factors (passenger transport & fuel combustion).
 * 4. Corsi-Rosenthal Foundation CADR sizing (ACH = (CADR * 60) / Volume).
 */

import {
  CommuteMode,
  CookingFuel,
  CorsiRosenthalSizing,
  HouseholdProfile,
  ImpactLedgerMetrics,
  Interventions,
} from './types';

// Berkeley Earth constant: 22 ug/m3 for 24 hours equals 1 cigarette
export const BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE = 528; // 22 * 24

// Default adult daily inhalation volume in m3 (approx 0.6 m3/h * 24h = 14.4 m3/day)
export const DEFAULT_DAILY_INHALATION_M3 = 14.4;
export const DEFAULT_HOURLY_INHALATION_M3 = 0.6;

// Baseline indoor infiltration ratio without active filtration (I/O ratio)
export const BASELINE_INDOOR_INFILTRATION_RATIO = 0.70;

// Emission factors (kg CO2 per passenger km)
export const CO2_EMISSION_FACTORS: Record<CommuteMode, number> = {
  car: 0.170,        // Single-occupancy gasoline sedan
  carpool: 0.085,    // Shared car (2-3 passengers)
  twoWheeler: 0.070, // 100-150cc petrol motorcycle / scooter
  bus: 0.060,        // Urban diesel/CNG bus
  metro: 0.035,      // Electric mass rapid transit
  ev: 0.045,         // Electric 2-wheeler / EV (grid-charged)
  walkOrCycle: 0.0,  // Active human mobility
};

// Daily cooking CO2 equivalent emissions in kg
export const COOKING_DAILY_CO2_KG: Record<CookingFuel, number> = {
  lpg: 1.50,            // ~1.5 hours LPG burner usage
  biomassChulha: 2.50,  // Fuelwood / dung cake combustion with high particulate + GHG
  induction: 0.45,      // Induction cooktop on standard electric grid
  pipedGas: 1.35,       // Piped natural gas (PNG)
};

/**
 * 1. Calculates cigarette-equivalent exposure from PM2.5 concentration and hours
 * Formula: (pm25 * hours) / 528
 */
export function calculateCigaretteEquivalents(pm25UgM3: number, hoursExposed: number = 24): number {
  if (pm25UgM3 <= 0 || hoursExposed <= 0) {
    return 0;
  }
  const cigs = (pm25UgM3 * hoursExposed) / BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE;
  return Number(cigs.toFixed(2));
}

/**
 * 2. Inhaled PM2.5 Mass Dose (ug/day) and Percentage Reduction
 * Calculates total micrograms of PM2.5 inhaled into lungs across outdoor and indoor hours.
 */
export interface InhaledDoseParams {
  outdoorPm25: number;
  outdoorHours?: number;      // default: 3 hours
  indoorHours?: number;       // default: 21 hours
  outdoorFiltrationEff?: number; // e.g. 0.95 for N95, 0.20 for cloth, 0 for none
  indoorFiltrationEff?: number;  // e.g. 0.85 for CR-Box/HEPA, 0 for none
  hourlyInhalationRateM3?: number; // default: 0.6 m3/h
}

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

  // Baseline indoor concentration without air cleaner (0.7x outdoor infiltration)
  const baselineIndoorPm25 = outdoorPm25 * BASELINE_INDOOR_INFILTRATION_RATIO;

  // Baseline inhaled mass in micrograms
  const baselineOutdoorInhaled = outdoorPm25 * outdoorHours * rate;
  const baselineIndoorInhaled = baselineIndoorPm25 * indoorHours * rate;
  const baselineTotalDose = baselineOutdoorInhaled + baselineIndoorInhaled;

  // Protected inhaled mass
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
 * 3. Cigarette-Equivalent Smoke Avoided per Week
 * Computes weekly avoided cigarette equivalents from combined outdoor N95 and indoor air cleaning.
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

  // Baseline daily cigarette equivalent
  const baselineDaily =
    (outdoorPm25 * outdoorHours + baselineIndoorPm25 * indoorHours) /
    BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE;

  // Protected daily cigarette equivalent
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

/**
 * 4. Kg of CO2 Saved per Week from Commute and Cooking/Heating Swaps
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

  // Commute savings
  const baselineFactor = CO2_EMISSION_FACTORS[params.baselineCommuteMode] ?? CO2_EMISSION_FACTORS.car;
  const chosenFactor = CO2_EMISSION_FACTORS[params.chosenCommuteMode] ?? baselineFactor;
  const diffPerKm = Math.max(0, baselineFactor - chosenFactor);
  const commuteWeeklySavings = diffPerKm * roundTripKm * days;

  // Cooking fuel savings
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

/**
 * 5. Corsi-Rosenthal Box Sizing (Clean Air Delivery Rate CADR & ACH)
 * Standards: 5 ACH recommended for high particulate / wildfire smog events.
 * A 20" MERV 13 4-filter box fan unit delivers ~350 CFM clean air.
 */
export function calculateCorsiRosenthalSizing(
  roomAreaSqFt: number,
  ceilingHeightFt: number = 9,
  targetAch: number = 5
): CorsiRosenthalSizing {
  const area = Math.max(50, roomAreaSqFt);
  const height = Math.max(7, Math.min(20, ceilingHeightFt));
  const ach = Math.max(2, Math.min(12, targetAch));

  const roomVolumeCuFt = area * height;

  // CADR (CFM) = (Volume cu.ft * ACH) / 60
  const requiredCadrCfm = Math.round((roomVolumeCuFt * ach) / 60);

  // Standard 20-inch 4-filter MERV 13 CR-Box delivers ~350 CFM
  const unitCapacityCfm = 350;
  const recommendedUnits = Math.max(1, Math.ceil(requiredCadrCfm / unitCapacityCfm));

  // Time to achieve 90% particle removal: t = -ln(0.10) / ACH hours * 60 minutes
  // -ln(0.10) ≈ 2.302585
  const timeTo90PctClearanceMinutes = Math.round((2.302585 / ach) * 60);

  // Cost comparison (INR)
  const diyCostEstimateInr = 2800 * recommendedUnits;
  const commercialHepaCostInr = 14500 * recommendedUnits;
  const savingsPct = Math.round(((commercialHepaCostInr - diyCostEstimateInr) / commercialHepaCostInr) * 100);

  return {
    roomAreaSqFt: area,
    ceilingHeightFt: height,
    roomVolumeCuFt,
    targetAch: ach,
    requiredCadrCfm,
    recommendedUnits,
    timeTo90PctClearanceMinutes,
    diyCostEstimateInr,
    commercialHepaCostInr,
    savingsPct,
  };
}

/**
 * 6. Deterministic Household Vulnerability Score (0 - 100)
 */
export function calculateHouseholdVulnerability(profile: Partial<HouseholdProfile>): {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: string[];
} {
  let score = 10; // Baseline urban winter smog exposure
  const riskFactors: string[] = [];

  if (profile.hasAsthma) {
    score += 35;
    riskFactors.push('Asthma patient (High airway hyperreactivity)');
  }
  if (profile.hasCopdOrCardiac) {
    score += 40;
    riskFactors.push('Cardiovascular / COPD vulnerability');
  }
  if (profile.isPregnant) {
    score += 25;
    riskFactors.push('Pregnancy (Placental PM2.5 translocation risk)');
  }
  if (profile.hasElderly) {
    score += 20;
    riskFactors.push('Elderly family members (Reduced pulmonary reserve)');
  }
  if (profile.hasChildren) {
    score += 20;
    riskFactors.push('Young children (Higher respiratory rate per kg body mass)');
  }

  // Commute exposure
  if (profile.commuteMode === 'twoWheeler') {
    score += 15;
    riskFactors.push('Open two-wheeler commute during morning inversions');
  } else if (profile.commuteMode === 'walkOrCycle') {
    score += 20;
    riskFactors.push('Active breathing during severe outdoor smog');
  }

  // Cooking source
  if (profile.cookingFuel === 'biomassChulha') {
    score += 25;
    riskFactors.push('Indoor solid biomass combustion');
  } else if (profile.cookingFuel === 'lpg' && profile.heatingSource === 'unventedHeater') {
    score += 15;
    riskFactors.push('Unvented combustion heating indoors');
  }

  // Mitigations
  if (profile.hasAirPurifier) {
    score = Math.max(10, score - 20);
  }
  if (profile.wearsMaskOutdoors) {
    score = Math.max(10, score - 15);
  }

  const boundedScore = Math.min(100, Math.max(0, score));

  let level: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (boundedScore >= 75) level = 'critical';
  else if (boundedScore >= 50) level = 'high';
  else if (boundedScore >= 25) level = 'moderate';

  return {
    score: boundedScore,
    level,
    riskFactors,
  };
}

/**
 * 7. Comprehensive Master Impact Engine Calculator
 * Aggregates all user choices and outputs deterministic ledger metrics.
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

  // Clean air hours gained: hours of indoor time rendered clean (>80% cleaner)
  const cleanAirHoursGainedPerDay = interventions.useAirPurifier ? 21 : 0;

  // Composite risk reduction score (0 - 100)
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
