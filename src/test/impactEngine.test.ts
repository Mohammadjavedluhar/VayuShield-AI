import { describe, expect, it } from 'vitest';
import {
  BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE,
  calculateAvoidedCigarettesWeekly,
  calculateCigaretteEquivalents,
  calculateCo2SavingsWeekly,
  calculateCorsiRosenthalSizing,
  calculateHouseholdVulnerability,
  calculateInhaledPm25Dose,
  calculateMasterImpactLedger,
} from '../domain/impactEngine';
import { HouseholdProfile, Interventions } from '../domain/types';
import { createTestProfile, createTestInterventions } from '../../tests/testHelpers';

describe('Deterministic Impact Engine - impactEngine.ts', () => {
  describe('1. Berkeley Earth Cigarette Equivalence', () => {
    it('cites Berkeley Earth 528 ug-hours per cigarette constant', () => {
      expect(BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE).toBe(528);
    });

    it('returns 0 for non-positive values or zero hours', () => {
      expect(calculateCigaretteEquivalents(0, 24)).toBe(0);
      expect(calculateCigaretteEquivalents(-50, 24)).toBe(0);
      expect(calculateCigaretteEquivalents(100, 0)).toBe(0);
      expect(calculateCigaretteEquivalents(100, -5)).toBe(0);
    });

    it('matches exact Berkeley Earth benchmark: 22 ug/m3 for 24 hours equals 1 cigarette', () => {
      const cigs = calculateCigaretteEquivalents(22, 24);
      expect(cigs).toBe(1);
    });

    it('calculates severe winter smog equivalents correctly (220 ug/m3 = 10 cigarettes/day)', () => {
      const cigs = calculateCigaretteEquivalents(220, 24);
      expect(cigs).toBe(10);
    });

    it('scales linearly with exposure hours (22 ug/m3 for 12 hours = 0.5 cigarette)', () => {
      const cigs = calculateCigaretteEquivalents(22, 12);
      expect(cigs).toBe(0.5);
    });
  });

  describe('2. Inhaled PM2.5 Dose & Percentage Reduction', () => {
    it('returns 0 dose and 0% reduction when outdoor PM2.5 is zero', () => {
      const result = calculateInhaledPm25Dose({
        outdoorPm25: 0,
        outdoorHours: 3,
        indoorHours: 21,
        outdoorFiltrationEff: 0.95,
        indoorFiltrationEff: 0.85,
      });

      expect(result.baselineDoseUg).toBe(0);
      expect(result.protectedDoseUg).toBe(0);
      expect(result.percentageReduction).toBe(0);
    });

    it('calculates exact baseline dose and protected dose with N95 and HEPA', () => {
      // 100 ug/m3, 3h outdoor, 21h indoor, breathing rate 0.6 m3/h
      // Baseline indoor = 70 ug/m3
      // Baseline dose = (100*3 + 70*21) * 0.6 = (300 + 1470) * 0.6 = 1062 ug
      // Protected: N95 (95% eff -> 5 ug/m3 * 3 = 15 ug*h/m3)
      //            HEPA (85% eff -> 70 * 0.15 = 10.5 ug/m3 * 21 = 220.5 ug*h/m3)
      // Total protected = (15 + 220.5) * 0.6 = 235.5 * 0.6 = 141.3 ug
      // Reduction = (1062 - 141.3) / 1062 = 86.7%
      const result = calculateInhaledPm25Dose({
        outdoorPm25: 100,
        outdoorHours: 3,
        indoorHours: 21,
        outdoorFiltrationEff: 0.95,
        indoorFiltrationEff: 0.85,
        hourlyInhalationRateM3: 0.6,
      });

      expect(result.baselineDoseUg).toBe(1062);
      expect(result.protectedDoseUg).toBe(141.3);
      expect(result.percentageReduction).toBe(86.7);
    });

    it('clamps filtration efficiencies between 0 and 1', () => {
      const clamped = calculateInhaledPm25Dose({
        outdoorPm25: 150,
        outdoorFiltrationEff: 1.5, // should clamp to 1.0
        indoorFiltrationEff: -0.5, // should clamp to 0.0
      });
      expect(clamped.percentageReduction).toBeGreaterThan(0);
      expect(clamped.protectedDoseUg).toBeLessThan(clamped.baselineDoseUg);
    });
  });

  describe('3. Avoided Cigarette Equivalents Weekly', () => {
    it('yields 7x daily avoided cigarettes', () => {
      const result = calculateAvoidedCigarettesWeekly({
        outdoorPm25: 200,
        outdoorHours: 4,
        indoorHours: 20,
        outdoorFiltrationEff: 0.95,
        indoorFiltrationEff: 0.85,
      });

      expect(result.avoidedCigarettesPerDay).toBeGreaterThan(0);
      expect(result.avoidedCigarettesPerWeek).toBeCloseTo(
        result.avoidedCigarettesPerDay * 7,
        1
      );
    });

    it('yields 0 avoided cigarettes when no filtration is applied', () => {
      const result = calculateAvoidedCigarettesWeekly({
        outdoorPm25: 250,
        outdoorFiltrationEff: 0,
        indoorFiltrationEff: 0,
      });

      expect(result.avoidedCigarettesPerDay).toBe(0);
      expect(result.avoidedCigarettesPerWeek).toBe(0);
    });
  });

  describe('4. CO2 Savings Weekly', () => {
    it('calculates commute savings: car (0.170 kg/km) to metro (0.035 kg/km)', () => {
      // 10 km one-way = 20 km round trip * 5 days = 100 km/week
      // Savings = (0.170 - 0.035) * 100 = 13.50 kg CO2/week
      const result = calculateCo2SavingsWeekly({
        baselineCommuteMode: 'car',
        chosenCommuteMode: 'metro',
        oneWayDistanceKm: 10,
        commuteDaysPerWeek: 5,
        baselineCookingFuel: 'lpg',
        chosenCookingFuel: 'lpg', // no change in cooking
      });

      expect(result.commuteCo2SavedWeekly).toBe(13.50);
      expect(result.cookingCo2SavedWeekly).toBe(0);
      expect(result.totalCo2SavedWeekly).toBe(13.50);
    });

    it('calculates cooking savings: LPG to induction', () => {
      // LPG = 1.50 kg/day, Induction = 0.45 kg/day -> diff = 1.05 kg/day * 7 = 7.35 kg/week
      const result = calculateCo2SavingsWeekly({
        baselineCommuteMode: 'car',
        chosenCommuteMode: 'car', // no commute change
        oneWayDistanceKm: 15,
        commuteDaysPerWeek: 5,
        baselineCookingFuel: 'lpg',
        chosenCookingFuel: 'induction',
      });

      expect(result.commuteCo2SavedWeekly).toBe(0);
      expect(result.cookingCo2SavedWeekly).toBe(7.35);
      expect(result.totalCo2SavedWeekly).toBe(7.35);
    });

    it('calculates high savings switching from Biomass Chulha to Induction', () => {
      // Biomass = 2.50 kg/day, Induction = 0.45 kg/day -> diff = 2.05 kg/day * 7 = 14.35 kg/week
      const result = calculateCo2SavingsWeekly({
        baselineCommuteMode: 'walkOrCycle',
        chosenCommuteMode: 'walkOrCycle',
        oneWayDistanceKm: 2,
        commuteDaysPerWeek: 5,
        baselineCookingFuel: 'biomassChulha',
        chosenCookingFuel: 'induction',
      });

      expect(result.cookingCo2SavedWeekly).toBe(14.35);
      expect(result.totalCo2SavedWeekly).toBe(14.35);
    });
  });

  describe('5. Corsi-Rosenthal Box Sizing (CADR & ACH)', () => {
    it('sizes a standard bedroom (200 sq ft, 9 ft ceiling) with target 5 ACH', () => {
      // Volume = 200 * 9 = 1800 cu.ft
      // CADR = 1800 * 5 / 60 = 150 CFM
      // Recommended units = ceil(150 / 350) = 1 unit
      // Clearance time = round(2.302585 / 5 * 60) = 28 minutes
      const cr = calculateCorsiRosenthalSizing(200, 9, 5);

      expect(cr.roomVolumeCuFt).toBe(1800);
      expect(cr.requiredCadrCfm).toBe(150);
      expect(cr.recommendedUnits).toBe(1);
      expect(cr.timeTo90PctClearanceMinutes).toBe(28);
      expect(cr.savingsPct).toBeGreaterThan(70);
    });

    it('sizes a large open living hall (800 sq ft, 10 ft ceiling) requiring multiple units', () => {
      // Volume = 8000 cu.ft -> CADR = 8000 * 5 / 60 = 667 CFM
      // Recommended units = ceil(667 / 350) = 2 units
      const cr = calculateCorsiRosenthalSizing(800, 10, 5);
      expect(cr.requiredCadrCfm).toBe(667);
      expect(cr.recommendedUnits).toBe(2);
      expect(cr.diyCostEstimateInr).toBe(5600);
    });
  });

  describe('6. Household Vulnerability Score', () => {
    it('classifies severe asthmatic household with children as critical', () => {
      const vuln = calculateHouseholdVulnerability({
        hasAsthma: true,
        hasChildren: true,
        hasElderly: true,
        commuteMode: 'twoWheeler',
        hasAirPurifier: false,
        wearsMaskOutdoors: false,
      });

      expect(vuln.score).toBeGreaterThanOrEqual(75);
      expect(vuln.level).toBe('critical');
      expect(vuln.riskFactors.length).toBeGreaterThanOrEqual(3);
    });

    it('mitigates vulnerability when air purifier and N95 masks are adopted', () => {
      const unmitigated = calculateHouseholdVulnerability({
        hasAsthma: true,
        hasAirPurifier: false,
        wearsMaskOutdoors: false,
      });

      const mitigated = calculateHouseholdVulnerability({
        hasAsthma: true,
        hasAirPurifier: true,
        wearsMaskOutdoors: true,
      });

      expect(mitigated.score).toBeLessThan(unmitigated.score);
    });
  });

  describe('7. Master Impact Ledger Integration', () => {
    it('computes end-to-end ledger metrics cleanly', () => {
      const profile: HouseholdProfile = createTestProfile({
        hasAsthma: true,
        hasChildren: true,
        hasElderly: true,
        vulnerabilityScore: 85,
        vulnerabilityLevel: 'critical',
      });

      const interventions: Interventions = createTestInterventions();

      const ledger = calculateMasterImpactLedger(250, profile, interventions);

      expect(ledger.inhaledPm25ReductionPct).toBeGreaterThan(80);
      expect(ledger.avoidedCigarettesPerWeek).toBeGreaterThan(10);
      expect(ledger.co2SavedKgPerWeek).toBeGreaterThan(15);
      expect(ledger.cleanAirHoursGainedPerDay).toBe(21);
      expect(ledger.riskReductionScore).toBeGreaterThan(70);
    });
  });
});
