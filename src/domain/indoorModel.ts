/**
 * VayuShield AI - Real-Time Indoor AQI Estimator (Without Hardware Sensor)
 * Implements the US EPA Indoor Air Quality Mass Balance Steady-State Equation:
 * Cin = (P · a · Cout + S/V) / (a + k + CADR/V)
 */

import { calculatePm25Aqi } from './airQuality';
import { AqiCategory } from './types';
import {
  WindowSealType,
  IndoorCookingType,
  IncenseType,
  VentilationRateType,
  AirPurifierType,
  PENETRATION_FACTORS,
  AIR_EXCHANGE_RATES,
  COOKING_SOURCE_RATES_UG_H,
  INCENSE_SOURCE_RATES_UG_H,
  AIR_PURIFIER_CADR_M3_H,
  SURFACE_DEPOSITION_RATE_K,
} from './indoor/constants';
import {
  determineDominantHazard,
  determineVentilationRating,
  buildIndoorActionSteps,
} from './indoor/actionSteps';

export * from './indoor/constants';

export interface IndoorEstimatorInputs {
  outdoorPm25: number;
  windowSeal: WindowSealType;
  cookingFuel: IndoorCookingType;
  incenseUsage: IncenseType;
  ventilationRate: VentilationRateType;
  airPurifier: AirPurifierType;
  roomAreaSqFt?: number;
  ceilingHeightFt?: number;
}

export interface IndoorEstimatorResult {
  outdoorPm25: number;
  outdoorAqi: number;
  indoorPm25: number;
  indoorAqi: number;
  indoorCategory: AqiCategory;
  ratioIndoorOutdoor: number;
  infiltratedOutdoorPm25: number;
  selfGeneratedIndoorPm25: number;
  purifierCleanAirDeliveryCfm: number;
  purifierBenefitUg: number;
  ventilationRating: 'sealed_clean' | 'moderate' | 'hazardously_unfiltered';
  dominantHazard: string;
  actionSteps: Array<{ title: string; action: string; impact: string }>;
  summary: string;
}

/**
 * Estimates steady-state indoor PM2.5 concentration using EPA Mass Balance Model.
 * @param inputs - Physical room, source generation, and filtration inputs
 * @returns Comprehensive indoor air quality estimate
 */
export function estimateIndoorAirQuality(inputs: IndoorEstimatorInputs): IndoorEstimatorResult {
  const outdoorPm25 = Math.max(5, inputs.outdoorPm25);
  const outdoorAqiCalc = calculatePm25Aqi(outdoorPm25);

  const areaSqFt = inputs.roomAreaSqFt ?? 200;
  const heightFt = inputs.ceilingHeightFt ?? 9;
  const volumeM3 = areaSqFt * heightFt * 0.0283168;

  const P = PENETRATION_FACTORS[inputs.windowSeal] ?? 0.65;
  const a = AIR_EXCHANGE_RATES[inputs.ventilationRate] ?? 0.65;
  const k = SURFACE_DEPOSITION_RATE_K;

  const cookingRate = COOKING_SOURCE_RATES_UG_H[inputs.cookingFuel] ?? 0;
  const incenseRate = INCENSE_SOURCE_RATES_UG_H[inputs.incenseUsage] ?? 0;
  const totalSourceRateS = cookingRate + incenseRate;

  const { cadrM3H, cadrCfm } = AIR_PURIFIER_CADR_M3_H[inputs.airPurifier] ?? { cadrM3H: 0, cadrCfm: 0 };

  const numerator = P * a * outdoorPm25 + totalSourceRateS / volumeM3;
  const denominator = a + k + cadrM3H / volumeM3;

  const indoorPm25 = Number(Math.max(2, numerator / denominator).toFixed(1));
  const indoorAqiCalc = calculatePm25Aqi(indoorPm25);

  const infiltratedOutdoorPm25 = Number(((P * a * outdoorPm25) / denominator).toFixed(1));
  const selfGeneratedIndoorPm25 = Number(((totalSourceRateS / volumeM3) / denominator).toFixed(1));

  const denomWithoutPurifier = a + k;
  const indoorWithoutPurifier = numerator / denomWithoutPurifier;
  const purifierBenefitUg = Number(Math.max(0, indoorWithoutPurifier - indoorPm25).toFixed(1));

  const ratioIndoorOutdoor = Number((indoorPm25 / outdoorPm25).toFixed(2));
  const ventilationRating = determineVentilationRating(indoorPm25, ratioIndoorOutdoor);
  const dominantHazard = determineDominantHazard(
    selfGeneratedIndoorPm25,
    infiltratedOutdoorPm25,
    inputs.cookingFuel,
    inputs.incenseUsage
  );

  const actionSteps = buildIndoorActionSteps(cadrCfm, inputs.windowSeal, inputs.incenseUsage, inputs.cookingFuel);
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
