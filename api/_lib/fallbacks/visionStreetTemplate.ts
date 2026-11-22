/**
 * VayuShield AI - Street & Ambient Smog Vision Fallback Template
 * Deterministic diagnostic template for outdoor inversion layer smog infiltration.
 */

import { calculateCorsiRosenthalSizing } from '../../../src/domain/impactEngine';
import type { VisionAuditResult } from './visionMaskFilterTemplates';

/**
 * Builds diagnostic template for street and ambient outdoor smog infiltration.
 * @param crSizing - Corsi-Rosenthal box sizing parameters
 * @returns Grounded exterior/window audit result
 */
export function buildStreetFallback(
  crSizing: ReturnType<typeof calculateCorsiRosenthalSizing>
): VisionAuditResult {
  return {
    scanCategory: 'outdoor_smog',
    confidenceScore: 0.9,
    roomType: 'Exterior Window / Road-Facing Balcony',
    overallVentilationRating: 'poor',
    estimatedIndoorPm25: 280,
    hazardsIdentified: [
      {
        hazard: 'Dense Ambient Winter Smog Infiltration',
        severity: 'critical',
        description: 'Heavy inversion layer particulate matter penetrating through window frame gaps.',
        estimatedPm25ContributionUg: 180,
      },
      {
        hazard: 'Vehicle Exhaust & Road Resuspension',
        severity: 'high',
        description: 'Close proximity to vehicular traffic elevates black carbon and coarse PM10.',
        estimatedPm25ContributionUg: 65,
      },
    ],
    zeroCostActions: [
      'Close road-facing windows and balcony doors completely between 6:00 AM and 10:00 AM',
      'Hang damp heavy fabric curtains over leaky window gaps to physically adsorb coarse particles',
      'Perform damp microfiber wet mopping daily instead of dry sweeping to prevent resuspension',
    ],
    diyFixes: [
      {
        title: 'Self-Adhesive Silicone Foam Weatherstripping',
        costTier: 'low',
        action: 'Apply silicone seal tape around perimeter gaps of windows and doors to cut drafts.',
        expectedPm25DropPct: 35,
      },
      {
        title: 'Double-Layer Damp Curtain Drape',
        costTier: 'free',
        action: 'Keep heavy fabric drapes closed during morning smog peaks to trap coarse dust particles.',
        expectedPm25DropPct: 20,
      },
      {
        title: 'Corsi-Rosenthal Box Active Room Scrubbing',
        costTier: 'medium',
        action: 'Run a 4-MERV 13 filter box fan continuously near window to intercept particulate.',
        expectedPm25DropPct: 80,
      },
    ],
    crBoxRecommended: true,
    crBoxSizing: crSizing,
    plantsRecommended: [
      {
        name: 'Areca Palm (Dypsis lutescens)',
        targetPollutant: 'Air Moisture & Coarse Dust Trap',
        careLevel: 'easy',
        airBenefit: 'Natural humidifier that traps floating coarse particles onto wide frond surfaces.',
      },
    ],
    summary: 'Heavy outdoor smog draft infiltration. Weatherstripping perimeter gaps and heavy curtains cut infiltration by >40%.',
    source: 'template_fallback',
  };
}
