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
