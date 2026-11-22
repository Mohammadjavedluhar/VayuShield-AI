/**
 * VayuShield AI - Enumeration Schemas
 * Zod schemas for shared domain categorical enums.
 */

import { z } from 'zod';

export const CommuteModeSchema = z.enum([
  'car',
  'carpool',
  'twoWheeler',
  'metro',
  'bus',
  'walkOrCycle',
  'ev',
]);

export const CookingFuelSchema = z.enum([
  'lpg',
  'biomassChulha',
  'induction',
  'pipedGas',
]);

export const HeatingSourceSchema = z.enum([
  'unventedHeater',
  'electricHeater',
  'firewood',
  'none',
]);

export const AqiCategorySchema = z.enum([
  'good',
  'moderate',
  'unhealthySensitive',
  'unhealthy',
  'veryUnhealthy',
  'hazardous',
  'severe',
]);

export const BaseHouseholdProfileFields = {
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
};
