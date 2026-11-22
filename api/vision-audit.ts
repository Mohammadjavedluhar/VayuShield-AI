import { executeAiCascade } from './_lib/aiCascade';
import { fallbackVisionAudit } from './_lib/deterministicFallbacks';
import {
  handlePreflightAndRateLimit,
  parseAndValidateRequest,
  sendJson,
  MAX_VISION_PAYLOAD_BYTES,
  type ExtendedRequest,
  type ExtendedResponse,
} from './_lib/httpUtils';
import { VisionAuditResponseSchema, VisionRequestSchema } from './_lib/types';
import { calculateCorsiRosenthalSizing } from '../src/domain/impactEngine';
import { verifyAndSanitizeText } from '../src/domain/numbersGuard';

/**
 * Serverless API handler for multimodal image inspection of masks, filters, and rooms.
 */
export default async function handler(req: ExtendedRequest, res: ExtendedResponse): Promise<void> {
  if (!handlePreflightAndRateLimit(req, res)) {
    return;
  }

  try {
    const input = await parseAndValidateRequest(req, res, VisionRequestSchema, MAX_VISION_PAYLOAD_BYTES);
    if (!input) return;

    const { imageBase64, mimeType, roomContext } = input;
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const systemPrompt = `You are an expert indoor air quality certified building engineer, PPE respirator specialist, and multimodal vision inspector for VayuShield AI.
Analyze the user's uploaded photograph, which may be:
1. Room, kitchen, or window smog scene (detect particulate sources, incense, gas burners, draft leaks)
2. Mask / respirator fit photo (detect nose bridge clamp gaps, facial perimeter seal leakage, cloth vs certified N95)
3. Air purifier filter condition photo (detect gray/black particulate saturation and replacement urgency)
Output ONLY structured JSON strictly conforming to this schema:
{
  "roomType": string,
  "scanCategory": "room_indoor" | "mask_fit" | "filter_condition" | "outdoor_smog",
  "confidenceScore": number (0 - 100),
  "overallVentilationRating": "poor" | "fair" | "good",
  "estimatedIndoorPm25": number,
  "maskFitAnalysis": {
    "fitStatus": "tight_certified" | "leaky_gaps" | "improper_mask_type",
    "gapLocations": string[],
    "correctiveAction": string
  } (optional),
  "filterConditionAnalysis": {
    "saturationLevel": "clean_new" | "moderately_loaded" | "critically_saturated",
    "replacementNeeded": boolean,
    "remainingLifeDays": number
  } (optional),
  "zeroCostActions": string[],
  "hazardsIdentified": [
    {
      "hazard": string,
      "severity": "low" | "medium" | "high" | "critical",
      "description": string,
      "estimatedPm25ContributionUg": number
    }
  ],
  "diyFixes": [
    {
      "title": string,
      "costTier": "free" | "low" | "medium",
      "action": string,
      "expectedPm25DropPct": number
    }
  ],
  "crBoxRecommended": boolean,
  "plantsRecommended": [
    {
      "name": string,
      "targetPollutant": string,
      "careLevel": "easy" | "moderate",
      "airBenefit": string
    }
  ],
  "summary": string
}`;

    const prompt = `Inspect this image. Room context if specified: "${roomContext || 'indoor living room or kitchen'}".
Detect all visible air quality hazards, infiltration points, and ventilation quality. Provide low-cost DIY engineering remedies.`;

    const cascadeResult = await executeAiCascade({
      task: 'vision_audit',
      prompt,
      systemInstruction: systemPrompt,
      imagePart: {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      },
      zodSchema: VisionAuditResponseSchema,
      fallbackFn: () => fallbackVisionAudit(roomContext),
      temperature: 0.1,
    });

    // Compute deterministic Corsi-Rosenthal box sizing
    const crSizing = calculateCorsiRosenthalSizing(220, 9, 5);

    // Apply Numbers Guard to the summary text
    const numbersGuardResult = verifyAndSanitizeText(cascadeResult.data.summary, {
      pm25: cascadeResult.data.estimatedIndoorPm25,
      requiredCadrCfm: crSizing.requiredCadrCfm,
      roomAreaSqFt: crSizing.roomAreaSqFt,
      recommendedUnits: crSizing.recommendedUnits,
      savingsPct: crSizing.savingsPct,
      timeTo90PctClearanceMinutes: crSizing.timeTo90PctClearanceMinutes,
      diyCostEstimateInr: crSizing.diyCostEstimateInr,
      commercialHepaCostInr: crSizing.commercialHepaCostInr,
    });

    sendJson(res, 200, {
      audit: {
        ...cascadeResult.data,
        crBoxSizing: crSizing,
        summary: numbersGuardResult.cleanedText,
      },
      source: cascadeResult.tier === 'tier4_fallback' ? 'template_fallback' : 'ai',
      tier: cascadeResult.tier,
      modelUsed: cascadeResult.modelUsed,
      latencyMs: cascadeResult.latencyMs,
      numbersGrounded: numbersGuardResult.isFullyGrounded,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[API /api/vision-audit error]', errorMsg);
    const fallback = fallbackVisionAudit();
    sendJson(res, 200, {
      audit: fallback,
      source: 'template_fallback',
      tier: 'tier4_fallback',
      numbersGrounded: true,
    });
  }
}
