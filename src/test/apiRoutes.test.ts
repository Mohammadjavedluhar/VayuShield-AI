import { describe, expect, it } from 'vitest';
import intakeHandler from '../../api/intake';
import visionHandler from '../../api/vision-audit';
import planHandler from '../../api/plan';
import askHandler from '../../api/ask';
import { createMockReqRes } from '../../tests/testHelpers';

describe('Vercel Serverless Functions (/api/*) with 4-Tier Resilience', () => {
  it('/api/intake extracts family profile and vulnerability score', async () => {
    const { req, res } = createMockReqRes({
      text: 'Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car',
    });

    await intakeHandler(req, res);
    expect(res.getStatusCode()).toBe(200);

    const data = res.getData();
    expect(data.profile).toBeDefined();
    expect(data.profile.city).toBe('Delhi');
    expect(data.profile.householdSize).toBe(4);
    expect(data.profile.hasAsthma).toBe(true);
    expect(data.profile.hasElderly).toBe(true);
    expect(data.profile.hasChildren).toBe(true);
    expect(data.profile.vulnerabilityScore).toBeGreaterThanOrEqual(70);
    expect(data.tier).toBeDefined();
  });

  it('/api/vision-audit identifies particulate hazards and sizes Corsi-Rosenthal box', async () => {
    const { req, res } = createMockReqRes({
      imageBase64: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==',
      roomContext: 'Kitchen with gas stove and active frying',
    });

    await visionHandler(req, res);
    expect(res.getStatusCode()).toBe(200);

    const data = res.getData();
    expect(data.audit).toBeDefined();
    expect(data.audit.hazardsIdentified.length).toBeGreaterThan(0);
    expect(data.audit.diyFixes.length).toBeGreaterThan(0);
    expect(data.audit.crBoxRecommended).toBe(true);
    expect(data.audit.crBoxSizing.requiredCadrCfm).toBeGreaterThan(0);
    expect(data.numbersGrounded).toBe(true);
  });

  it('/api/plan produces clean-hour routine and grounded clinical action plan', async () => {
    const profile = {
      householdSize: 4,
      city: 'Delhi',
      hasAsthma: true,
      hasCopdOrCardiac: false,
      hasChildren: true,
      hasElderly: true,
      isPregnant: false,
      commuteMode: 'car' as const,
      commuteDistanceKm: 12,
      cookingFuel: 'lpg' as const,
      heatingSource: 'none' as const,
      hasAirPurifier: false,
      wearsMaskOutdoors: false,
      vulnerabilityScore: 85,
      vulnerabilityLevel: 'critical' as const,
    };

    const airQuality = {
      city: 'Delhi',
      currentAqi: 340,
      pm25: 210,
      hourlyForecast: [],
    };

    const interventions = {
      useN95Mask: true,
      useAirPurifier: true,
      commuteMode: 'metro' as const,
      cookingFuel: 'induction' as const,
      roomSealImprovement: true,
      wetMoppingDaily: true,
    };

    const { req, res } = createMockReqRes({ profile, airQuality, interventions });
    await planHandler(req, res);

    expect(res.getStatusCode()).toBe(200);
    const data = res.getData();
    expect(data.impactMetrics.inhaledPm25ReductionPct).toBeGreaterThan(80);
    expect(data.impactMetrics.avoidedCigarettesPerWeek).toBeGreaterThan(10);
    expect(data.windows.length).toBe(4);
    expect(data.actionChecklist.length).toBeGreaterThan(0);
    expect(data.certifiedNumbersOnly).toBe(true);
  });

  it('/api/ask provides grounded conversational responses', async () => {
    const { req, res } = createMockReqRes({
      question: 'How does a Corsi-Rosenthal box compare to a commercial HEPA purifier?',
      context: {
        city: 'Delhi',
        aqi: 320,
        pm25: 180,
      },
    });

    await askHandler(req, res);
    expect(res.getStatusCode()).toBe(200);
    const data = res.getData();
    expect(data.answer).toBeDefined();
    expect(data.answer.length).toBeGreaterThan(20);
    expect(data.isGrounded).toBe(true);
  });
});
