/**
 * VayuShield AI - Indoor Action Steps & Risk Evaluation
 * Evaluates dominant hazards, ventilation ratings, and targeted remediation steps.
 */

import type { WindowSealType, IndoorCookingType, IncenseType } from './constants';

export function determineDominantHazard(
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

export function determineVentilationRating(
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

export function buildIndoorActionSteps(
  cadrCfm: number,
  windowSeal: WindowSealType,
  incenseUsage: IncenseType,
  cookingFuel: IndoorCookingType
): Array<{ title: string; action: string; impact: string }> {
  const actionSteps: Array<{ title: string; action: string; impact: string }> = [];

  if (cadrCfm < 300) {
    actionSteps.push({
      title: 'Deploy Corsi-Rosenthal Box Air Cleaner',
      action: 'Build a 350 CFM 4-filter MERV-13 box fan unit to drop indoor PM2.5 by ~75-85%.',
      impact: 'Drops indoor PM2.5 by up to 80%',
    });
  }

  if (windowSeal === 'leaky_drafty' || windowSeal === 'open_windows') {
    actionSteps.push({
      title: 'Perimeter Window Weatherstripping',
      action: 'Apply silicone foam seal tape around sash gaps to lower penetration factor P from 0.85 to 0.40.',
      impact: 'Cuts outdoor infiltration by 50%',
    });
  }

  if (incenseUsage !== 'none') {
    actionSteps.push({
      title: 'Cease Solid Incense Burning in Winter',
      action: 'Replace burning incense sticks with flameless LED diyas or closed essential oil diffusers.',
      impact: 'Eliminates 2,600 µg/h of fine aerosol',
    });
  }

  if (cookingFuel === 'lpg_unvented' || cookingFuel === 'biomass_chulha') {
    actionSteps.push({
      title: 'Switch to Induction Cooking Plate',
      action: 'Eliminate combustion byproducts (NO2 + black carbon) in the kitchen.',
      impact: 'Saves ~4,500 µg/h particulate emission',
    });
  }

  return actionSteps;
}
