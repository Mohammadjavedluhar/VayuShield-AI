/**
 * VayuShield AI - Living Room & Bedroom Vision Fallback Template
 * Deterministic diagnostic template for indoor living areas, dhoop/incense, and dust resuspension.
 */

import { calculateCorsiRosenthalSizing } from '../../../src/domain/impactEngine';
import type { VisionAuditResult } from './visionMaskFilterTemplates';

/**
 * Builds diagnostic template for standard indoor living rooms and bedrooms.
 * @param crSizing - Corsi-Rosenthal box sizing parameters
 * @returns Grounded living area air audit result
 */
export function buildRoomFallback(
  crSizing: ReturnType<typeof calculateCorsiRosenthalSizing>
): VisionAuditResult {
  return {
    scanCategory: 'room_indoor',
    confidenceScore: 0.88,
    roomType: 'Living Area / Bedroom',
    overallVentilationRating: 'fair',
    estimatedIndoorPm25: 145,
    hazardsIdentified: [
      {
        hazard: 'Incense, Dhoop, or Candle Burning',
        severity: 'high',
        description: 'Traditional incense sticks release fine particles, benzene, and PAHs into closed rooms.',
        estimatedPm25ContributionUg: 55,
      },
      {
        hazard: 'Window & Door Perimeter Draft Gaps',
        severity: 'medium',
        description: 'Unsealed perimeter seams allow cold winter smog to infiltrate continuously.',
        estimatedPm25ContributionUg: 45,
      },
      {
        hazard: 'Dry Dust Resuspension from Flooring',
        severity: 'medium',
        description: 'Dry sweeping launches settled PM10 and PM2.5 back into the human breathing zone.',
        estimatedPm25ContributionUg: 25,
      },
    ],
    zeroCostActions: [
      'Stop burning dhoop, agarbatti, or scented candles in unventilated indoor spaces',
      'Use rolled damp towels or door snakes along door bottom draft gaps during peak smog hours',
      'Wipe hard surfaces with damp microfiber cloth rather than dry dusting',
    ],
    diyFixes: [
      {
        title: 'Replace Incense with Essential Oil Diffuser or LED Diyas',
        costTier: 'free',
        action: 'Cease burning solid incense in closed rooms; replace with flameless options during smog season.',
        expectedPm25DropPct: 40,
      },
      {
        title: 'Microfiber Wet Mopping Protocol',
        costTier: 'free',
        action: 'Discontinue dry broom sweeping; use damp microfiber cloths daily to capture particulate.',
        expectedPm25DropPct: 25,
      },
      {
        title: 'Build a Corsi-Rosenthal Box Air Cleaner',
        costTier: 'low',
        action: 'Assemble 4 MERV-13 furnace filters with a 20-inch box fan for 350 CFM CADR at ~₹2,800 total cost.',
        expectedPm25DropPct: 85,
      },
    ],
    crBoxRecommended: true,
    crBoxSizing: crSizing,
    plantsRecommended: [
      {
        name: 'Snake Plant (Sansevieria trifasciata)',
        targetPollutant: 'Benzene, Formaldehyde, Fine Particulate Co-precipitate',
        careLevel: 'easy',
        airBenefit: 'Releases nocturnal oxygen; ideal for placing near bed headboards.',
      },
      {
        name: 'ZZ Plant (Zamioculcas zamiifolia)',
        targetPollutant: 'Toluene and Xylene',
        careLevel: 'easy',
        airBenefit: 'Thrives in low light conditions with minimal watering requirements.',
      },
    ],
    summary: 'Standard indoor living room with manageable infiltration. Eliminating solid incense and deploying a CR box drops PM2.5 by >80%.',
    source: 'template_fallback',
  };
}
