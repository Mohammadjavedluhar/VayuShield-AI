/**
 * VayuShield AI - Clean Hour Windows & Action Checklist Generators
 * Shared deterministic algorithms for 24-hour diurnal windows and intervention checklists.
 */

import { CleanHourWindow } from './types';
import { generateDefaultHourly, getExerciseWindowStatus } from './cleanHours/diurnalGenerator';

export * from './cleanHours/diurnalGenerator';
export * from './cleanHours/actionChecklist';

export interface CleanHourInputItem {
  hour: number;
  aqi: number;
}

/**
 * Computes optimal clean hour windows for outdoor exercise, commute, ventilation, and sleep.
 * @param hourly - Array of hourly forecasts
 * @param currentPm25 - Current ambient PM2.5 in ug/m3
 * @returns Four structured clean hour time windows
 */
export function computeCleanHourWindows(hourly: CleanHourInputItem[], currentPm25: number): CleanHourWindow[] {
  const dayHours = hourly.length >= 24 ? hourly.slice(0, 24) : generateDefaultHourly(currentPm25);

  const afternoonHours = dayHours.filter((h) => h.hour >= 11 && h.hour <= 16);
  const bestExerciseHour = afternoonHours.reduce((best, cur) => (cur.aqi < best.aqi ? cur : best), afternoonHours[0] || dayHours[14]);

  const morningCommute = dayHours.filter((h) => h.hour >= 7 && h.hour <= 9);
  const avgMorningAqi = morningCommute.length > 0
    ? Math.round(morningCommute.reduce((s, h) => s + h.aqi, 0) / morningCommute.length)
    : 320;

  const bestVentHour = bestExerciseHour;
  const nightHours = dayHours.filter((h) => h.hour >= 22 || h.hour <= 6);
  const avgNightAqi = nightHours.length > 0
    ? Math.round(nightHours.reduce((s, h) => s + h.aqi, 0) / nightHours.length)
    : 340;

  return [
    {
      type: 'exercise',
      title: 'Safest Outdoor Exercise / Walk Window',
      startHour: Math.max(11, bestExerciseHour.hour - 1),
      endHour: Math.min(16, bestExerciseHour.hour + 2),
      avgAqi: bestExerciseHour.aqi,
      status: getExerciseWindowStatus(bestExerciseHour.aqi),
      advice:
        bestExerciseHour.aqi <= 150
          ? 'Thermal inversion is lifted by solar warmth. Safest window for brisk walking or errands.'
          : 'Air remains unhealthy even at midday. Limit outdoor cardio; prefer indoor workouts.',
    },
    {
      type: 'commute',
      title: 'Morning School & Office Commute',
      startHour: 7,
      endHour: 10,
      avgAqi: avgMorningAqi,
      status: 'danger',
      advice: 'Severe ground-level smoke trapped by nocturnal cold layer. N95 respirators mandatory; keep car recirculate mode ON.',
    },
    {
      type: 'ventilation',
      title: 'Filtered Air Exchange & Cross-Ventilation',
      startHour: 13,
      endHour: 15,
      avgAqi: bestVentHour.aqi,
      status: bestVentHour.aqi <= 120 ? 'safe' : 'caution',
      advice:
        bestVentHour.aqi <= 120
          ? 'Brief 15-minute cross-ventilation permissible to flush indoor CO2, followed by immediate filtration.'
          : 'Do NOT open windows. Ambient smog is too hazardous. Rely on indoor mechanical filtration with carbon stage.',
    },
    {
      type: 'sleep',
      title: 'Nighttime Sleep Air Management',
      startHour: 22,
      endHour: 6,
      avgAqi: avgNightAqi,
      status: 'caution',
      advice: 'Keep bedroom doors and windows tightly shut. Run Corsi-Rosenthal box or HEPA on medium-high speed all night.',
    },
  ];
}
