/**
 * VayuShield AI - Domain Types & Schemas
 * Core domain contracts for household intake, air quality, deterministic calculations, and vision audits.
 */

export type CommuteMode = 'car' | 'carpool' | 'twoWheeler' | 'metro' | 'bus' | 'walkOrCycle' | 'ev';
export type CookingFuel = 'lpg' | 'biomassChulha' | 'induction' | 'pipedGas';
export type HeatingSource = 'unventedHeater' | 'electricHeater' | 'firewood' | 'none';

export type AqiCategory =
  | 'good'
  | 'moderate'
  | 'unhealthySensitive'
  | 'unhealthy'
  | 'veryUnhealthy'
  | 'hazardous'
  | 'severe';

export interface HouseholdProfile {
  householdSize: number;
  city: string;
  hasAsthma: boolean;
  hasCopdOrCardiac: boolean;
  hasChildren: boolean;
  hasElderly: boolean;
  isPregnant: boolean;
  commuteMode: CommuteMode;
  commuteDistanceKm: number;
  cookingFuel: CookingFuel;
  heatingSource: HeatingSource;
  hasAirPurifier: boolean;
  wearsMaskOutdoors: boolean;
  rawInput?: string;
  vulnerabilityScore: number; // 0 - 100
  vulnerabilityLevel: 'low' | 'moderate' | 'high' | 'critical';
}

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

export interface Interventions {
  useN95Mask: boolean;
  useAirPurifier: boolean; // HEPA or Corsi-Rosenthal
  commuteMode: 'car' | 'carpool' | 'metro' | 'ev' | 'walkOrCycle';
  cookingFuel: 'lpg' | 'induction';
  roomSealImprovement: boolean;
  wetMoppingDaily: boolean;
}

export interface ImpactLedgerMetrics {
  baselineInhaledPm25DoseUgPerDay: number;
  protectedInhaledPm25DoseUgPerDay: number;
  inhaledPm25ReductionPct: number;
  baselineCigarettesPerDay: number;
  avoidedCigarettesPerDay: number;
  avoidedCigarettesPerWeek: number;
  co2SavedKgPerWeek: number;
  cleanAirHoursGainedPerDay: number;
  riskReductionScore: number; // 0 - 100
}

export interface CorsiRosenthalSizing {
  roomAreaSqFt: number;
  ceilingHeightFt: number;
  roomVolumeCuFt: number;
  targetAch: number;
  requiredCadrCfm: number;
  recommendedUnits: number;
  timeTo90PctClearanceMinutes: number;
  diyCostEstimateInr: number;
  commercialHepaCostInr: number;
  savingsPct: number;
}

export interface VisionHazard {
  hazard: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedPm25ContributionUg: number;
}

export interface VisionDiyFix {
  title: string;
  costTier: 'free' | 'low' | 'medium';
  action: string;
  expectedPm25DropPct: number;
}

export interface VisionPlant {
  name: string;
  scientificName?: string;
  targetPollutant: string;
  careLevel: 'easy' | 'moderate';
  airBenefit: string;
}

export interface MaskFitAnalysis {
  fitStatus: 'tight_certified' | 'leaky_gaps' | 'improper_mask_type';
  gapLocations: string[];
  correctiveAction: string;
}

export interface FilterConditionAnalysis {
  saturationLevel: 'clean_new' | 'moderately_loaded' | 'critically_saturated';
  replacementNeeded: boolean;
  remainingLifeDays: number;
}

export interface VisionAuditResult {
  roomType: string;
  overallVentilationRating: 'poor' | 'fair' | 'good';
  estimatedIndoorPm25: number;
  hazardsIdentified: VisionHazard[];
  diyFixes: VisionDiyFix[];
  crBoxRecommended: boolean;
  crBoxSizing?: CorsiRosenthalSizing;
  plantsRecommended: VisionPlant[];
  summary: string;
  source: 'ai' | 'template_fallback';
  scanCategory?: 'room_indoor' | 'mask_fit' | 'filter_condition' | 'outdoor_smog';
  confidenceScore?: number;
  maskFitAnalysis?: MaskFitAnalysis;
  filterConditionAnalysis?: FilterConditionAnalysis;
  zeroCostActions?: string[];
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

export interface PersonalizedPlan {
  householdProfile: HouseholdProfile;
  airQuality: AirQualityData;
  impactMetrics: ImpactLedgerMetrics;
  windows: CleanHourWindow[];
  actionChecklist: Array<{
    id: string;
    task: string;
    category: 'immediate' | 'daily' | 'equipment';
    urgency: 'high' | 'medium' | 'low';
    rationale: string;
  }>;
  aiExplanation: string;
  certifiedNumbersOnly: boolean;
}
