import { describe, expect, it, beforeEach } from 'vitest';
import {
  calculateCollectiveSocietyImpact,
  getStoredReports,
  PRESEEDED_COMMUNITY_REPORTS,
  saveStoredReports,
  type CommunityReport,
} from '../domain/communityReports';

describe('Community Reports & Collective Society Impact - communityReports.ts', () => {
  beforeEach(() => {
    // Setup mock localStorage in Node/Vitest
    const storage: Record<string, string> = {};
    (globalThis as unknown as { window?: unknown }).window = {
      localStorage: {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, val: string) => {
          storage[key] = val;
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
      },
    };
  });

  it('calculates collective society impact scaling proportionally with participating families', () => {
    const single = calculateCollectiveSocietyImpact(1);
    expect(single.participatingFamilies).toBe(1);
    expect(single.weeklyAvoidedPm25Kg).toBe(1.4);
    expect(single.weeklySavedCo2Kg).toBe(18.5);
    expect(single.weeklyAvoidedCigarettes).toBe(32);
    expect(single.annualCommunityHealthSavingsInr).toBe(28800);

    const collective = calculateCollectiveSocietyImpact(25);
    expect(collective.participatingFamilies).toBe(25);
    expect(collective.weeklyAvoidedPm25Kg).toBe(35.0);
    expect(collective.weeklySavedCo2Kg).toBe(462.5);
    expect(collective.weeklyAvoidedCigarettes).toBe(800);
    expect(collective.annualCommunityHealthSavingsInr).toBe(720000);
  });

  it('clamps non-positive family counts to minimum 1', () => {
    const zero = calculateCollectiveSocietyImpact(0);
    expect(zero.participatingFamilies).toBe(1);

    const negative = calculateCollectiveSocietyImpact(-10);
    expect(negative.participatingFamilies).toBe(1);
  });

  it('returns preseeded reports when storage is empty and persists properly', () => {
    const reports = getStoredReports();
    expect(reports.length).toBeGreaterThanOrEqual(PRESEEDED_COMMUNITY_REPORTS.length);
    expect(reports[0].city).toBe('Delhi');

    const customReport: CommunityReport = {
      id: 'rep-custom-1',
      city: 'Delhi',
      neighborhood: 'Saket',
      incidentType: 'waste_burning',
      severity: 'critical',
      description: 'Garbage dump fire',
      reportedAt: 'Just now',
      upvotes: 5,
      status: 'active',
      reporterName: 'Neighbor',
    };

    saveStoredReports([customReport, ...reports]);
    const updated = getStoredReports();
    expect(updated[0].id).toBe('rep-custom-1');
  });

  it('sanitizes malicious or oversized input when saving reports', () => {
    const dirtyReport = {
      id: '<script>alert(1)</script>id-123',
      city: 'Delhi',
      neighborhood: 'Saket',
      incidentType: 'waste_burning' as const,
      severity: 'critical' as const,
      description: 'A'.repeat(600),
      reportedAt: 'Now',
      upvotes: -10,
      status: 'active' as const,
      reporterName: 'User',
    };

    saveStoredReports([dirtyReport]);
    const stored = getStoredReports();
    expect(stored[0].id).not.toContain('<script>');
    expect(stored[0].upvotes).toBe(0);
    expect(stored[0].description.length).toBeLessThanOrEqual(500);
  });
});
