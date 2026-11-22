import { AqiCategory, HourlyForecastItem } from '../../domain/types';

export function getAqiCategoryMeta(aqi: number): { category: AqiCategory; categoryLabel: string } {
  if (aqi > 300) return { category: 'hazardous', categoryLabel: 'Hazardous' };
  if (aqi > 200) return { category: 'veryUnhealthy', categoryLabel: 'Very Unhealthy' };
  if (aqi > 150) return { category: 'unhealthy', categoryLabel: 'Unhealthy' };
  if (aqi > 100) return { category: 'unhealthySensitive', categoryLabel: 'Unhealthy for Sensitive Groups' };
  return { category: 'moderate', categoryLabel: 'Moderate' };
}

export function buildSyntheticPresetForecast(aqi: number, pm25: number): HourlyForecastItem[] {
  return [
    {
      time: '06:00',
      hour: 6,
      aqi: Math.round(aqi * 1.15),
      pm25: Math.round(pm25 * 1.15),
      pm10: Math.round(pm25 * 1.8),
      no2: 60,
      aqiCategory: 'hazardous',
      isExerciseSafe: false,
      isCommuteWarning: true,
      isVentilationSafe: false,
      recommendation: 'Severe morning thermal inversion. Keep windows sealed.',
    },
    {
      time: '08:00',
      hour: 8,
      aqi,
      pm25,
      pm10: Math.round(pm25 * 1.6),
      no2: 55,
      aqiCategory: 'hazardous',
      isExerciseSafe: false,
      isCommuteWarning: true,
      isVentilationSafe: false,
      recommendation: 'Peak school-run smog. Certified N95 mandatory.',
    },
    {
      time: '12:00',
      hour: 12,
      aqi: Math.round(aqi * 0.7),
      pm25: Math.round(pm25 * 0.7),
      pm10: Math.round(pm25 * 1.2),
      no2: 40,
      aqiCategory: 'veryUnhealthy',
      isExerciseSafe: false,
      isCommuteWarning: false,
      isVentilationSafe: true,
      recommendation: 'Solar boundary layer mixed. Safest 30-min window for HEPA-filtered air flush.',
    },
    {
      time: '16:00',
      hour: 16,
      aqi: Math.round(aqi * 0.65),
      pm25: Math.round(pm25 * 0.65),
      pm10: Math.round(pm25 * 1.1),
      no2: 38,
      aqiCategory: 'unhealthy',
      isExerciseSafe: false,
      isCommuteWarning: false,
      isVentilationSafe: true,
      recommendation: 'Late afternoon dispersion before sunset temperature inversion.',
    },
    {
      time: '20:00',
      hour: 20,
      aqi: Math.round(aqi * 0.95),
      pm25: Math.round(pm25 * 0.95),
      pm10: Math.round(pm25 * 1.5),
      no2: 52,
      aqiCategory: 'hazardous',
      isExerciseSafe: false,
      isCommuteWarning: true,
      isVentilationSafe: false,
      recommendation: 'Nocturnal boundary layer descending. Turn on Corsi-Rosenthal / HEPA filtration.',
    },
  ];
}
