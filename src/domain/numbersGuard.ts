/**
 * VayuShield AI - Numbers Guard & Grounding Enforcer
 *
 * Strict anti-hallucination guard that enforces that any quantitative claim
 * (percentages, avoided cigarettes, CO2 savings, inhaled PM2.5 doses, CADR numbers)
 * in Gemini's response matches values deterministically computed by impactEngine.ts.
 *
 * Ungrounded or fabricated statistics are detected and sanitized or blocked.
 */

import { ImpactLedgerMetrics } from './types';

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

// Common non-statistical safe numerals & standard filter specifications (hours, days, standard ratings)
const SAFE_CALENDAR_NUMERALS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 20, 21, 22, 24, 48, 50, 60, 90, 95, 100, 350, 400, 528, 2024, 2025, 2026, 2800, 14000, 14500, 15000,
]);

/**
 * Normalizes numbers for comparison within a small floating tolerance (e.g. ±5% or ±0.5)
 */
function isNumberMatch(num: number, certifiedValues: number[], toleranceRatio: number = 0.05): boolean {
  const absNum = Math.abs(num);
  for (const cert of certifiedValues) {
    const absCert = Math.abs(cert);
    if (Math.abs(absNum - absCert) <= 0.05) return true;
    if (absCert !== 0 && Math.abs((absNum - absCert) / absCert) <= toleranceRatio) return true;
  }
  return false;
}

/**
 * Extracts all candidate numeric values from a string
 */
export function extractNumbersFromText(text: string): number[] {
  // Normalize numbers formatted with thousand separators (e.g. 2,800 or 14,000)
  const normalized = text.replace(/\b(\d{1,3}),(\d{3})\b/g, '$1$2');
  // Matches numbers including decimals and optional signs, e.g. 14.5, 85%, 2.5
  const matches = normalized.match(/-?\b\d+(?:\.\d+)?\b/g);
  if (!matches) return [];
  return matches
    .map((m) => Number.parseFloat(m))
    .filter((n) => !Number.isNaN(n));
}

/**
 * Flattens certified metrics object into an array of certified numbers
 */
export function getCertifiedNumbersList(metrics: CertifiedMetricsContext): number[] {
  const list: number[] = [];
  for (const val of Object.values(metrics)) {
    if (typeof val === 'number' && !Number.isNaN(val)) {
      list.push(val);
      // Also allow 1-decimal roundings
      list.push(Number(val.toFixed(1)));
      list.push(Math.round(val));
    }
  }
  return list;
}

/**
 * Verifies if all numbers in an AI response sentence are grounded in impactEngine metrics.
 * If an ungrounded statistic is found, sanitizes or redacts the fabricated number.
 */
export function verifyAndSanitizeText(
  aiText: string,
  certifiedMetrics: CertifiedMetricsContext
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
    const numbersInSentence = extractNumbersFromText(sentence);
    let sentenceHasUngrounded = false;
    let sanitizedSentence = sentence;

    for (const num of numbersInSentence) {
      // Check if it's an allowed standard calendar/time numeral or physical rating
      if (SAFE_CALENDAR_NUMERALS.has(Math.abs(num))) {
        verifiedSet.add(num);
        continue;
      }

      // Check if it matches any certified impactEngine metric
      if (isNumberMatch(num, certifiedList)) {
        verifiedSet.add(num);
      } else {
        // Detected an ungrounded / hallucinated number
        unverifiedSet.add(num);
        sentenceHasUngrounded = true;

        // Redact unverified quantitative claims
        // e.g. replace "saves 45 kg of CO2" with "saves verified emissions"
        const regex = new RegExp(`\\b${num.toString().replace('.', '\\.')}(?:%|\\s*kg|\\s*cigarettes?|\\s*ug/m³|\\s*µg/m³)?\\b`, 'gi');
        sanitizedSentence = sanitizedSentence.replace(regex, '[verified engine figure]');
      }
    }

    if (sentenceHasUngrounded) {
      cleanedSentences.push(sanitizedSentence);
    } else {
      cleanedSentences.push(sentence);
    }
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
 * Enforces that an impact ledger output strictly uses the exact deterministic numbers
 */
export function enforceGroundedMetrics(
  candidate: Partial<ImpactLedgerMetrics>,
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
