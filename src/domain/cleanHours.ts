/**
 * VayuShield AI - Clean Hour Windows & Action Checklist Generators
 * Shared deterministic algorithms for 24-hour diurnal windows and intervention checklists.
 */

import { CleanHourWindow, HourlyForecastItem, ImpactLedgerMetrics, ActionItem } from './types';

/**
 * Maps an AQI value to its diurnal category without nested ternary branching.
 */
function mapHourlyAqiCategory(aqi: number): 'hazardous' | 'veryUnhealthy' | 'unhealthy' | 'moderate' {
  if (aqi > 300) return 'hazardous';
  if (aqi > 200) return 'veryUnhealthy';
  if (aqi > 150) return 'unhealthy';
  return 'moderate';
}

/**
 * Determines outdoor exercise safety status for a given AQI.
 */
function getExerciseWindowStatus(aqi: number): 'safe' | 'caution' | 'danger' {
  if (aqi <= 150) return 'safe';
  if (aqi <= 250) return 'caution';
  return 'danger';
}

/**
 * Generates default 24-hour diurnal profile based on winter temperature inversion curve.
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

export interface CleanHourInputItem {
  hour: number;
  aqi: number;
}

/**
 * Computes optimal clean hour windows for outdoor exercise, commute, ventilation, and sleep.
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

/**
 * Returns baseline action items grounded in calculated impact metrics.
 */
export function getDefaultActionChecklist(ledger: ImpactLedgerMetrics): ActionItem[] {
  return [
    {
      id: 'task-1',
      task: 'Equip all family members with certified N95 respirators',
      category: 'immediate',
      urgency: 'high',
      rationale: 'Filters over 95% of inhaled fine particulates during outdoor exposure.',
    },
    {
      id: 'task-2',
      task: 'Deploy Corsi-Rosenthal Box or HEPA cleaner continuously',
      category: 'equipment',
      urgency: 'high',
      rationale: `Yields ${ledger.inhaledPm25ReductionPct}% particulate reduction and saves ${ledger.avoidedCigarettesPerWeek} cigarette-equivalents weekly.`,
    },
    {
      id: 'task-3',
      task: 'Execute daily damp microfiber wet mopping',
      category: 'daily',
      urgency: 'medium',
      rationale: 'Eliminates settled dust resuspension without kicking particles into the air.',
    },
    {
      id: 'task-4',
      task: 'Seal leaky window drafts with silicone tape',
      category: 'immediate',
      urgency: 'medium',
      rationale: 'Reduces passive ambient smog penetration into living quarters.',
    },
  ];
}
