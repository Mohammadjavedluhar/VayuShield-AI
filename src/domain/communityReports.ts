/**
 * VayuShield AI - Community Smog & Neighborhood Incident Layer
 * Enables citizen reporting of hyperlocal pollution hotspots.
 */

import {
  PRESEEDED_COMMUNITY_REPORTS,
  type CommunityReport,
} from './community/preseededReports';
import { sanitizeReportItem } from './community/sanitizer';

export * from './community/preseededReports';
export * from './community/sanitizer';

export const LOCAL_STORAGE_KEY = 'vayushield_community_reports';

/**
 * Retrieves persisted community reports from local storage with preseeded fallback.
 * @returns Array of sanitized community reports
 */
export function getStoredReports(): CommunityReport[] {
  if (typeof window === 'undefined' || !window.localStorage) return PRESEEDED_COMMUNITY_REPORTS;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(PRESEEDED_COMMUNITY_REPORTS));
      return PRESEEDED_COMMUNITY_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return PRESEEDED_COMMUNITY_REPORTS;
    const sanitized = parsed.map((item) => sanitizeReportItem(item));
    return sanitized.length > 0 ? sanitized : PRESEEDED_COMMUNITY_REPORTS;
  } catch {
    return PRESEEDED_COMMUNITY_REPORTS;
  }
}

/**
 * Saves community reports safely to browser localStorage with length bounds.
 * @param reports - List of community reports to persist
 */
export function saveStoredReports(reports: CommunityReport[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (!Array.isArray(reports)) return;
    const sanitized: CommunityReport[] = reports.slice(0, 50).map((r) => sanitizeReportItem(r));
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('Failed to save community reports:', err);
  }
}

/**
 * Calculates collective society impact when multiple families adopt clean air pledges.
 * @param participatingFamiliesCount - Count of participating households
 * @returns Aggregated environmental and public health savings
 */
export function calculateCollectiveSocietyImpact(participatingFamiliesCount: number): {
  participatingFamilies: number;
  weeklyAvoidedPm25Kg: number;
  weeklySavedCo2Kg: number;
  weeklyAvoidedCigarettes: number;
  annualCommunityHealthSavingsInr: number;
} {
  const families = Math.max(1, participatingFamiliesCount);
  const weeklyAvoidedPm25Kg = Number((families * 1.4).toFixed(1));
  const weeklySavedCo2Kg = Number((families * 18.5).toFixed(1));
  const weeklyAvoidedCigarettes = Math.round(families * 32);
  const annualCommunityHealthSavingsInr = families * 2400 * 12;

  return {
    participatingFamilies: families,
    weeklyAvoidedPm25Kg,
    weeklySavedCo2Kg,
    weeklyAvoidedCigarettes,
    annualCommunityHealthSavingsInr,
  };
}
