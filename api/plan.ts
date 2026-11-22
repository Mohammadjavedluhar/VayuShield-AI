import { executeAiCascade } from './_lib/aiCascade';
import {
  handlePreflightAndRateLimit,
  parseAndValidateRequest,
  sendJson,
  type ExtendedRequest,
  type ExtendedResponse,
} from './_lib/httpUtils';
import { PlanRequestSchema } from './_lib/types';
import { calculateMasterImpactLedger } from '../src/domain/impactEngine';
import { verifyAndSanitizeText, enforceGroundedMetrics } from '../src/domain/numbersGuard';
import { computeCleanHourWindows, getDefaultActionChecklist } from '../src/domain/cleanHours';
import { z } from 'zod';

const ActionChecklistSchema = z.object({
  actionChecklist: z.array(
    z.object({
      id: z.string(),
      task: z.string(),
      category: z.enum(['immediate', 'daily', 'equipment']),
      urgency: z.enum(['high', 'medium', 'low']),
      rationale: z.string(),
    })
  ),
  aiExplanation: z.string(),
});

/**
 * Serverless API handler for synthesizing personalized household smog action plans.
 */
export default async function handler(req: ExtendedRequest, res: ExtendedResponse): Promise<void> {
  if (!handlePreflightAndRateLimit(req, res)) {
    return;
  }

  try {
    const input = await parseAndValidateRequest(req, res, PlanRequestSchema);
    if (!input) return;

    const { profile, airQuality, interventions } = input;
    const currentPm25 = airQuality?.pm25 || 160;

    // 1. Calculate deterministic ground truth impact ledger
    const defaultInterventions = {
      useN95Mask: true,
      useAirPurifier: true,
      commuteMode: 'metro' as const,
      cookingFuel: 'induction' as const,
      roomSealImprovement: true,
      wetMoppingDaily: true,
    };

    const groundTruthLedger = calculateMasterImpactLedger(
      currentPm25,
      profile,
      interventions || defaultInterventions
    );

    // 2. Compute clean-hour windows using shared deterministic helper
    const windows = computeCleanHourWindows(airQuality?.hourlyForecast || [], currentPm25);

    // 3. AI synthesis with 4-Tier Resilience
    const systemPrompt = `You are VayuShield AI's chief clinical pulmonologist and air exposure scientist.
Synthesize a customized clean-air plan strictly respecting the calculated impact figures.
Every statistic in your output MUST match the certified metrics exactly.
Output ONLY valid JSON:
{
  "actionChecklist": [
    {
      "id": string,
      "task": string,
      "category": "immediate" | "daily" | "equipment",
      "urgency": "high" | "medium" | "low",
      "rationale": string
    }
  ],
  "aiExplanation": string
}`;

    const prompt = `Household: ${profile.householdSize} members in ${profile.city}.
Conditions: Asthma=${profile.hasAsthma}, Elderly=${profile.hasElderly}, Children=${profile.hasChildren}.
Current PM2.5: ${currentPm25} ug/m3.
CERTIFIED IMPACT METRICS:
- Inhaled PM2.5 Reduction: ${groundTruthLedger.inhaledPm25ReductionPct}%
- Avoided Cigarettes/Week: ${groundTruthLedger.avoidedCigarettesPerWeek} cigarettes
- CO2 Saved/Week: ${groundTruthLedger.co2SavedKgPerWeek} kg CO2
- Clean Air Hours Gained/Day: ${groundTruthLedger.cleanAirHoursGainedPerDay} hours
Create 4 to 5 high-priority action checklist tasks and a 2-sentence clinical explanation.`;

    const cascadeResult = await executeAiCascade({
      task: 'action_plan',
      prompt,
      systemInstruction: systemPrompt,
      zodSchema: ActionChecklistSchema,
      fallbackFn: () => ({
        actionChecklist: getDefaultActionChecklist(groundTruthLedger),
        aiExplanation: `By combining N95 outdoor protection with indoor air scrubbing, your family achieves a verified ${groundTruthLedger.inhaledPm25ReductionPct}% reduction in inhaled PM2.5, avoiding ${groundTruthLedger.avoidedCigarettesPerWeek} cigarettes of toxic smoke exposure each week while cutting ${groundTruthLedger.co2SavedKgPerWeek} kg of CO2 emissions.`,
      }),
      temperature: 0.1,
    });

    // 4. Grounding verification
    const guardResult = verifyAndSanitizeText(
      cascadeResult.data.aiExplanation,
      groundTruthLedger
    );

    sendJson(res, 200, {
      impactMetrics: enforceGroundedMetrics({}, groundTruthLedger),
      windows,
      actionChecklist: cascadeResult.data.actionChecklist,
      aiExplanation: guardResult.cleanedText,
      certifiedNumbersOnly: true,
      tier: cascadeResult.tier,
      modelUsed: cascadeResult.modelUsed,
      latencyMs: cascadeResult.latencyMs,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[API /api/plan error]', errorMsg);
    sendJson(res, 500, { error: 'Failed to generate plan.' });
  }
}
