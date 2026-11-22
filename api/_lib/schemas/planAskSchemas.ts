/**
 * VayuShield AI - Plan, Ask & Profile Schemas
 * Zod validation schemas for /api/plan, /api/ask, and HouseholdProfile.
 */

import { z } from 'zod';
import { CommuteModeSchema, CookingFuelSchema, HeatingSourceSchema } from './enums';

export const HouseholdProfileSchema = z.object({
  householdSize: z.number().int().min(1).max(20).default(4),
  city: z.string().default('Delhi'),
  hasAsthma: z.boolean().default(false),
  hasCopdOrCardiac: z.boolean().default(false),
  hasChildren: z.boolean().default(false),
  hasElderly: z.boolean().default(false),
  isPregnant: z.boolean().default(false),
  commuteMode: CommuteModeSchema.default('car'),
  commuteDistanceKm: z.number().min(0).max(100).default(10),
  cookingFuel: CookingFuelSchema.default('lpg'),
  heatingSource: HeatingSourceSchema.default('none'),
  hasAirPurifier: z.boolean().default(false),
  wearsMaskOutdoors: z.boolean().default(false),
  rawInput: z.string().optional(),
  vulnerabilityScore: z.number().default(50),
  vulnerabilityLevel: z.enum(['low', 'moderate', 'high', 'critical']).default('moderate'),
  riskFactors: z.array(z.string()).default([]),
  explanation: z.string().optional(),
});

export const InterventionCommuteModeSchema = z.enum([
  'car',
  'carpool',
  'metro',
  'ev',
  'walkOrCycle',
]);

export const InterventionCookingFuelSchema = z.enum([
  'lpg',
  'induction',
]);

export const InterventionsSchema = z.object({
  useN95Mask: z.boolean().default(true),
  useAirPurifier: z.boolean().default(true),
  commuteMode: InterventionCommuteModeSchema.default('metro'),
  cookingFuel: InterventionCookingFuelSchema.default('induction'),
  roomSealImprovement: z.boolean().default(true),
  wetMoppingDaily: z.boolean().default(true),
});

export const HourlyForecastItemSchema = z.object({
  time: z.string(),
  hour: z.number(),
  pm25: z.number(),
  pm10: z.number().optional(),
  no2: z.number().optional(),
  aqi: z.number(),
  aqiCategory: z.string().optional(),
  isExerciseSafe: z.boolean().optional(),
  isCommuteWarning: z.boolean().optional(),
  isVentilationSafe: z.boolean().optional(),
  recommendation: z.string().optional(),
});

export const AirQualityDataSchema = z.object({
  currentAqi: z.number().default(280),
  pm25: z.number().default(150),
  pm10: z.number().optional(),
  no2: z.number().optional(),
  so2: z.number().optional(),
  co: z.number().optional(),
  o3: z.number().optional(),
  city: z.string().default('Delhi'),
  dominantPollutant: z.string().default('pm25'),
  hourlyForecast: z.array(HourlyForecastItemSchema).default([]),
  timestamp: z.string().optional(),
  source: z.string().optional(),
});

export const PlanRequestSchema = z.object({
  profile: HouseholdProfileSchema,
  airQuality: AirQualityDataSchema.optional(),
  interventions: InterventionsSchema.optional(),
});

export const AskRequestSchema = z.object({
  question: z.string().min(2).max(500),
  context: z
    .object({
      city: z.string().optional(),
      aqi: z.number().optional(),
      pm25: z.number().optional(),
      profile: HouseholdProfileSchema.optional(),
      ledger: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
});
