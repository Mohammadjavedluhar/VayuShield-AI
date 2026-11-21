import { executeAiCascade } from './_lib/aiCascade';
import { fallbackIntake } from './_lib/deterministicFallbacks';
import { parseRequestBody, sendJson } from './_lib/httpUtils';
import { IntakeRequestSchema, IntakeResponseSchema } from './_lib/types';
import { calculateHouseholdVulnerability } from '../src/domain/impactEngine';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  try {
    const rawBody = await parseRequestBody(req);
    const parsedInput = IntakeRequestSchema.safeParse(rawBody);

    if (!parsedInput.success) {
      return sendJson(res, 400, {
        error: 'Invalid request body',
        details: parsedInput.error.format(),
      });
    }

    const { text, cityHint } = parsedInput.data;

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

    return sendJson(res, 200, {
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
  } catch (error: any) {
    console.error('[API /api/intake error]', error);
    const fallback = fallbackIntake('Family of 4 in Delhi');
    return sendJson(res, 200, {
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
