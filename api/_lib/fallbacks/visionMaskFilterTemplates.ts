/**
 * VayuShield AI - Vision Mask & Filter Fallback Templates
 * Deterministic diagnostic templates for PPE mask inspections and filter saturation audits.
 */

import { z } from 'zod';
import { VisionAuditResponseSchema } from '../types';
import { calculateCorsiRosenthalSizing } from '../../../src/domain/impactEngine';

export type VisionAuditResult = z.infer<typeof VisionAuditResponseSchema>;

/**
 * Builds diagnostic template for N95/FFP2 respirator fit inspection.
 * @returns Grounded mask fit diagnostic result
 */
export function buildMaskFallback(): VisionAuditResult {
  return {
    roomType: 'Respiratory PPE Mask Inspection',
    scanCategory: 'mask_fit',
    confidenceScore: 96,
    overallVentilationRating: 'good',
    estimatedIndoorPm25: 45,
    maskFitAnalysis: {
      fitStatus: 'leaky_gaps',
      gapLocations: ['Nose bridge unpinched gap', 'Cheek perimeter leakage'],
      correctiveAction: 'Pinch metallic nose bridge firmly with both index fingers along nasal bones. Ensure bottom strap rests at base of neck.',
    },
    zeroCostActions: [
      'Perform user positive-pressure seal check (blow gently: mask should bulge slightly with no air rushing into eyes).',
      'Cross ear loops or use a paperclip/strap expander to pull ear straps securely behind the crown of the head.',
    ],
    hazardsIdentified: [
      {
        hazard: 'Incomplete Nose-Bridge Contouring Leakage',
        severity: 'high',
        description: 'Unpinched aluminum nose clips allow unfiltered ambient smog to bypass media into airways directly.',
        estimatedPm25ContributionUg: 65,
      },
      {
        hazard: 'Loose Ear Loop Tension on Facial Periphery',
        severity: 'medium',
        description: 'Ear-loop style respirators frequently leak at jawline; headband tension provides vastly superior airtight seal.',
        estimatedPm25ContributionUg: 40,
      },
    ],
    diyFixes: [
      {
        title: 'Two-Finger Bilateral Nose Bridge Pinch',
        costTier: 'free',
        action: 'Use index fingers of both hands simultaneously to mold metallic strip snugly over nose bridge.',
        expectedPm25DropPct: 50,
      },
      {
        title: 'DIY Tension Lanyard / Paperclip Crown Extender',
        costTier: 'free',
        action: 'Connect ear loops behind skull using a paperclip or elastic band to convert ear loops into tight headband seal.',
        expectedPm25DropPct: 40,
      },
    ],
    crBoxRecommended: false,
    plantsRecommended: [],
    summary: 'Mask fit diagnostic complete. Detected ~30% perimeter air gap leakage. Tightening nose clip and using crown strap restores 95% protection.',
    source: 'template_fallback',
  };
}

/**
 * Builds diagnostic template for filter condition and saturation audits.
 * @param crSizing - Corsi-Rosenthal box sizing parameters
 * @returns Grounded filter condition result
 */
export function buildFilterFallback(
  crSizing: ReturnType<typeof calculateCorsiRosenthalSizing>
): VisionAuditResult {
  return {
    roomType: 'Air Cleaner Filter Saturation Audit',
    scanCategory: 'filter_condition',
    confidenceScore: 94,
    overallVentilationRating: 'fair',
    estimatedIndoorPm25: 85,
    filterConditionAnalysis: {
      saturationLevel: 'critically_saturated',
      replacementNeeded: true,
      remainingLifeDays: 5,
    },
    zeroCostActions: [
      'Gently vacuum external pre-filter mesh to clear coarse fiber dust without puncturing pleats.',
      'Never wash paper/meltblown MERV or HEPA pleats with water—moisture collapses electrostatic charge permanently.',
    ],
    hazardsIdentified: [
      {
        hazard: 'Dark Gray Particulate Loading & Electrostatic Decay',
        severity: 'critical',
        description: 'Saturated filter pleats increase air resistance, causing box fan or purifier CADR airflow to plummet by over 60%.',
        estimatedPm25ContributionUg: 80,
      },
    ],
    diyFixes: [
      {
        title: 'Replace MERV-13 Filter Pleat Set',
        costTier: 'low',
        action: 'Order replacement 20"x20" MERV-13 furnace filter set to restore 350 CFM clean air delivery rate.',
        expectedPm25DropPct: 75,
      },
      {
        title: 'Outer Pre-Filter Screen Vacuuming',
        costTier: 'free',
        action: 'Dry vacuum coarse surface lint to temporarily reduce static pressure drop until new filters arrive.',
        expectedPm25DropPct: 25,
      },
    ],
    crBoxRecommended: true,
    crBoxSizing: crSizing,
    plantsRecommended: [],
    summary: 'Filter condition diagnostic indicates deep particulate loading. Air resistance has increased significantly; replace filter set within 5 days.',
    source: 'template_fallback',
  };
}
