/**
 * VayuShield AI - Domain Types & Schemas
 * Core domain contracts for household intake, air quality, deterministic calculations, and vision audits.
 */

import type { AqiCategory, HouseholdProfile, ImpactLedgerMetrics } from './types/profileTypes';

export * from './types/profileTypes';
export * from './types/visionTypes';

export interface HourlyForecastItem {
  time: string;
  hour: number;
  pm25: number;
  pm10: number;
  no2: number;
  aqi: number;
  aqiCategory: AqiCategory;
  isExerciseSafe: boolean;
  isCommuteWarning: boolean;
  isVentilationSafe: boolean;
  recommendation: string;
}

export interface AirQualityData {
  city: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  currentAqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3?: number;
  so2?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  category: AqiCategory;
  categoryLabel: string;
  dominantPollutant: string;
  healthAdvisory: string;
  hourlyForecast: HourlyForecastItem[];
}

export interface CleanHourWindow {
  type: 'exercise' | 'commute' | 'ventilation' | 'sleep';
  title: string;
  startHour: number;
  endHour: number;
  avgAqi: number;
  status: 'safe' | 'caution' | 'danger';
  advice: string;
}

export interface ActionItem {
  id: string;
  task: string;
  category: 'immediate' | 'daily' | 'equipment';
  urgency: 'high' | 'medium' | 'low';
  rationale: string;
}

export interface PersonalizedPlan {
  householdProfile: HouseholdProfile;
  airQuality: AirQualityData;
  impactMetrics: ImpactLedgerMetrics;
  windows: CleanHourWindow[];
  actionChecklist: ActionItem[];
  aiExplanation: string;
  certifiedNumbersOnly: boolean;
}

