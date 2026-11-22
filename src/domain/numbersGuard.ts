/**
 * VayuShield AI - Numbers Guard & Grounding Enforcer
 * Enforces that quantitative claims match values computed by impactEngine.
 */

import { ImpactLedgerMetrics } from './types';
import {
  getCertifiedNumbersList,
  sanitizeSentenceNumbers,
} from './numbers/numberSanitizer';

export * from './numbers/numberSanitizer';

export interface CertifiedMetricsContext {
  [key: string]: number | undefined;
  baselineInhaledPm25DoseUgPerDay?: number;
  protectedInhaledPm25DoseUgPerDay?: number;
  inhaledPm25ReductionPct?: number;
  baselineCigarettesPerDay?: number;
  avoidedCigarettesPerDay?: number;
  avoidedCigarettesPerWeek?: number;
  co2SavedKgPerWeek?: number;
  cleanAirHoursGainedPerDay?: number;
  currentAqi?: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  roomAreaSqFt?: number;
  requiredCadrCfm?: number;
  recommendedUnits?: number;
  timeTo90PctClearanceMinutes?: number;
  householdSize?: number;
}

export interface GroundingCheckResult {
  isFullyGrounded: boolean;
  unverifiedNumbers: number[];
  verifiedNumbers: number[];
  cleanedText: string;
  violationsCount: number;
}

/**
 * Verifies if all numbers in an AI response sentence are grounded in impactEngine metrics.
 * @param aiText - Text response from generative AI model
 * @param certifiedMetrics - Master ground truth calculation context
 * @returns Grounding validation result and cleaned string
 */
export function verifyAndSanitizeText(
  aiText: string,
  certifiedMetrics: CertifiedMetricsContext | ImpactLedgerMetrics
): GroundingCheckResult {
  if (!aiText || typeof aiText !== 'string') {
    return {
      isFullyGrounded: true,
      unverifiedNumbers: [],
      verifiedNumbers: [],
      cleanedText: '',
      violationsCount: 0,
    };
  }

  const certifiedList = getCertifiedNumbersList(certifiedMetrics);
  const sentences = aiText.split(/(?<=[.?!])\s+/);
  const unverifiedSet = new Set<number>();
  const verifiedSet = new Set<number>();
  const cleanedSentences: string[] = [];

  for (const sentence of sentences) {
    const { sanitizedSentence, hasUngrounded } = sanitizeSentenceNumbers(
      sentence,
      certifiedList,
      verifiedSet,
      unverifiedSet
    );
    cleanedSentences.push(hasUngrounded ? sanitizedSentence : sentence);
  }

  const unverifiedNumbers = Array.from(unverifiedSet);
  const verifiedNumbers = Array.from(verifiedSet);

  return {
    isFullyGrounded: unverifiedNumbers.length === 0,
    unverifiedNumbers,
    verifiedNumbers,
    cleanedText: cleanedSentences.join(' '),
    violationsCount: unverifiedNumbers.length,
  };
}

/**
 * Enforces that an impact ledger output strictly uses the exact deterministic numbers.
 * @param candidate - Candidate metrics payload
 * @param groundTruth - Authoritative ground truth metrics
 * @returns Grounded impact ledger metrics
 */
export function enforceGroundedMetrics(
  _candidate: Partial<ImpactLedgerMetrics>,
  groundTruth: ImpactLedgerMetrics
): ImpactLedgerMetrics {
  return {
    baselineInhaledPm25DoseUgPerDay: groundTruth.baselineInhaledPm25DoseUgPerDay,
    protectedInhaledPm25DoseUgPerDay: groundTruth.protectedInhaledPm25DoseUgPerDay,
    inhaledPm25ReductionPct: groundTruth.inhaledPm25ReductionPct,
    baselineCigarettesPerDay: groundTruth.baselineCigarettesPerDay,
    avoidedCigarettesPerDay: groundTruth.avoidedCigarettesPerDay,
    avoidedCigarettesPerWeek: groundTruth.avoidedCigarettesPerWeek,
    co2SavedKgPerWeek: groundTruth.co2SavedKgPerWeek,
    cleanAirHoursGainedPerDay: groundTruth.cleanAirHoursGainedPerDay,
    riskReductionScore: groundTruth.riskReductionScore,
  };
}
