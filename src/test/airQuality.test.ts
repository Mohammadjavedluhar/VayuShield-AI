import { describe, expect, it } from 'vitest';
import {
  calculatePm25Aqi,
  calculatePollutantAqi,
  getAqiColorTheme,
  getCompositeAqi,
  getHealthAdvisory,
  PM10_BREAKPOINTS,
  PM25_BREAKPOINTS,
} from '../domain/airQuality';

describe('US EPA Air Quality Calculations - airQuality.ts', () => {
  it('correctly maps PM2.5 concentrations to standard EPA AQI brackets', () => {
    expect(PM25_BREAKPOINTS.length).toBeGreaterThan(0);
    expect(PM10_BREAKPOINTS.length).toBeGreaterThan(0);
    const directCalc = calculatePollutantAqi(5, PM25_BREAKPOINTS);
    expect(directCalc.aqi).toBe(28);

    // Good (0 - 9 ug/m3 -> 0 - 50)
    expect(calculatePm25Aqi(5).aqi).toBe(28);
    expect(calculatePm25Aqi(5).category).toBe('good');

    // Moderate (9.1 - 35.4 ug/m3 -> 51 - 100)
    expect(calculatePm25Aqi(20).category).toBe('moderate');

    // Unhealthy for Sensitive Groups (35.5 - 55.4 ug/m3 -> 101 - 150)
    expect(calculatePm25Aqi(45).category).toBe('unhealthySensitive');

    // Unhealthy (55.5 - 125.4 ug/m3 -> 151 - 200)
    expect(calculatePm25Aqi(90).category).toBe('unhealthy');

    // Very Unhealthy (125.5 - 225.4 ug/m3 -> 201 - 300)
    expect(calculatePm25Aqi(160).category).toBe('veryUnhealthy');

    // Hazardous (225.5 - 325.4 ug/m3 -> 301 - 400)
    expect(calculatePm25Aqi(280).category).toBe('hazardous');
  });

  it('extrapolates beyond upper bracket during extreme winter inversion crises', () => {
    const extreme = calculatePm25Aqi(600);
    expect(extreme.aqi).toBeGreaterThanOrEqual(500);
    expect(extreme.category).toBe('severe');
    expect(extreme.label).toContain('Hazardous+');
  });

  it('handles negative or zero concentrations safely', () => {
    const zero = calculatePm25Aqi(0);
    expect(zero.aqi).toBe(0);
    expect(zero.category).toBe('good');

    const negative = calculatePm25Aqi(-15);
    expect(negative.aqi).toBe(0);
    expect(negative.category).toBe('good');
  });

  it('determines dominant pollutant in composite AQI', () => {
    // PM2.5 dominant
    const resPm25 = getCompositeAqi(180, 50, 40);
    expect(resPm25.dominantPollutant).toBe('PM2.5');
    expect(resPm25.category).toBe('veryUnhealthy');

    // PM10 dominant
    const resPm10 = getCompositeAqi(10, 400, 20);
    expect(resPm10.dominantPollutant).toBe('PM10');
    expect(resPm10.category).toBe('veryUnhealthy');

    // NO2 dominant
    const resNo2 = getCompositeAqi(5, 20, 800);
    expect(resNo2.dominantPollutant).toBe('NO2');
  });

  it('provides specific clinical health advisories for all categories', () => {
    expect(getHealthAdvisory('good')).toContain('safe for all individuals');
    expect(getHealthAdvisory('moderate')).toContain('Unusually sensitive');
    expect(getHealthAdvisory('unhealthySensitive')).toContain('Wear N95 outside');
    expect(getHealthAdvisory('unhealthy')).toContain('Active children and adults');
    expect(getHealthAdvisory('veryUnhealthy')).toContain('run indoor filtration');
    expect(getHealthAdvisory('hazardous')).toContain('Keep windows closed');
    expect(getHealthAdvisory('severe')).toContain('Severe public health crisis');
  });

  it('returns valid color tokens for all AQI tiers', () => {
    expect(getAqiColorTheme('good').badgeText).toBe('text-emerald-400');
    expect(getAqiColorTheme('moderate').badgeText).toBe('text-amber-400');
    expect(getAqiColorTheme('unhealthySensitive').badgeText).toBe('text-orange-400');
    expect(getAqiColorTheme('unhealthy').badgeText).toBe('text-rose-400');
    expect(getAqiColorTheme('veryUnhealthy').badgeText).toBe('text-purple-400');
    expect(getAqiColorTheme('hazardous').badgeText).toBe('text-red-400');
    expect(getAqiColorTheme('severe').badgeText).toBe('text-red-400');
  });
});
