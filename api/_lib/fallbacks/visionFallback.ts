/**
 * VayuShield AI - Fallback Vision Hazard Auditor Selector
 * Selects deterministic image analysis templates based on recognized room/context hints.
 */

import { calculateCorsiRosenthalSizing } from '../../../src/domain/impactEngine';
import { buildMaskFallback, buildFilterFallback, type VisionAuditResult } from './visionMaskFilterTemplates';
import { buildKitchenFallback } from './visionKitchenTemplate';
import { buildStreetFallback } from './visionStreetTemplate';
import { buildRoomFallback } from './visionLivingTemplates';

export type { VisionAuditResult };

/**
 * Generates deterministic fallback vision audit based on contextual keyword recognition.
 * @param roomContext - Optional room context description string
 * @returns Grounded vision audit result payload
 */
export function fallbackVisionAudit(roomContext?: string): VisionAuditResult {
  const context = (roomContext || 'living room / bedroom').toLowerCase();
  const crSizing = calculateCorsiRosenthalSizing(220, 9, 5);

  if (context.includes('mask') || context.includes('respirator') || context.includes('n95') || context.includes('fit')) {
    return buildMaskFallback();
  }
  if (context.includes('filter') || context.includes('hepa') || context.includes('dusty') || context.includes('replacement')) {
    return buildFilterFallback(crSizing);
  }
  if (context.includes('kitchen') || context.includes('cook')) {
    return buildKitchenFallback(crSizing);
  }
  if (context.includes('street') || context.includes('window') || context.includes('outside')) {
    return buildStreetFallback(crSizing);
  }

  return buildRoomFallback(crSizing);
}
