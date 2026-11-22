/**
 * VayuShield AI - Intake & Vision API Calls
 * Handles natural language family intake and multimodal room photo hazard inspections.
 */

import { postJson } from './apiClientCore';
import { fallbackIntake, fallbackVisionAudit } from '../../api/_lib/deterministicFallbacks';
import { calculateHouseholdVulnerability } from '../domain/impactEngine';
import type { HouseholdProfile, VisionAuditResult } from '../domain/types';

export async function callIntakeApi(text: string, cityHint?: string): Promise<{
  profile: HouseholdProfile;
  tier: string;
}> {
  const json = await postJson<{ profile?: HouseholdProfile; tier?: string }>(
    '/api/intake',
    { text, cityHint }
  );

  if (json?.profile) {
    return { profile: json.profile, tier: json.tier || 'tier2_flash' };
  }

  const fallback = fallbackIntake(text, cityHint);
  const vuln = calculateHouseholdVulnerability(fallback);
  return {
    profile: {
      ...fallback,
      rawInput: text,
      vulnerabilityScore: vuln.score,
      vulnerabilityLevel: vuln.level,
    },
    tier: 'tier4_fallback',
  };
}

export async function callVisionAuditApi(
  imageBase64: string,
  mimeType: string,
  roomContext?: string
): Promise<{
  audit: VisionAuditResult;
  tier: string;
  numbersGrounded: boolean;
}> {
  const json = await postJson<{
    audit?: VisionAuditResult;
    tier?: string;
    numbersGrounded?: boolean;
  }>('/api/vision-audit', { imageBase64, mimeType, roomContext });

  if (json?.audit) {
    return {
      audit: json.audit,
      tier: json.tier || 'tier2_flash',
      numbersGrounded: Boolean(json.numbersGrounded),
    };
  }

  const fallback = fallbackVisionAudit(roomContext);
  return {
    audit: fallback,
    tier: 'tier4_fallback',
    numbersGrounded: true,
  };
}
