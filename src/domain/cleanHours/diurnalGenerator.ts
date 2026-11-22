/**
 * VayuShield AI - Diurnal Profile Generator
 * Models 24-hour diurnal curve driven by ground-level nocturnal thermal inversions.
 */

import type { HourlyForecastItem } from '../types';

export function mapHourlyAqiCategory(aqi: number): 'hazardous' | 'veryUnhealthy' | 'unhealthy' | 'moderate' {
  if (aqi > 300) return 'hazardous';
  if (aqi > 200) return 'veryUnhealthy';
  if (aqi > 150) return 'unhealthy';
  return 'moderate';
}

export function getExerciseWindowStatus(aqi: number): 'safe' | 'caution' | 'danger' {
  if (aqi <= 150) return 'safe';
  if (aqi <= 250) return 'caution';
  return 'danger';
}

/**
 * Generates default 24-hour diurnal profile based on winter temperature inversion curve.
 * @param basePm25 - Baseline PM2.5 in ug/m3
 * @returns 24-hour forecast array
 */
export function generateDefaultHourly(basePm25: number): HourlyForecastItem[] {
  const items: HourlyForecastItem[] = [];
  for (let i = 0; i < 24; i++) {
    const diurnalFactor = 1 + 0.35 * Math.sin(((i - 8) * Math.PI) / 12) * -1;
    const pm = Math.max(20, Math.round(basePm25 * diurnalFactor));
    const aqi = Math.min(500, Math.round((pm / 150) * 200));

    items.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      hour: i,
      pm25: pm,
      pm10: Math.round(pm * 1.6),
      no2: Math.round(40 + pm * 0.2),
      aqi,
      aqiCategory: mapHourlyAqiCategory(aqi),
      isExerciseSafe: i >= 12 && i <= 15 && aqi < 200,
      isCommuteWarning: (i >= 7 && i <= 10) || (i >= 19 && i <= 22),
      isVentilationSafe: i === 14 && aqi < 150,
      recommendation: i >= 12 && i <= 15 ? 'Moderate solar dispersion' : 'Inversion smog peak',
    });
  }
  return items;
}
