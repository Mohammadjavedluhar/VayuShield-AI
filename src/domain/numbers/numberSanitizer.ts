/**
 * VayuShield AI - Numeric Sanitization Helpers
 * Number matching, extraction, and sentence sanitization against hallucinated metrics.
 */

import type { CertifiedMetricsContext } from '../numbersGuard';
import type { ImpactLedgerMetrics } from '../types';

export const SAFE_CALENDAR_NUMERALS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 20, 21, 22, 24, 48, 50, 60, 90, 95, 100, 350, 400, 528, 2024, 2025, 2026, 2800, 14000, 14500, 15000,
]);

export function isNumberMatch(num: number, certifiedValues: number[], toleranceRatio: number = 0.05): boolean {
  const absNum = Math.abs(num);
  for (const cert of certifiedValues) {
    const absCert = Math.abs(cert);
    if (Math.abs(absNum - absCert) <= 0.05) return true;
    if (absCert !== 0 && Math.abs((absNum - absCert) / absCert) <= toleranceRatio) return true;
  }
  return false;
}

export function extractNumbersFromText(text: string): number[] {
  const normalized = text.replace(/\b(\d{1,3}),(\d{3})\b/g, '$1$2');
  const matches = normalized.match(/-?\b\d+(?:\.\d+)?\b/g);
  if (!matches) return [];
  return matches
    .map((m) => Number.parseFloat(m))
    .filter((n) => !Number.isNaN(n));
}

export function getCertifiedNumbersList(metrics: CertifiedMetricsContext | ImpactLedgerMetrics): number[] {
  const list: number[] = [];
  for (const val of Object.values(metrics)) {
    if (typeof val === 'number' && !Number.isNaN(val)) {
      list.push(val);
      list.push(Number(val.toFixed(1)));
      list.push(Math.round(val));
    }
  }
  return list;
}

export function sanitizeSentenceNumbers(
  sentence: string,
  certifiedList: number[],
  verifiedSet: Set<number>,
  unverifiedSet: Set<number>
): { sanitizedSentence: string; hasUngrounded: boolean } {
  const numbersInSentence = extractNumbersFromText(sentence);
  let hasUngrounded = false;
  let sanitizedSentence = sentence;

  for (const num of numbersInSentence) {
    if (SAFE_CALENDAR_NUMERALS.has(Math.abs(num))) {
      verifiedSet.add(num);
      continue;
    }

    if (isNumberMatch(num, certifiedList)) {
      verifiedSet.add(num);
    } else {
      unverifiedSet.add(num);
      hasUngrounded = true;

      const escapedNum = num.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedNum}(?:\\s*(?:%|kg|cigarettes?|ug/m³|µg/m³))?\\b`, 'gi');
      sanitizedSentence = sanitizedSentence.replace(regex, '[verified engine figure]');
    }
  }

  return { sanitizedSentence, hasUngrounded };
}
