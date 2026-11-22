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
import { VISION_SYSTEM_PROMPT, buildVisionPrompt } from './_lib/prompts/visionPrompts';

/**
 * Serverless API handler for multimodal image inspection of masks, filters, and rooms.
 * @param req - Extended HTTP request
 * @param res - Extended HTTP response
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

    const cascadeResult = await executeAiCascade({
      task: 'vision_audit',
      prompt: buildVisionPrompt(roomContext),
      systemInstruction: VISION_SYSTEM_PROMPT,
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

    const crSizing = calculateCorsiRosenthalSizing(220, 9, 5);
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
      latencyMs: 0,
      numbersGrounded: true,
      error: errorMsg,
    });
  }
}
