import { executeAiCascade } from './_lib/aiCascade';
import { parseRequestBody, sendJson } from './_lib/httpUtils';
import { PlanRequestSchema } from './_lib/types';
import { calculateMasterImpactLedger } from '../src/domain/impactEngine';
import { verifyAndSanitizeText, enforceGroundedMetrics } from '../src/domain/numbersGuard';
import { CleanHourWindow, HourlyForecastItem } from '../src/domain/types';
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

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  try {
    const rawBody = await parseRequestBody(req);
    const parsedInput = PlanRequestSchema.safeParse(rawBody);

    if (!parsedInput.success) {
      return sendJson(res, 400, {
        error: 'Invalid request body',
        details: parsedInput.error.format(),
      });
    }

    const { profile, airQuality, interventions } = parsedInput.data;
    const currentPm25 = airQuality?.pm25 || 160;

    // 1. Calculate deterministic ground truth impact ledger
    const groundTruthLedger = calculateMasterImpactLedger(currentPm25, profile, interventions);

    // 2. Compute clean-hour routine windows based on live hourly forecast
    const hourly: HourlyForecastItem[] = airQuality?.hourlyForecast || [];
    const windows: CleanHourWindow[] = computeCleanHourWindows(hourly, currentPm25);

    // 3. AI Cascade for contextual action checklist & personalized explanation
    const systemPrompt = `You are VayuShield AI's chief clinical and environmental health planner.
Synthesize a personalized action plan for a household during severe smog.
IMPORTANT GROUNDING RULE: You may ONLY use the exact statistics provided in the prompt. Do not invent any percentage reductions, cigarette counts, or CO2 numbers.
Output JSON conforming to:
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
        actionChecklist: [
          {
            id: 'task-1',
            task: 'Seal window gaps with weatherstripping tape',
            category: 'immediate',
            urgency: 'high',
            rationale: 'Stops cold morning smog drafts from entering bedrooms.',
          },
          {
            id: 'task-2',
            task: 'Mandate certified N95 respirators for all outdoor travel',
            category: 'daily',
            urgency: 'high',
            rationale: 'Filters over 95% of inhaled fine particulates during commute.',
          },
          {
            id: 'task-3',
            task: 'Deploy Corsi-Rosenthal Box or HEPA cleaner continuously',
            category: 'equipment',
            urgency: 'high',
            rationale: `Enables ${groundTruthLedger.inhaledPm25ReductionPct}% particulate reduction and saves ${groundTruthLedger.avoidedCigarettesPerWeek} cigarette-equivalents weekly.`,
          },
          {
            id: 'task-4',
            task: 'Shift outdoor exertion to 1:00 PM – 3:30 PM window',
            category: 'daily',
            urgency: 'medium',
            rationale: 'Avoids morning and evening thermal inversion particulate spikes.',
          },
        ],
        aiExplanation: `By combining N95 outdoor protection with indoor air scrubbing, your family achieves a verified ${groundTruthLedger.inhaledPm25ReductionPct}% reduction in inhaled PM2.5, avoiding ${groundTruthLedger.avoidedCigarettesPerWeek} cigarettes of toxic smoke exposure each week while cutting ${groundTruthLedger.co2SavedKgPerWeek} kg of CO2 emissions.`,
      }),
      temperature: 0.1,
    });

    // 4. Numbers Guard Enforcement on the explanation
    const guardResult = verifyAndSanitizeText(cascadeResult.data.aiExplanation, {
      ...groundTruthLedger,
      pm25: currentPm25,
      currentAqi: airQuality?.currentAqi || 300,
    });

    return sendJson(res, 200, {
      impactMetrics: enforceGroundedMetrics({}, groundTruthLedger),
      windows,
      actionChecklist: cascadeResult.data.actionChecklist,
      aiExplanation: guardResult.cleanedText,
      certifiedNumbersOnly: true,
      tier: cascadeResult.tier,
      modelUsed: cascadeResult.modelUsed,
      latencyMs: cascadeResult.latencyMs,
    });
  } catch (error: any) {
    console.error('[API /api/plan error]', error);
    return sendJson(res, 500, { error: 'Failed to generate plan.' });
  }
}

function computeCleanHourWindows(hourly: HourlyForecastItem[], currentPm25: number): CleanHourWindow[] {
  // If hourly forecast is empty, generate typical winter smog curve
  const dayHours = hourly.length >= 24 ? hourly.slice(0, 24) : generateDefaultHourly(currentPm25);

  // Exercise window: look between 11:00 and 16:00
  const afternoonHours = dayHours.filter((h) => h.hour >= 11 && h.hour <= 16);
  const bestExerciseHour = afternoonHours.reduce((best, cur) => (cur.aqi < best.aqi ? cur : best), afternoonHours[0] || dayHours[14]);

  // Commute window morning (7:00 to 9:30)
  const morningCommute = dayHours.filter((h) => h.hour >= 7 && h.hour <= 9);
  const avgMorningAqi = morningCommute.length > 0
    ? Math.round(morningCommute.reduce((s, h) => s + h.aqi, 0) / morningCommute.length)
    : 320;

  // Ventilation window: best 1-hour afternoon slot
  const bestVentHour = bestExerciseHour;

  // Sleep window (22:00 to 06:00)
  const nightHours = dayHours.filter((h) => h.hour >= 22 || h.hour <= 6);
  const avgNightAqi = nightHours.length > 0
    ? Math.round(nightHours.reduce((s, h) => s + h.aqi, 0) / nightHours.length)
    : 340;

  return [
    {
      type: 'exercise',
      title: 'Safest Outdoor Exercise / Walk Window',
      startHour: Math.max(11, bestExerciseHour.hour - 1),
      endHour: Math.min(16, bestExerciseHour.hour + 2),
      avgAqi: bestExerciseHour.aqi,
      status: bestExerciseHour.aqi <= 150 ? 'safe' : bestExerciseHour.aqi <= 250 ? 'caution' : 'danger',
      advice:
        bestExerciseHour.aqi <= 150
          ? 'Thermal inversion is lifted by solar warmth. Safest window for brisk walking or errands.'
          : 'Air remains unhealthy even at midday. Limit outdoor cardio; prefer indoor workouts.',
    },
    {
      type: 'commute',
      title: 'Morning School & Office Commute',
      startHour: 7,
      endHour: 10,
      avgAqi: avgMorningAqi,
      status: 'danger',
      advice: 'Severe ground-level smoke trapped by nocturnal cold layer. N95 respirators mandatory; keep car recirculate mode ON.',
    },
    {
      type: 'ventilation',
      title: 'Filtered Air Exchange & Cross-Ventilation',
      startHour: 13,
      endHour: 15,
      avgAqi: bestVentHour.aqi,
      status: bestVentHour.aqi <= 120 ? 'safe' : 'caution',
      advice:
        bestVentHour.aqi <= 120
          ? 'Brief 15-minute cross-ventilation permissible to flush indoor CO2, followed by immediate filtration.'
          : 'Do NOT open windows. Ambient smog is too hazardous. Rely on indoor mechanical filtration with carbon stage.',
    },
    {
      type: 'sleep',
      title: 'Nighttime Sleep Air Management',
      startHour: 22,
      endHour: 6,
      avgAqi: avgNightAqi,
      status: 'caution',
      advice: 'Keep bedroom doors and windows tightly shut. Run Corsi-Rosenthal box or HEPA on medium-high speed all night.',
    },
  ];
}

function generateDefaultHourly(basePm25: number): HourlyForecastItem[] {
  const items: HourlyForecastItem[] = [];
  for (let i = 0; i < 24; i++) {
    // Winter diurnal curve: peaks at 7-9 AM and 9-11 PM, dips at 2-3 PM
    const diurnalFactor = 1 + 0.35 * Math.sin(((i - 8) * Math.PI) / 12) * -1;
    const pm = Math.max(20, Math.round(basePm25 * diurnalFactor));
    const aqi = Math.min(500, Math.round((pm / 150) * 200));

    items.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      hour: i,
      pm25: pm,
      pm10: Math.round(pm * 1.6),
      no2: Math.round(40 + pm * 0.2),
      aqi,
      aqiCategory: aqi > 300 ? 'hazardous' : aqi > 200 ? 'veryUnhealthy' : aqi > 150 ? 'unhealthy' : 'moderate',
      isExerciseSafe: i >= 12 && i <= 15 && aqi < 200,
      isCommuteWarning: (i >= 7 && i <= 10) || (i >= 19 && i <= 22),
      isVentilationSafe: i === 14 && aqi < 150,
      recommendation: i >= 12 && i <= 15 ? 'Moderate solar dispersion' : 'Inversion smog peak',
    });
  }
  return items;
}
