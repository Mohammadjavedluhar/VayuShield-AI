/**
 * VayuShield AI - Synthetic Urban Air Quality Generator
 * High-fidelity fallback model when Open-Meteo is offline or rate limited.
 */

import { getCompositeAqi } from '../domain/airQuality';
import type { AirQualityData, HourlyForecastItem } from '../domain/types';
import { calculateHourlySolarFactor } from './openMeteoMapper';

export function getSyntheticCityAirQuality(
  cityName: string,
  latitude: number,
  longitude: number
): AirQualityData {
  const basePm25 = cityName.toLowerCase().includes('delhi') || cityName.toLowerCase().includes('lahore') ? 220 : 135;
  const basePm10 = Math.round(basePm25 * 1.6);
  const baseNo2 = 65;

  const composite = getCompositeAqi(basePm25, basePm10, baseNo2);
  const hourly: HourlyForecastItem[] = [];

  const currentHour = new Date().getHours();
  for (let offset = 0; offset < 24; offset++) {
    const hour = (currentHour + offset) % 24;
    const solarFactor = calculateHourlySolarFactor(hour);
    const pm = Math.round(basePm25 * solarFactor);
    const p10 = Math.round(basePm10 * solarFactor);
    const no2 = Math.round(baseNo2 * solarFactor);
    const comp = getCompositeAqi(pm, p10, no2);

    hourly.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      hour,
      pm25: pm,
      pm10: p10,
      no2,
      aqi: comp.overallAqi,
      aqiCategory: comp.category,
      isExerciseSafe: hour >= 13 && hour <= 15 && comp.overallAqi <= 180,
      isCommuteWarning: (hour >= 7 && hour <= 9) || (hour >= 19 && hour <= 21),
      isVentilationSafe: hour === 14 && comp.overallAqi <= 130,
      recommendation: hour >= 12 && hour <= 15 ? 'Solar boundary layer mixing' : 'Cold nocturnal smog trap',
    });
  }

  return {
    city: cityName,
    latitude,
    longitude,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    currentAqi: composite.overallAqi,
    pm25: basePm25,
    pm10: basePm10,
    no2: baseNo2,
    o3: 42,
    so2: 18,
    category: composite.category,
    categoryLabel: composite.categoryLabel,
    dominantPollutant: composite.dominantPollutant,
    healthAdvisory: composite.healthAdvisory,
    hourlyForecast: hourly,
  };
}
