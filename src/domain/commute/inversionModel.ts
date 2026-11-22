/**
 * VayuShield AI - Thermal Inversion & Departure Helpers
 * Computes diurnal boundary layer inversion and departure optimization.
 */

import type { TravelMode } from './constants';

export function getInversionFactor(timeStr: string): { factor: number; riskLevel: 'critical' | 'high' | 'moderate' | 'low' } {
  const parts = timeStr.split(':');
  const hour = Number.parseInt(parts[0], 10) || 7;
  const minute = Number.parseInt(parts[1], 10) || 0;
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes < 465) {
    return { factor: 1.35, riskLevel: 'critical' };
  }
  if (totalMinutes < 510) {
    return { factor: 1.20, riskLevel: 'high' };
  }
  if (totalMinutes < 555) {
    return { factor: 0.95, riskLevel: 'moderate' };
  }
  return { factor: 0.75, riskLevel: 'low' };
}

export function determineMaskVerdict(effectiveAmbientPm25: number): {
  maskVerdict: string;
  maskRecommendation: string;
} {
  if (effectiveAmbientPm25 <= 50) {
    return {
      maskVerdict: 'Low Risk / Optional',
      maskRecommendation: 'Air is within acceptable ranges. Sensitive individuals may wear a mask.',
    };
  }
  if (effectiveAmbientPm25 <= 100) {
    return {
      maskVerdict: 'Surgical / KN95 Advisory',
      maskRecommendation: 'Sensitive individuals should wear certified KN95 or surgical mask.',
    };
  }
  if (effectiveAmbientPm25 <= 200) {
    return {
      maskVerdict: 'KN95 / N95 Recommended',
      maskRecommendation: 'KN95 or N95 strongly advised. Avoid cloth masks.',
    };
  }
  return {
    maskVerdict: 'N95 Mandatory',
    maskRecommendation: 'Extreme particulate hazard. Headband-style N95 mandatory with 0% gap leakage.',
  };
}

export function computeSuggestedDeparture(departureTime: string, delayMinutes: number = 45): string {
  const parts = departureTime.split(':');
  const currentH = Number.parseInt(parts[0], 10) || 7;
  const currentM = Number.parseInt(parts[1], 10) || 0;
  const delayedTotalMinutes = currentH * 60 + currentM + delayMinutes;
  const delayedH = Math.floor(delayedTotalMinutes / 60);
  const delayedM = delayedTotalMinutes % 60;
  return `${delayedH.toString().padStart(2, '0')}:${delayedM.toString().padStart(2, '0')}`;
}

export function getRouteModeAdvice(travelMode: TravelMode): string {
  if (travelMode === 'open_walk_cycle' || travelMode === 'two_wheeler') {
    return 'Open transit exposes lungs to direct diesel exhaust plumes. Switch to closed public metro or carpool with recirculate mode ON.';
  }
  if (travelMode === 'closed_car') {
    return 'Set car air-conditioning to internal RECIRCULATE mode; cuts cabin particulate infiltration by ~60%.';
  }
  return 'Public transit enclosed cabins offer partial buffering; ensure N95 is worn during boarding and platform wait.';
}
