/**
 * VayuShield AI - Fallback Intake Extractor
 * Deterministically extracts household profiles without external AI dependencies.
 */

import { z } from 'zod';
import { IntakeResponseSchema } from '../types';

function parseHouseholdSize(lower: string): number {
  const sizeMatch = /(?:family|household|living with)[^\d]{0,20}(\d{1,2})/i.exec(lower) || /(\d{1,2})[^\d]{0,15}(?:people|members|adults|kids|family)/i.exec(lower);
  if (sizeMatch?.[1]) {
    return Math.max(1, Math.min(15, Number.parseInt(sizeMatch[1], 10)));
  }
  return 4;
}

function detectCityFromText(lower: string, cityHint?: string): string {
  const cities = ['delhi', 'noida', 'gurugram', 'gurgaon', 'ghaziabad', 'faridabad', 'mumbai', 'lahore', 'kolkata', 'patna', 'lucknow', 'chandigarh', 'beijing', 'london', 'salt lake city'];
  for (const c of cities) {
    if (lower.includes(c)) {
      return c.charAt(0).toUpperCase() + c.slice(1);
    }
  }
  return cityHint || 'Delhi';
}

function detectCommuteModeFromText(lower: string): 'car' | 'carpool' | 'twoWheeler' | 'metro' | 'bus' | 'walkOrCycle' | 'ev' {
  if (lower.includes('metro') || lower.includes('subway') || lower.includes('train')) return 'metro';
  if (lower.includes('two wheeler') || lower.includes('scooter') || lower.includes('bike') || lower.includes('motorcycle')) return 'twoWheeler';
  if (lower.includes('bus')) return 'bus';
  if (lower.includes('cycle') || lower.includes('walk') || lower.includes('pedestrian')) return 'walkOrCycle';
  if (lower.includes('carpool') || lower.includes('ride share')) return 'carpool';
  if (lower.includes('ev') || lower.includes('electric vehicle')) return 'ev';
  return 'car';
}

function extractCommuteDistanceKm(lower: string): number {
  const distMatch = /(\d{1,3})[^\d]{0,10}(?:km|kms|kilometers|miles)/i.exec(lower);
  if (distMatch?.[1]) {
    return Math.min(100, Math.max(1, Number.parseInt(distMatch[1], 10)));
  }
  return 12;
}

function detectCookingAndHeating(lower: string): {
  cookingFuel: 'lpg' | 'biomassChulha' | 'induction' | 'pipedGas';
  heatingSource: 'unventedHeater' | 'electricHeater' | 'firewood' | 'none';
} {
  let cookingFuel: 'lpg' | 'biomassChulha' | 'induction' | 'pipedGas' = 'lpg';
  if (lower.includes('chulha') || lower.includes('wood') || lower.includes('dung') || lower.includes('biomass')) cookingFuel = 'biomassChulha';
  else if (lower.includes('induction') || lower.includes('electric stove')) cookingFuel = 'induction';
  else if (lower.includes('piped gas') || lower.includes('png')) cookingFuel = 'pipedGas';

  let heatingSource: 'unventedHeater' | 'electricHeater' | 'firewood' | 'none' = 'none';
  if (lower.includes('unvented') || lower.includes('gas heater') || lower.includes('blower')) heatingSource = 'unventedHeater';
  else if (lower.includes('electric heater') || lower.includes('oil heater') || lower.includes('radiator')) heatingSource = 'electricHeater';
  else if (lower.includes('firewood') || lower.includes('angithi')) heatingSource = 'firewood';

  return { cookingFuel, heatingSource };
}

/**
 * Extracts demographic and medical vulnerability profile deterministically from natural text.
 * @param text - Natural language input from user
 * @param cityHint - Optional preset city fallback
 * @returns Inferred intake response payload
 */
export function fallbackIntake(text: string, cityHint?: string): z.infer<typeof IntakeResponseSchema> {
  const lower = text.toLowerCase();

  const householdSize = parseHouseholdSize(lower);
  const city = detectCityFromText(lower, cityHint);

  const hasAsthma = lower.includes('asthma') || lower.includes('inhaler') || lower.includes('wheezing');
  const hasCopdOrCardiac = lower.includes('copd') || lower.includes('heart') || lower.includes('cardiac') || lower.includes('bronchitis');
  const hasChildren = lower.includes('kid') || lower.includes('child') || lower.includes('baby') || lower.includes('infant') || lower.includes('toddler') || lower.includes('school');
  const hasElderly = lower.includes('elderly') || lower.includes('senior') || lower.includes('grandparent') || lower.includes('grandfather') || lower.includes('grandmother') || lower.includes('parents');
  const isPregnant = lower.includes('pregnant') || lower.includes('pregnancy');

  const commuteMode = detectCommuteModeFromText(lower);
  const commuteDistanceKm = extractCommuteDistanceKm(lower);
  const { cookingFuel, heatingSource } = detectCookingAndHeating(lower);

  const hasAirPurifier = lower.includes('purifier') || lower.includes('hepa') || lower.includes('cr box');
  const wearsMaskOutdoors = lower.includes('mask') || lower.includes('n95') || lower.includes('respirator');

  const flags = [
    hasAsthma ? 'Asthma' : null,
    hasCopdOrCardiac ? 'Cardiovascular' : null,
    hasElderly ? 'Elderly' : null,
    hasChildren ? 'Children' : null,
    isPregnant ? 'Pregnancy' : null,
  ].filter(Boolean).join(', ') || 'Standard profile';

  return {
    householdSize,
    city,
    hasAsthma,
    hasCopdOrCardiac,
    hasChildren,
    hasElderly,
    isPregnant,
    commuteMode,
    commuteDistanceKm,
    cookingFuel,
    heatingSource,
    hasAirPurifier,
    wearsMaskOutdoors,
    explanation: `Extracted profile for ${householdSize} member(s) in ${city}. Medical risk flags identified: ${flags}. Primary commute via ${commuteMode}.`,
  };
}
