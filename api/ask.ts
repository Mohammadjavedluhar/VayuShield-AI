import { executeAiCascade } from './_lib/aiCascade';
import { fallbackAsk } from './_lib/deterministicFallbacks';
import { parseRequestBody, sendJson } from './_lib/httpUtils';
import { AskRequestSchema } from './_lib/types';
import { verifyAndSanitizeText } from '../src/domain/numbersGuard';
import { z } from 'zod';

const AskResponseSchema = z.object({
  answer: z.string(),
  recommendations: z.array(z.string()).default([]),
});

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  try {
    const rawBody = await parseRequestBody(req);
    const parsedInput = AskRequestSchema.safeParse(rawBody);

    if (!parsedInput.success) {
      return sendJson(res, 400, {
        error: 'Invalid request body',
        details: parsedInput.error.format(),
      });
    }

    const { question, context } = parsedInput.data;

    const systemPrompt = `You are VayuShield AI's clinical and environmental air quality doctor.
You provide precise, evidence-based guidance for urban smog crises (Delhi-NCR, winter inversion).
Ground all health recommendations in US EPA standards, WHO guidelines, and Berkeley Earth equivalence (1 cigarette ≈ 22 ug/m3 PM2.5 for 24 hours).
Output ONLY valid JSON:
{
  "answer": string (detailed, empathetic, actionable, 2-3 paragraphs),
  "recommendations": string[] (3 bullet points)
}`;

    const prompt = `User Question: "${question}"
Live Local Air Context:
- City: ${context?.city || 'Delhi'}
- Current AQI: ${context?.aqi || 280}
- PM2.5: ${context?.pm25 || 150} ug/m3
- Family Conditions: ${JSON.stringify(context?.profile || {})}
- Certified Savings: ${JSON.stringify(context?.ledger || {})}`;

    const cascadeResult = await executeAiCascade({
      task: 'grounded_ask',
      prompt,
      systemInstruction: systemPrompt,
      zodSchema: AskResponseSchema,
      fallbackFn: () => {
        const fb = fallbackAsk(question, context);
        return {
          answer: fb.answer,
          recommendations: [
            'Wear certified N95 respirators outdoors without leakage.',
            'Deploy Corsi-Rosenthal DIY air cleaners in main living spaces.',
            'Keep windows closed during early morning and late evening inversion spikes.',
          ],
        };
      },
      temperature: 0.2,
    });

    // Guard numbers in answer
    const guard = verifyAndSanitizeText(cascadeResult.data.answer, {
      currentAqi: context?.aqi || 280,
      pm25: context?.pm25 || 150,
      ...(context?.ledger || {}),
    });

    return sendJson(res, 200, {
      answer: guard.cleanedText,
      recommendations: cascadeResult.data.recommendations,
      isGrounded: guard.isFullyGrounded,
      tier: cascadeResult.tier,
      modelUsed: cascadeResult.modelUsed,
      latencyMs: cascadeResult.latencyMs,
    });
  } catch (error: any) {
    console.error('[API /api/ask error]', error);
    const fallback = fallbackAsk('General advice', {});
    return sendJson(res, 200, {
      answer: fallback.answer,
      recommendations: [
        'Use certified N95 masks outdoors.',
        'Run indoor air purifiers continuously.',
        'Avoid outdoor cardio in early mornings.',
      ],
      isGrounded: true,
      tier: 'tier4_fallback',
    });
  }
}
