/**
 * VayuShield AI - Air Quality Calculations & Standards
 * Implements US EPA Breakpoints for PM2.5, PM10, and NO2, with health advisories.
 */

import { AqiCategory } from './types';

export interface AqiBreakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
  category: AqiCategory;
  label: string;
}

// US EPA 2024 revised breakpoints for PM2.5 (ug/m3)
export const PM25_BREAKPOINTS: AqiBreakpoint[] = [
  { cLow: 0.0, cHigh: 9.0, iLow: 0, iHigh: 50, category: 'good', label: 'Good' },
  { cLow: 9.1, cHigh: 35.4, iLow: 51, iHigh: 100, category: 'moderate', label: 'Moderate' },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150, category: 'unhealthySensitive', label: 'Unhealthy for Sensitive Groups' },
  { cLow: 55.5, cHigh: 125.4, iLow: 151, iHigh: 200, category: 'unhealthy', label: 'Unhealthy' },
  { cLow: 125.5, cHigh: 225.4, iLow: 201, iHigh: 300, category: 'veryUnhealthy', label: 'Very Unhealthy' },
  { cLow: 225.5, cHigh: 325.4, iLow: 301, iHigh: 400, category: 'hazardous', label: 'Hazardous' },
  { cLow: 325.5, cHigh: 500.4, iLow: 401, iHigh: 500, category: 'hazardous', label: 'Hazardous' },
];

// PM10 breakpoints (ug/m3)
export const PM10_BREAKPOINTS: AqiBreakpoint[] = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50, category: 'good', label: 'Good' },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100, category: 'moderate', label: 'Moderate' },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150, category: 'unhealthySensitive', label: 'Unhealthy for Sensitive Groups' },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200, category: 'unhealthy', label: 'Unhealthy' },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300, category: 'veryUnhealthy', label: 'Very Unhealthy' },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500, category: 'hazardous', label: 'Hazardous' },
];

/**
 * Calculates linear EPA AQI from raw pollutant concentration
 */
export function calculatePollutantAqi(concentration: number, breakpoints: AqiBreakpoint[]): {
  aqi: number;
  category: AqiCategory;
  label: string;
} {
  const conc = Math.max(0, concentration);

  // If beyond upper bracket (severe winter inversion)
  const lastBracket = breakpoints[breakpoints.length - 1];
  if (conc > lastBracket.cHigh) {
    const extrapolated = Math.round(
      ((500 - 401) / (lastBracket.cHigh - lastBracket.cLow)) * (conc - lastBracket.cLow) + 401
    );
    return {
      aqi: Math.min(999, extrapolated),
      category: 'severe',
      label: 'Severe Emergency / Hazardous+',
    };
  }

  for (const bp of breakpoints) {
    if (conc >= bp.cLow && conc <= bp.cHigh) {
      const aqi = Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (conc - bp.cLow) + bp.iLow
      );
      return {
        aqi,
        category: bp.category,
        label: bp.label,
      };
    }
  }

  return { aqi: 0, category: 'good', label: 'Good' };
}

/**
 * Convenience PM2.5 AQI calculator
 */
export function calculatePm25Aqi(pm25: number) {
  return calculatePollutantAqi(pm25, PM25_BREAKPOINTS);
}

/**
 * Overall AQI from PM2.5, PM10, NO2 (EPA maximum dominant pollutant standard)
 */
export function getCompositeAqi(pm25: number, pm10: number, no2: number): {
  overallAqi: number;
  category: AqiCategory;
  categoryLabel: string;
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2';
  healthAdvisory: string;
} {
  const aqiPm25 = calculatePollutantAqi(pm25, PM25_BREAKPOINTS);
  const aqiPm10 = calculatePollutantAqi(pm10, PM10_BREAKPOINTS);
  
  // Approximate NO2 standard (ug/m3 -> AQI)
  const aqiNo2Val = Math.round(Math.min(500, (no2 / 200) * 100));

  let overallAqi = aqiPm25.aqi;
  let dominant: 'PM2.5' | 'PM10' | 'NO2' = 'PM2.5';
  let category = aqiPm25.category;
  let categoryLabel = aqiPm25.label;

  if (aqiPm10.aqi > overallAqi) {
    overallAqi = aqiPm10.aqi;
    dominant = 'PM10';
    category = aqiPm10.category;
    categoryLabel = aqiPm10.label;
  }

  if (aqiNo2Val > overallAqi) {
    overallAqi = aqiNo2Val;
    dominant = 'NO2';
  }

  const healthAdvisory = getHealthAdvisory(category);

  return {
    overallAqi,
    category,
    categoryLabel,
    dominantPollutant: dominant,
    healthAdvisory,
  };
}

export function getHealthAdvisory(category: AqiCategory): string {
  switch (category) {
    case 'good':
      return 'Air quality is satisfactory. Outdoor activities are safe for all individuals.';
    case 'moderate':
      return 'Acceptable air quality. Unusually sensitive individuals should consider reducing prolonged outdoor exertion.';
    case 'unhealthySensitive':
      return 'Members of sensitive groups (asthma, COPD, cardiac, children, elderly) may experience health effects. Wear N95 outside.';
    case 'unhealthy':
      return 'Everyone may begin to experience health effects. Active children and adults should avoid prolonged outdoor exertion.';
    case 'veryUnhealthy':
      return 'Health alert: risk of health effects increased for everyone. Wear certified N95 respirators outdoors; run indoor filtration.';
    case 'hazardous':
      return 'Health warnings of emergency conditions. The entire population is likely to be affected. Keep windows closed.';
    case 'severe':
      return 'Severe public health crisis. Avoid all outdoor physical activity. Seal windows and deploy continuous indoor filtration.';
  }
}

export function getAqiColorTheme(category: AqiCategory): {
  badgeBg: string;
  badgeText: string;
  progressColor: string;
  border: string;
} {
  switch (category) {
    case 'good':
      return {
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        badgeText: 'text-emerald-400',
        progressColor: 'bg-emerald-500',
        border: 'border-emerald-500/30',
      };
    case 'moderate':
      return {
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        badgeText: 'text-amber-400',
        progressColor: 'bg-amber-500',
        border: 'border-amber-500/30',
      };
    case 'unhealthySensitive':
      return {
        badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        badgeText: 'text-orange-400',
        progressColor: 'bg-orange-500',
        border: 'border-orange-500/30',
      };
    case 'unhealthy':
      return {
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        badgeText: 'text-rose-400',
        progressColor: 'bg-rose-500',
        border: 'border-rose-500/30',
      };
    case 'veryUnhealthy':
      return {
        badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        badgeText: 'text-purple-400',
        progressColor: 'bg-purple-500',
        border: 'border-purple-500/30',
      };
    case 'hazardous':
    case 'severe':
    default:
      return {
        badgeBg: 'bg-red-700/20 text-red-300 border-red-600/40',
        badgeText: 'text-red-400',
        progressColor: 'bg-red-600',
        border: 'border-red-600/40',
      };
  }
}
