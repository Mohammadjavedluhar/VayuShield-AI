import { z } from 'zod';

// Commute & fuel types
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

// 1. Intake schemas
export const IntakeRequestSchema = z.object({
  text: z.string().min(3).max(500),
  cityHint: z.string().optional(),
});

export const IntakeResponseSchema = z.object({
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
  explanation: z.string().default('Household profile extracted from input sentence.'),
});

// 2. Vision Audit schemas
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

// 3. Plan schemas
export const PlanRequestSchema = z.object({
  profile: HouseholdProfileSchema,
  airQuality: AirQualityDataSchema.optional(),
  interventions: InterventionsSchema.optional(),
});

// 4. Ask schemas
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
