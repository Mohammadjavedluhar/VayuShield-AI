import { describe, expect, it } from 'vitest';
import {
  analyzeMorningCommute,
  getBreathingRate,
  getInversionFactor,
  MASK_EFFICIENCY,
  TRAVEL_MODE_PENETRATION,
} from '../domain/commuteGuard';

describe('School & Elderly Morning Commute Guard - commuteGuard.ts', () => {
  it('models nocturnal inversion compression at 7:00 AM vs solar dispersion at 9:30 AM', () => {
    const early = getInversionFactor('07:00');
    const late = getInversionFactor('09:30');

    expect(early.factor).toBe(1.35);
    expect(early.riskLevel).toBe('critical');

    expect(late.factor).toBe(0.75);
    expect(late.riskLevel).toBe('low');
  });

  it('calculates mode penetration: closed car drops penetration to 40% vs 100% open', () => {
    expect(MASK_EFFICIENCY.n95).toBe(0.95);
    expect(MASK_EFFICIENCY.surgical).toBe(0.35);
    expect(TRAVEL_MODE_PENETRATION.closed_car).toBe(0.40);
    expect(TRAVEL_MODE_PENETRATION.metro).toBe(0.30);
    expect(TRAVEL_MODE_PENETRATION.open_walk_cycle).toBe(1.0);
  });

  it('adjusts child and asthmatic breathing rates according to EPA Exposure Factors', () => {
    const adultRate = getBreathingRate('adult', 'bus');
    const childRate = getBreathingRate('child', 'bus');
    const cycleRate = getBreathingRate('adult', 'open_walk_cycle');

    expect(adultRate).toBe(0.60);
    expect(childRate).toBe(0.50);
    expect(cycleRate).toBeGreaterThan(adultRate); // Exertion multiplier
  });

  it('computes exact commute verdict for school child during Delhi morning smog', () => {
    // 200 ug/m3 outdoor PM2.5, 7:15 AM departure, 40 min bus ride, cloth mask
    const verdict = analyzeMorningCommute({
      outdoorPm25: 200,
      departureTime: '07:15',
      durationMinutes: 40,
      commuterType: 'child',
      travelMode: 'bus',
      currentMask: 'cloth',
    });

    expect(verdict.effectiveAmbientPm25).toBe(270); // 200 * 1.35
    expect(verdict.inversionRiskLevel).toBe('critical');
    expect(verdict.inhaledDoseUg).toBeGreaterThan(0);
    expect(verdict.whoSafeLimitMultiplier).toBeGreaterThan(1.5);
    expect(verdict.maskVerdict).toContain('N95 Mandatory');
    expect(verdict.delayedDepartureSavingsPct).toBeGreaterThan(0);
  });

  it('confirms certified N95 cuts inhaled dose by 95% compared to bare breathing', () => {
    const unmasked = analyzeMorningCommute({
      outdoorPm25: 180,
      departureTime: '07:30',
      durationMinutes: 30,
      commuterType: 'elderly',
      travelMode: 'open_walk_cycle',
      currentMask: 'none',
    });

    const maskedN95 = analyzeMorningCommute({
      outdoorPm25: 180,
      departureTime: '07:30',
      durationMinutes: 30,
      commuterType: 'elderly',
      travelMode: 'open_walk_cycle',
      currentMask: 'n95',
    });

    expect(maskedN95.inhaledDoseUg).toBeCloseTo(unmasked.inhaledDoseUg * 0.05, 1);
  });
});
