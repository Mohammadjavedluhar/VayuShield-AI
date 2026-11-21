/**
 * VayuShield AI - Universal API Client
 * Calls Vercel serverless routes with seamless automatic client-side fallback.
 */

import {
  fallbackAsk,
  fallbackIntake,
  fallbackVisionAudit,
} from '../../api/_lib/deterministicFallbacks';
import {
  calculateHouseholdVulnerability,
  calculateMasterImpactLedger,
} from '../domain/impactEngine';
import {
  AirQualityData,
  HouseholdProfile,
  ImpactLedgerMetrics,
  Interventions,
  PersonalizedPlan,
  VisionAuditResult,
} from '../domain/types';

export async function callIntakeApi(text: string, cityHint?: string): Promise<{
  profile: HouseholdProfile;
  tier: string;
}> {
  try {
    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, cityHint }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.profile) {
        return { profile: json.profile, tier: json.tier || 'tier2_flash' };
      }
    }
  } catch (err) {
    console.warn('[ApiClient] /api/intake offline, using deterministic client fallback', err);
  }

  // Graceful client-side fallback
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
  try {
    const res = await fetch('/api/vision-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, roomContext }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.audit) {
        return {
          audit: json.audit,
          tier: json.tier || 'tier2_flash',
          numbersGrounded: Boolean(json.numbersGrounded),
        };
      }
    }
  } catch (err) {
    console.warn('[ApiClient] /api/vision-audit offline, using deterministic client fallback', err);
  }

  const fallback = fallbackVisionAudit(roomContext);
  return {
    audit: fallback,
    tier: 'tier4_fallback',
    numbersGrounded: true,
  };
}

export async function callPlanApi(
  profile: HouseholdProfile,
  airQuality: AirQualityData,
  interventions: Interventions
): Promise<PersonalizedPlan> {
  const groundTruthLedger = calculateMasterImpactLedger(
    airQuality.pm25,
    profile,
    interventions
  );

  try {
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, airQuality, interventions }),
    });

    if (res.ok) {
      const json = await res.json();
      return {
        householdProfile: profile,
        airQuality,
        impactMetrics: json.impactMetrics || groundTruthLedger,
        windows: json.windows || [],
        actionChecklist: json.actionChecklist || [],
        aiExplanation: json.aiExplanation || '',
        certifiedNumbersOnly: true,
      };
    }
  } catch (err) {
    console.warn('[ApiClient] /api/plan offline, generating deterministic plan', err);
  }

  // Client-side deterministic plan
  return {
    householdProfile: profile,
    airQuality,
    impactMetrics: groundTruthLedger,
    windows: [
      {
        type: 'exercise',
        title: 'Safest Outdoor Exercise / Walk Window',
        startHour: 13,
        endHour: 15,
        avgAqi: Math.round(airQuality.currentAqi * 0.7),
        status: 'safe',
        advice: 'Solar boundary layer mixing disperses particulate concentrations. Best window for outdoor errands.',
      },
      {
        type: 'commute',
        title: 'Morning School & Office Commute',
        startHour: 7,
        endHour: 10,
        avgAqi: Math.round(airQuality.currentAqi * 1.3),
        status: 'danger',
        advice: 'Ground-level smoke trapped by nocturnal cold layer. N95 respirators mandatory.',
      },
      {
        type: 'ventilation',
        title: 'Filtered Air Exchange Window',
        startHour: 14,
        endHour: 15,
        avgAqi: Math.round(airQuality.currentAqi * 0.65),
        status: airQuality.currentAqi > 200 ? 'caution' : 'safe',
        advice: 'Keep windows sealed during severe smog episodes. Run indoor mechanical filtration.',
      },
      {
        type: 'sleep',
        title: 'Nighttime Sleep Air Management',
        startHour: 22,
        endHour: 6,
        avgAqi: Math.round(airQuality.currentAqi * 1.2),
        status: 'caution',
        advice: 'Keep bedroom doors shut and maintain active air purifier operation through the night.',
      },
    ],
    actionChecklist: [
      {
        id: 'c-1',
        task: 'Equip all family members with certified N95 respirators',
        category: 'immediate',
        urgency: 'high',
        rationale: 'Stops fine PM2.5 from penetrating deep alveolar bronchioles.',
      },
      {
        id: 'c-2',
        task: 'Deploy Corsi-Rosenthal Box or HEPA filter in main room',
        category: 'equipment',
        urgency: 'high',
        rationale: `Yields ${groundTruthLedger.inhaledPm25ReductionPct}% particulate reduction and prevents ${groundTruthLedger.avoidedCigarettesPerWeek} cigarettes of smoke exposure weekly.`,
      },
      {
        id: 'c-3',
        task: 'Execute daily damp microfiber wet mopping',
        category: 'daily',
        urgency: 'medium',
        rationale: 'Eliminates settled dust resuspension without kicking particles into the air.',
      },
    ],
    aiExplanation: `With your selected interventions, your family will achieve a verified ${groundTruthLedger.inhaledPm25ReductionPct}% reduction in inhaled PM2.5, avoiding ${groundTruthLedger.avoidedCigarettesPerWeek} cigarettes equivalent of toxic particulate exposure per week and eliminating ${groundTruthLedger.co2SavedKgPerWeek} kg of CO2 emissions.`,
    certifiedNumbersOnly: true,
  };
}

export async function callAskApi(
  question: string,
  context: { city?: string; aqi?: number; pm25?: number; profile?: any; ledger?: ImpactLedgerMetrics }
): Promise<{
  answer: string;
  recommendations: string[];
  isGrounded: boolean;
  tier: string;
}> {
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });

    if (res.ok) {
      const json = await res.json();
      return {
        answer: json.answer,
        recommendations: json.recommendations || [],
        isGrounded: Boolean(json.isGrounded),
        tier: json.tier || 'tier2_flash',
      };
    }
  } catch (err) {
    console.warn('[ApiClient] /api/ask offline, serving deterministic answer', err);
  }

  const fb = fallbackAsk(question, context);
  return {
    answer: fb.answer,
    recommendations: [
      'Wear tight-fitting N95 masks during outdoor exposure.',
      'Run Corsi-Rosenthal DIY box fan purifiers in living areas.',
      'Restrict vigorous exercise during early morning smog spikes.',
    ],
    isGrounded: true,
    tier: 'tier4_fallback',
  };
}
