import { executeAiCascade } from './_lib/aiCascade';
import { fallbackIntake } from './_lib/deterministicFallbacks';
import {
  handlePreflightAndRateLimit,
  parseAndValidateRequest,
  sendJson,
  type ExtendedRequest,
  type ExtendedResponse,
} from './_lib/httpUtils';
import { IntakeRequestSchema, IntakeResponseSchema } from './_lib/types';
import { calculateHouseholdVulnerability } from '../src/domain/impactEngine';

/**
 * Serverless API handler for structured family air vulnerability intake.
 */
export default async function handler(req: ExtendedRequest, res: ExtendedResponse): Promise<void> {
  if (!handlePreflightAndRateLimit(req, res)) {
    return;
  }

  try {
    const input = await parseAndValidateRequest(req, res, IntakeRequestSchema);
    if (!input) return;

    const { text, cityHint } = input;

    const systemPrompt = `You are a clinical environmental intake system for VayuShield AI.
Extract structured household air pollution sensitivity profiles from natural language sentences.
You must output ONLY valid JSON matching this schema:
{
  "householdSize": number (default 4),
  "city": string (e.g. "Delhi", "Noida", "Lahore"),
  "hasAsthma": boolean,
  "hasCopdOrCardiac": boolean,
  "hasChildren": boolean,
  "hasElderly": boolean,
  "isPregnant": boolean,
  "commuteMode": "car" | "carpool" | "twoWheeler" | "metro" | "bus" | "walkOrCycle" | "ev",
  "commuteDistanceKm": number (default 10),
  "cookingFuel": "lpg" | "biomassChulha" | "induction" | "pipedGas",
  "heatingSource": "unventedHeater" | "electricHeater" | "firewood" | "none",
  "hasAirPurifier": boolean,
  "wearsMaskOutdoors": boolean,
  "explanation": string
}`;

    const prompt = `Analyze this family intake description: "${text}"
${cityHint ? `Location hint: ${cityHint}` : ''}
Extract the exact JSON object.`;

    const cascadeResult = await executeAiCascade({
      task: 'family_intake',
      prompt,
      systemInstruction: systemPrompt,
      zodSchema: IntakeResponseSchema,
      fallbackFn: () => fallbackIntake(text, cityHint),
      temperature: 0.1,
    });

    const vulnerability = calculateHouseholdVulnerability(cascadeResult.data);

    sendJson(res, 200, {
      profile: {
        ...cascadeResult.data,
        rawInput: text,
        vulnerabilityScore: vulnerability.score,
        vulnerabilityLevel: vulnerability.level,
        riskFactors: vulnerability.riskFactors,
      },
      tier: cascadeResult.tier,
      modelUsed: cascadeResult.modelUsed,
      latencyMs: cascadeResult.latencyMs,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[API /api/intake error]', errorMsg);
    const fallback = fallbackIntake('Family of 4 in Delhi');
    sendJson(res, 200, {
      profile: {
        ...fallback,
        vulnerabilityScore: 60,
        vulnerabilityLevel: 'high',
        riskFactors: ['Urban winter smog exposure'],
      },
      tier: 'tier4_fallback',
    });
  }
}
