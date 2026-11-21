import { describe, expect, it } from 'vitest';
import {
  extractNumbersFromText,
  getCertifiedNumbersList,
  verifyAndSanitizeText,
  enforceGroundedMetrics,
} from '../domain/numbersGuard';
import { ImpactLedgerMetrics } from '../domain/types';

describe('Strict Gemini Grounding & Numbers Guard - numbersGuard.ts', () => {
  it('extracts numbers accurately from complex text strings', () => {
    const text = 'At 185 ug/m3, wearing an N95 drops dose by 86.7% and saves 14.2 cigarettes per week.';
    const nums = extractNumbersFromText(text);
    // Standalone numbers are extracted; product codes like N95 are preserved as alphanumeric words
    expect(nums).toEqual([185, 86.7, 14.2]);
  });

  it('passes fully grounded AI text when all numbers match certified metrics', () => {
    const certified = {
      inhaledPm25ReductionPct: 86.7,
      avoidedCigarettesPerWeek: 14.2,
      co2SavedKgPerWeek: 13.5,
      currentAqi: 320,
    };

    const aiText =
      'Based on verified math, your family achieves an 86.7% reduction in inhaled PM2.5, avoiding 14.2 cigarettes per week and saving 13.5 kg of CO2 in 7 days.';

    const result = verifyAndSanitizeText(aiText, certified);
    expect(result.isFullyGrounded).toBe(true);
    expect(result.unverifiedNumbers).toHaveLength(0);
    expect(result.violationsCount).toBe(0);
  });

  it('detects and redacts hallucinated statistics not calculated by impactEngine', () => {
    const certified = {
      inhaledPm25ReductionPct: 80.0,
      avoidedCigarettesPerWeek: 12.0,
      co2SavedKgPerWeek: 10.0,
    };

    // 99.8% and 850 kg are completely made up
    const aiHallucinatedText =
      'Our miracle solution gives 99.8% filtration and saves 850 kg of CO2!';

    const result = verifyAndSanitizeText(aiHallucinatedText, certified);
    expect(result.isFullyGrounded).toBe(false);
    expect(result.unverifiedNumbers).toContain(99.8);
    expect(result.unverifiedNumbers).toContain(850);
    expect(result.cleanedText).toContain('[verified engine figure]');
    expect(result.cleanedText).not.toContain('99.8%');
  });

  it('allows standard calendar and time numerals (24h, 7 days)', () => {
    const certified = {
      avoidedCigarettesPerWeek: 14.2,
    };

    const text = 'Over 7 days and 24 hours of exposure, you avoid 14.2 cigarettes.';
    const result = verifyAndSanitizeText(text, certified);
    expect(result.isFullyGrounded).toBe(true);
  });

  it('enforces ground truth metrics onto candidate object', () => {
    const groundTruth: ImpactLedgerMetrics = {
      baselineInhaledPm25DoseUgPerDay: 1062,
      protectedInhaledPm25DoseUgPerDay: 141.3,
      inhaledPm25ReductionPct: 86.7,
      baselineCigarettesPerDay: 16.4,
      avoidedCigarettesPerDay: 2.03,
      avoidedCigarettesPerWeek: 14.2,
      co2SavedKgPerWeek: 13.5,
      cleanAirHoursGainedPerDay: 21,
      riskReductionScore: 85,
    };

    const fakeCandidate: Partial<ImpactLedgerMetrics> = {
      inhaledPm25ReductionPct: 99.9, // hallucinated
      avoidedCigarettesPerWeek: 100, // hallucinated
    };

    const enforced = enforceGroundedMetrics(fakeCandidate, groundTruth);
    expect(enforced.inhaledPm25ReductionPct).toBe(86.7);
    expect(enforced.avoidedCigarettesPerWeek).toBe(14.2);
  });
});
