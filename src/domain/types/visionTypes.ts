/**
 * VayuShield AI - Vision Audit & Sizing Types
 * Contracts for multimodal image inspection and Corsi-Rosenthal box sizing.
 */

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
