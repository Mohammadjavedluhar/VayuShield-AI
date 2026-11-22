/**
 * VayuShield AI - Open-Meteo Hourly Forecast Mapper
 * Transforms raw hourly Open-Meteo vectors into structured domain items.
 */

import { getCompositeAqi } from '../domain/airQuality';
import type { HourlyForecastItem } from '../domain/types';

export function calculateHourlySolarFactor(hour: number): number {
  if (hour >= 12 && hour <= 16) {
    return 0.65;
  }
  if ((hour >= 6 && hour <= 9) || (hour >= 20 && hour <= 23)) {
    return 1.25;
  }
  return 1.0;
}

export function parseHourlyForecast(
  times: string[],
  pm25Arr: number[],
  pm10Arr: number[],
  no2Arr: number[],
  fallbackPm25: number,
  fallbackPm10: number,
  fallbackNo2: number
): HourlyForecastItem[] {
  const hourlyForecast: HourlyForecastItem[] = [];
  const nowIso = new Date().toISOString().slice(0, 13);
  let startIndex = times.findIndex((t: string) => t.startsWith(nowIso));
  if (startIndex === -1) startIndex = 0;

  for (let i = startIndex; i < Math.min(times.length, startIndex + 24); i++) {
    const timeStr = times[i];
    const hour = new Date(timeStr).getHours();
    const p25 = Math.round(pm25Arr[i] ?? fallbackPm25);
    const p10 = Math.round(pm10Arr[i] ?? fallbackPm10);
    const no2Val = Math.round(no2Arr[i] ?? fallbackNo2);
    const hourComp = getCompositeAqi(p25, p10, no2Val);

    const isExerciseSafe = hour >= 12 && hour <= 15 && hourComp.overallAqi <= 175;
    const isCommuteWarning = (hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 21);
    const isVentilationSafe = hour >= 13 && hour <= 15 && hourComp.overallAqi <= 120;

    let rec = 'Normal caution';
    if (isExerciseSafe) rec = 'Safest solar-mixed window';
    else if (isCommuteWarning) rec = 'Thermal inversion smog peak; Wear N95';
    else if (hourComp.overallAqi > 300) rec = 'Hazardous emergency air';

    hourlyForecast.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      hour,
      pm25: p25,
      pm10: p10,
      no2: no2Val,
      aqi: hourComp.overallAqi,
      aqiCategory: hourComp.category,
      isExerciseSafe,
      isCommuteWarning,
      isVentilationSafe,
      recommendation: rec,
    });
  }

  return hourlyForecast;
}
