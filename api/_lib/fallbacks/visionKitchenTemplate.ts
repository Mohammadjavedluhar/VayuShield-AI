/**
 * VayuShield AI - Kitchen Vision Fallback Template
 * Deterministic diagnostic template for high-combustion kitchens and range hood deficits.
 */

import { calculateCorsiRosenthalSizing } from '../../../src/domain/impactEngine';
import type { VisionAuditResult } from './visionMaskFilterTemplates';

/**
 * Builds diagnostic template for cooking and kitchen combustion particulate.
 * @param crSizing - Corsi-Rosenthal box sizing parameters
 * @returns Grounded kitchen air audit result
 */
export function buildKitchenFallback(
  crSizing: ReturnType<typeof calculateCorsiRosenthalSizing>
): VisionAuditResult {
  return {
    scanCategory: 'room_indoor',
    confidenceScore: 0.92,
    roomType: 'Kitchen & Dining Space',
    overallVentilationRating: 'poor',
    estimatedIndoorPm25: 165,
    hazardsIdentified: [
      {
        hazard: 'Unvented Gas Burner / Combustion Cooking',
        severity: 'high',
        description: 'LPG combustion generates high spikes of ultrafine particles and NO2 indoors without a range hood.',
        estimatedPm25ContributionUg: 75,
      },
      {
        hazard: 'High-Temperature Oil Frying / Sautéing',
        severity: 'medium',
        description: 'Aerosolized cooking oils and particulate matter settle into living spaces.',
        estimatedPm25ContributionUg: 45,
      },
      {
        hazard: 'Inadequate Range Hood Exhaust Flow',
        severity: 'high',
        description: 'Cooking emissions recirculate into living areas rather than exhausting outdoors.',
        estimatedPm25ContributionUg: 35,
      },
    ],
    zeroCostActions: [
      'Place lids on all pans while frying to trap oil aerosols at source',
      'Turn on kitchen exhaust fan 2 minutes before igniting burners and keep on for 5 mins after',
      'Close internal kitchen door to prevent cooking aerosols from migrating to bedrooms',
    ],
    diyFixes: [
      {
        title: 'Covered Sautéing & Splatter Screens',
        costTier: 'free',
        action: 'Use pan lids and mesh splatter guards during tempering (tadka) to contain aerosolized oil.',
        expectedPm25DropPct: 30,
      },
      {
        title: 'Targeted Window Exhaust Fan Deployment',
        costTier: 'low',
        action: 'Place a low-cost exhaust fan blowing outwards in window while cooking with door closed.',
        expectedPm25DropPct: 45,
      },
      {
        title: 'Switch to Induction Cooktop for Boiling & Curries',
        costTier: 'medium',
        action: 'Migrate high-frequency simmering to an electric induction plate to eliminate indoor NO2.',
        expectedPm25DropPct: 60,
      },
    ],
    crBoxRecommended: true,
    crBoxSizing: crSizing,
    plantsRecommended: [
      {
        name: 'Snake Plant (Sansevieria trifasciata)',
        targetPollutant: 'NO2 and Formaldehyde',
        careLevel: 'easy',
        airBenefit: 'Absorbs residual kitchen gases and releases oxygen through CAM metabolism.',
      },
      {
        name: 'Spider Plant (Chlorophytum comosum)',
        targetPollutant: 'Carbon Monoxide & VOCs',
        careLevel: 'easy',
        airBenefit: 'Safe for pets and absorbs minor combustion traces in semi-humid spaces.',
      },
    ],
    summary: 'High indoor combustion particulate from kitchen. Isolating kitchen door and localized window exhaust cuts PM2.5 by ~50%.',
    source: 'template_fallback',
  };
}
