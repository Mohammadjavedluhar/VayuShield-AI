import { describe, expect, it } from 'vitest';
import {
  estimateIndoorAirQuality,
  AIR_PURIFIER_CADR_M3_H,
  PENETRATION_FACTORS,
} from '../domain/indoorModel';

describe('Real-Time Indoor AQI Estimator - indoorModel.ts', () => {
  it('applies EPA penetration coefficients correctly', () => {
    expect(PENETRATION_FACTORS.weathersealed).toBe(0.40);
    expect(PENETRATION_FACTORS.standard_closed).toBe(0.65);
    expect(PENETRATION_FACTORS.leaky_drafty).toBe(0.85);
    expect(PENETRATION_FACTORS.open_windows).toBe(1.00);
  });

  it('demonstrates drastic PM2.5 drop when running a Corsi-Rosenthal Box', () => {
    // 200 ug/m3 outdoor, standard closed room, no cooking, no incense
    const withoutPurifier = estimateIndoorAirQuality({
      outdoorPm25: 200,
      windowSeal: 'standard_closed',
      cookingFuel: 'induction',
      incenseUsage: 'none',
      ventilationRate: 'moderate_natural',
      airPurifier: 'none',
    });

    const withCrBox = estimateIndoorAirQuality({
      outdoorPm25: 200,
      windowSeal: 'standard_closed',
      cookingFuel: 'induction',
      incenseUsage: 'none',
      ventilationRate: 'moderate_natural',
      airPurifier: 'diy_corsi_rosenthal',
    });

    expect(withoutPurifier.indoorPm25).toBeGreaterThan(80);
    expect(withCrBox.indoorPm25).toBeLessThan(20); // Dramatic drop from 84.5 to ~6.7 ug/m3
    expect(withCrBox.purifierBenefitUg).toBeGreaterThan(70);
    expect(withCrBox.ratioIndoorOutdoor).toBeLessThan(0.20);
  });

  it('detects massive self-generated indoor spikes from incense and unvented cooking', () => {
    const cleanHome = estimateIndoorAirQuality({
      outdoorPm25: 100,
      windowSeal: 'weathersealed',
      cookingFuel: 'induction',
      incenseUsage: 'none',
      ventilationRate: 'low_sealed',
      airPurifier: 'none',
    });

    const incenseHome = estimateIndoorAirQuality({
      outdoorPm25: 100,
      windowSeal: 'weathersealed',
      cookingFuel: 'lpg_unvented',
      incenseUsage: 'multiple_dhoop',
      ventilationRate: 'low_sealed',
      airPurifier: 'none',
    });

    expect(incenseHome.indoorPm25).toBeGreaterThan(cleanHome.indoorPm25 * 3);
    expect(incenseHome.selfGeneratedIndoorPm25).toBeGreaterThan(cleanHome.selfGeneratedIndoorPm25);
    expect(incenseHome.dominantHazard).toContain('Incense');
  });

  it('verifies Corsi-Rosenthal box 350 CFM conversion to ~595 m3/h', () => {
    expect(AIR_PURIFIER_CADR_M3_H.diy_corsi_rosenthal.cadrCfm).toBe(350);
    expect(AIR_PURIFIER_CADR_M3_H.diy_corsi_rosenthal.cadrM3H).toBe(595);
  });
});
