/**
 * VayuShield AI - Real-Time Indoor AQI Estimator (Without Hardware Sensor)
 *
 * Implements the US EPA Indoor Air Quality Mass Balance Steady-State Equation:
 * Cin = (P · a · Cout + S/V) / (a + k + CADR/V)
 *
 * References:
 * - US EPA Report EPA/600/R-04/007 (Indoor PM Mass Balance)
 * - Dockery & Spengler (Indoor-Outdoor particulate ratios)
 * - Corsi-Rosenthal Clean Air Delivery Rate (CADR) standards
 */

import { calculatePm25Aqi } from './airQuality';
import { AqiCategory } from './types';

export type WindowSealType = 'weathersealed' | 'standard_closed' | 'leaky_drafty' | 'open_windows';
export type IndoorCookingType = 'induction' | 'lpg_with_exhaust' | 'lpg_unvented' | 'biomass_chulha';
export type IncenseType = 'none' | 'single_stick' | 'multiple_dhoop';
export type VentilationRateType = 'low_sealed' | 'moderate_natural' | 'high_draft';
export type AirPurifierType = 'none' | 'diy_corsi_rosenthal' | 'hepa_h13' | 'dual_purifiers';

export interface IndoorEstimatorInputs {
  outdoorPm25: number;
  windowSeal: WindowSealType;
  cookingFuel: IndoorCookingType;
  incenseUsage: IncenseType;
  ventilationRate: VentilationRateType;
  airPurifier: AirPurifierType;
  roomAreaSqFt?: number; // default: 200 sq ft
  ceilingHeightFt?: number; // default: 9 ft
}

export interface IndoorEstimatorResult {
  outdoorPm25: number;
  outdoorAqi: number;
  indoorPm25: number;
  indoorAqi: number;
  indoorCategory: AqiCategory;
  ratioIndoorOutdoor: number; // e.g. 0.28 (28% of outdoor)
  infiltratedOutdoorPm25: number;
  selfGeneratedIndoorPm25: number;
  purifierCleanAirDeliveryCfm: number;
  purifierBenefitUg: number;
  ventilationRating: 'sealed_clean' | 'moderate' | 'hazardously_unfiltered';
  dominantHazard: string;
  actionSteps: Array<{
    title: string;
    action: string;
    impact: string;
  }>;
  summary: string;
}

// Penetration factors P (fraction of outdoor PM2.5 entering building envelope)
export const PENETRATION_FACTORS: Record<WindowSealType, number> = {
  weathersealed: 0.40,     // Silicone tape / weatherstripped frames
  standard_closed: 0.65,   // Normal closed Indian/Asian windows
  leaky_drafty: 0.85,      // Old single pane, sliding balcony gaps
  open_windows: 1.00,      // Fully open windows
};

// Air exchange rate a (ACH = Air Changes per Hour, h^-1)
export const AIR_EXCHANGE_RATES: Record<VentilationRateType, number> = {
  low_sealed: 0.35,        // Tight, draft-controlled room
  moderate_natural: 0.65,  // Standard infiltration
  high_draft: 1.30,        // Leaky or drafty
};

// Indoor Source Generation Rates S (µg/hour)
export const COOKING_SOURCE_RATES_UG_H: Record<IndoorCookingType, number> = {
  induction: 0,            // Zero combustion particulate
  lpg_with_exhaust: 850,   // LPG burner with active chimney / window exhaust
  lpg_unvented: 4500,      // Unvented LPG frying & combustion
  biomass_chulha: 19500,   // Solid fuel dung/wood smoke
};

export const INCENSE_SOURCE_RATES_UG_H: Record<IncenseType, number> = {
  none: 0,
  single_stick: 2600,      // Standard agarbatti stick (~2.6 mg/h)
  multiple_dhoop: 7200,    // Dense dhoop / sambrani cones
};

// CADR in m³/h (1 CFM = 1.699011 m³/h)
export const AIR_PURIFIER_CADR_M3_H: Record<AirPurifierType, { cadrM3H: number; cadrCfm: number }> = {
  none: { cadrM3H: 0, cadrCfm: 0 },
  diy_corsi_rosenthal: { cadrM3H: 595, cadrCfm: 350 }, // 350 CFM
  hepa_h13: { cadrM3H: 374, cadrCfm: 220 },            // 220 CFM
  dual_purifiers: { cadrM3H: 934, cadrCfm: 550 },      // 550 CFM
};

// Surface deposition loss rate k (approx 0.35 h^-1 for fine PM2.5)
export const SURFACE_DEPOSITION_RATE_K = 0.35;

/**
 * Estimates steady-state indoor PM2.5 concentration using EPA Mass Balance Model
 */
function determineDominantHazard(
  selfGeneratedIndoorPm25: number,
  infiltratedOutdoorPm25: number,
  cookingFuel: string,
  incenseUsage: string
): string {
  if (selfGeneratedIndoorPm25 <= infiltratedOutdoorPm25) {
    return 'Ambient Smog Infiltration';
  }
  if (cookingFuel.includes('biomass')) {
    return 'Solid Fuel Biomass Chulha Smoke';
  }
  if (incenseUsage !== 'none') {
    return 'Indoor Incense / Agarbatti Burning';
  }
  return 'Unvented Cooking Emissions';
}

function determineVentilationRating(
  indoorPm25: number,
  ratioIndoorOutdoor: number
): 'sealed_clean' | 'moderate' | 'hazardously_unfiltered' {
  if (indoorPm25 <= 35) {
    return 'sealed_clean';
  }
  if (indoorPm25 >= 150 || ratioIndoorOutdoor > 0.75) {
    return 'hazardously_unfiltered';
  }
  return 'moderate';
}

