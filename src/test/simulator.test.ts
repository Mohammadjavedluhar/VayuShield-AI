import { describe, expect, it } from 'vitest';
import { runWhatIfSimulation } from '../domain/simulator';
import { calculateCollectiveSocietyImpact } from '../domain/communityReports';

describe('Interactive What-If Impact Simulator & Society Calculator', () => {
  it('runs dynamic what-if simulation with realistic outputs', () => {
    const outputs = runWhatIfSimulation({
      ambientPm25: 220,
      commuteDistanceKm: 15,
      commuteDaysPerWeek: 5,
      commuteMode: 'metro',
      baselineCommuteMode: 'car',
      purifierRuntimeHours: 18,
      maskGrade: 'n95',
      cookingFuel: 'induction',
      baselineCookingFuel: 'lpg',
      householdSize: 4,
    });

    expect(outputs.inhaledPm25ReductionPct).toBeGreaterThan(65);
    expect(outputs.avoidedCigarettesWeekly).toBeGreaterThan(15);
    expect(outputs.co2SavedWeeklyKg).toBeGreaterThan(18);
    expect(outputs.annualCo2SavedKg).toBeGreaterThan(900);
    expect(outputs.estimatedMonthlyRupeeSavings).toBeGreaterThan(1000);
    expect(outputs.protectionTier).toBe('high_defense');
  });

  it('calculates collective neighborhood society impact accurately', () => {
    const societyImpact = calculateCollectiveSocietyImpact(25);

    expect(societyImpact.participatingFamilies).toBe(25);
    expect(societyImpact.weeklyAvoidedPm25Kg).toBe(35); // 25 * 1.4
    expect(societyImpact.weeklySavedCo2Kg).toBe(462.5); // 25 * 18.5
    expect(societyImpact.weeklyAvoidedCigarettes).toBe(800); // 25 * 32
    expect(societyImpact.annualCommunityHealthSavingsInr).toBeGreaterThan(500000);
  });
});
