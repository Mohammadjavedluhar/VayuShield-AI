/**
 * VayuShield AI - Air Quality Breakpoints
 * US EPA 2024 revised breakpoints for PM2.5 and PM10 concentrations.
 */

import type { AqiCategory } from '../types';

export interface AqiBreakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
  category: AqiCategory;
  label: string;
}

export const PM25_BREAKPOINTS: AqiBreakpoint[] = [
  { cLow: 0.0, cHigh: 9.0, iLow: 0, iHigh: 50, category: 'good', label: 'Good' },
  { cLow: 9.1, cHigh: 35.4, iLow: 51, iHigh: 100, category: 'moderate', label: 'Moderate' },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150, category: 'unhealthySensitive', label: 'Unhealthy for Sensitive Groups' },
  { cLow: 55.5, cHigh: 125.4, iLow: 151, iHigh: 200, category: 'unhealthy', label: 'Unhealthy' },
  { cLow: 125.5, cHigh: 225.4, iLow: 201, iHigh: 300, category: 'veryUnhealthy', label: 'Very Unhealthy' },
  { cLow: 225.5, cHigh: 325.4, iLow: 301, iHigh: 400, category: 'hazardous', label: 'Hazardous' },
  { cLow: 325.5, cHigh: 500.4, iLow: 401, iHigh: 500, category: 'hazardous', label: 'Hazardous' },
];

export const PM10_BREAKPOINTS: AqiBreakpoint[] = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50, category: 'good', label: 'Good' },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100, category: 'moderate', label: 'Moderate' },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150, category: 'unhealthySensitive', label: 'Unhealthy for Sensitive Groups' },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200, category: 'unhealthy', label: 'Unhealthy' },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300, category: 'veryUnhealthy', label: 'Very Unhealthy' },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500, category: 'hazardous', label: 'Hazardous' },
];