export function estimateIndoorAirQuality(inputs: IndoorEstimatorInputs): IndoorEstimatorResult {
  const outdoorPm25 = Math.max(5, inputs.outdoorPm25);
  const outdoorAqiCalc = calculatePm25Aqi(outdoorPm25);

  const areaSqFt = inputs.roomAreaSqFt ?? 200;
  const heightFt = inputs.ceilingHeightFt ?? 9;

  // Room volume in cubic meters (1 cu ft = 0.0283168 m³)
  const volumeCuFt = areaSqFt * heightFt;
  const volumeM3 = volumeCuFt * 0.0283168;

  const P = PENETRATION_FACTORS[inputs.windowSeal] ?? 0.65;
  const a = AIR_EXCHANGE_RATES[inputs.ventilationRate] ?? 0.65;
  const k = SURFACE_DEPOSITION_RATE_K;

  // Total indoor emission rate S (µg/h)
  const cookingRate = COOKING_SOURCE_RATES_UG_H[inputs.cookingFuel] ?? 0;
  const incenseRate = INCENSE_SOURCE_RATES_UG_H[inputs.incenseUsage] ?? 0;
  const totalSourceRateS = cookingRate + incenseRate;

  // Air cleaner CADR
  const { cadrM3H, cadrCfm } = AIR_PURIFIER_CADR_M3_H[inputs.airPurifier] ?? { cadrM3H: 0, cadrCfm: 0 };

  // EPA Steady-State Formula:
  // Cin = (P * a * Cout + S/V) / (a + k + CADR/V)
  const numerator = P * a * outdoorPm25 + totalSourceRateS / volumeM3;
  const denominator = a + k + cadrM3H / volumeM3;

  const indoorPm25Raw = numerator / denominator;
  const indoorPm25 = Number(Math.max(2, indoorPm25Raw).toFixed(1));
  const indoorAqiCalc = calculatePm25Aqi(indoorPm25);

  // Components breakdown
  const infiltratedOutdoorPm25 = Number(((P * a * outdoorPm25) / denominator).toFixed(1));
  const selfGeneratedIndoorPm25 = Number(((totalSourceRateS / volumeM3) / denominator).toFixed(1));

  // Purifier benefit (what would it be without purifier?)
  const denomWithoutPurifier = a + k;
  const indoorWithoutPurifier = numerator / denomWithoutPurifier;
  const purifierBenefitUg = Number(Math.max(0, indoorWithoutPurifier - indoorPm25).toFixed(1));

  const ratioIndoorOutdoor = Number((indoorPm25 / outdoorPm25).toFixed(2));

  // Ventilation rating & dominant hazard
  const ventilationRating = determineVentilationRating(indoorPm25, ratioIndoorOutdoor);
  const dominantHazard = determineDominantHazard(
    selfGeneratedIndoorPm25,
    infiltratedOutdoorPm25,
    inputs.cookingFuel,
    inputs.incenseUsage
  );

  // Targeted action steps
  const actionSteps: Array<{ title: string; action: string; impact: string }> = [];

  if (cadrCfm < 300) {
    actionSteps.push({
      title: 'Deploy Corsi-Rosenthal Box Air Cleaner',
      action: 'Build a 350 CFM 4-filter MERV-13 box fan unit to drop indoor PM2.5 by ~75-85%.',
      impact: 'Drops indoor PM2.5 by up to 80%',
    });
  }

  if (inputs.windowSeal === 'leaky_drafty' || inputs.windowSeal === 'open_windows') {
    actionSteps.push({
      title: 'Perimeter Window Weatherstripping',
      action: 'Apply silicone foam seal tape around sash gaps to lower penetration factor P from 0.85 to 0.40.',
      impact: 'Cuts outdoor infiltration by 50%',
    });
  }

  if (inputs.incenseUsage !== 'none') {
    actionSteps.push({
      title: 'Cease Solid Incense Burning in Winter',
      action: 'Replace burning incense sticks with flameless LED diyas or closed essential oil diffusers.',
      impact: 'Eliminates 2,600 µg/h of fine aerosol',
    });
  }

  if (inputs.cookingFuel === 'lpg_unvented' || inputs.cookingFuel === 'biomass_chulha') {
    actionSteps.push({
      title: 'Switch to Induction Cooking Plate',
      action: 'Eliminate combustion byproducts (NO2 + black carbon) in the kitchen.',
      impact: 'Saves ~4,500 µg/h particulate emission',
    });
  }

  const summary = `EPA Mass-Balance model estimates indoor PM2.5 at ${indoorPm25} µg/m³ (AQI ${indoorAqiCalc.aqi}) vs outdoor ${outdoorPm25} µg/m³ (AQI ${outdoorAqiCalc.aqi}). Indoor air is ${Math.round((1 - ratioIndoorOutdoor) * 100)}% cleaner than outdoor air. Dominant factor: ${dominantHazard}.`;

  return {
    outdoorPm25,
    outdoorAqi: outdoorAqiCalc.aqi,
    indoorPm25,
    indoorAqi: indoorAqiCalc.aqi,
    indoorCategory: indoorAqiCalc.category,
    ratioIndoorOutdoor,
    infiltratedOutdoorPm25,
    selfGeneratedIndoorPm25,
    purifierCleanAirDeliveryCfm: cadrCfm,
    purifierBenefitUg,
    ventilationRating,
    dominantHazard,
    actionSteps,
    summary,
  };
}
