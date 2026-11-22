/**
 * VayuShield AI - Air Quality Calculations & Standards
 * Implements US EPA Breakpoints for PM2.5, PM10, and NO2, with health advisories.
 */

import { AqiCategory } from './types';
import { AqiBreakpoint, PM25_BREAKPOINTS, PM10_BREAKPOINTS } from './air/breakpoints';
import { getHealthAdvisory } from './air/advisoriesAndThemes';

export * from './air/breakpoints';
export * from './air/advisoriesAndThemes';

/**
 * Calculates linear EPA AQI from raw pollutant concentration.
 * @param concentration - Pollutant concentration in ug/m3
 * @param breakpoints - Breakpoints lookup table
 * @returns AQI value, category, and label
 */
export function calculatePollutantAqi(concentration: number, breakpoints: AqiBreakpoint[]): {
  aqi: number;
  category: AqiCategory;
  label: string;
} {
  const conc = Math.max(0, concentration);
  if (!breakpoints || breakpoints.length === 0) {
    return { aqi: 0, category: 'good', label: 'Good' };
  }

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
      return { aqi, category: bp.category, label: bp.label };
    }
  }

  return { aqi: 0, category: 'good', label: 'Good' };
}

/**
 * Convenience PM2.5 AQI calculator.
 * @param pm25 - PM2.5 mass concentration in ug/m3
 * @returns AQI calculation result
 */
export function calculatePm25Aqi(pm25: number): {
  aqi: number;
  category: AqiCategory;
  label: string;
} {
  return calculatePollutantAqi(pm25, PM25_BREAKPOINTS);
}

/**
 * Overall AQI from PM2.5, PM10, NO2 (EPA maximum dominant pollutant standard).
 * @param pm25 - PM2.5 in ug/m3
 * @param pm10 - PM10 in ug/m3
 * @param no2 - NO2 in ug/m3
 * @returns Composite dominant AQI result and advisory
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
