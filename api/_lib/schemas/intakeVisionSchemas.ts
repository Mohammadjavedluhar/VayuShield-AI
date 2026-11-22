/**
 * VayuShield AI - Intake & Vision Schemas
 * Zod validation schemas for /api/intake and /api/vision-audit.
 */

import { z } from 'zod';
import { BaseHouseholdProfileFields } from './enums';

export const IntakeRequestSchema = z.object({
  text: z.string().min(3).max(500),
  cityHint: z.string().optional(),
});

export const IntakeResponseSchema = z.object({
  ...BaseHouseholdProfileFields,
  explanation: z.string().default('Household profile extracted from input sentence.'),
});

export const VisionRequestSchema = z.object({
  imageBase64: z.string().min(10),
  mimeType: z.string().default('image/jpeg'),
  roomContext: z.string().optional(),
});

export const VisionHazardSchema = z.object({
  hazard: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  estimatedPm25ContributionUg: z.number().min(0),
});

export const VisionDiyFixSchema = z.object({
  title: z.string(),
  costTier: z.enum(['free', 'low', 'medium']),
  action: z.string(),
  expectedPm25DropPct: z.number().min(0).max(100),
});

export const VisionPlantSchema = z.object({
  name: z.string(),
  scientificName: z.string().optional(),
  targetPollutant: z.string(),
  careLevel: z.enum(['easy', 'moderate']),
  airBenefit: z.string(),
});

export const CorsiRosenthalSizingSchema = z.object({
  roomAreaSqFt: z.number(),
  ceilingHeightFt: z.number(),
  roomVolumeCuFt: z.number(),
  targetAch: z.number(),
  requiredCadrCfm: z.number(),
  recommendedUnits: z.number(),
  timeTo90PctClearanceMinutes: z.number(),
  diyCostEstimateInr: z.number(),
  commercialHepaCostInr: z.number(),
  savingsPct: z.number(),
});

export const MaskFitAnalysisSchema = z.object({
  fitStatus: z.enum(['tight_certified', 'leaky_gaps', 'improper_mask_type']),
  gapLocations: z.array(z.string()),
  correctiveAction: z.string(),
});

export const FilterConditionAnalysisSchema = z.object({
  saturationLevel: z.enum(['clean_new', 'moderately_loaded', 'critically_saturated']),
  replacementNeeded: z.boolean(),
  remainingLifeDays: z.number(),
});

export const VisionAuditResponseSchema = z.object({
  roomType: z.string(),
  overallVentilationRating: z.enum(['poor', 'fair', 'good']),
  estimatedIndoorPm25: z.number(),
  hazardsIdentified: z.array(VisionHazardSchema),
  diyFixes: z.array(VisionDiyFixSchema),
  crBoxRecommended: z.boolean(),
  crBoxSizing: CorsiRosenthalSizingSchema.optional(),
  plantsRecommended: z.array(VisionPlantSchema),
  summary: z.string(),
  source: z.enum(['ai', 'template_fallback']).default('template_fallback'),
  scanCategory: z.enum(['room_indoor', 'mask_fit', 'filter_condition', 'outdoor_smog']).default('room_indoor'),
  confidenceScore: z.number().min(0).max(100).default(94),
  maskFitAnalysis: MaskFitAnalysisSchema.optional(),
  filterConditionAnalysis: FilterConditionAnalysisSchema.optional(),
  zeroCostActions: z.array(z.string()).default([]),
});
