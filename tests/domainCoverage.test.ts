import { describe, expect, it } from 'vitest';
import {
  calculatePollutantAqi,
  getAqiColorTheme,
  getHealthAdvisory,
} from '../src/domain/airQuality';
import {
  analyzeMorningCommute,
  getBreathingRate,
  getInversionFactor,
  type CommuterType,
  type MaskGrade,
  type TravelMode,
} from '../src/domain/commuteGuard';
import { JUDGE_PRESETS } from '../src/domain/demoPresets';
import {
  calculateAvoidedCigarettesWeekly,
  calculateCo2SavingsWeekly,
  calculateHouseholdVulnerability,
  calculateInhaledPm25Dose,
  calculateMasterImpactLedger,
} from '../src/domain/impactEngine';
import {
  estimateIndoorAirQuality,
} from '../src/domain/indoorModel';
import {
  enforceGroundedMetrics,
  getCertifiedNumbersList,
  verifyAndSanitizeText,
} from '../src/domain/numbersGuard';
import { runWhatIfSimulation } from '../src/domain/simulator';
import {
  getStoredReports,
  saveStoredReports,
} from '../src/domain/communityReports';
import type { HouseholdProfile } from '../src/domain/types';

describe('Domain Full Coverage - tests/domainCoverage.test.ts', () => {
  describe('airQuality.ts edge cases', () => {
    it('covers non-matching pollutant bracket edge cases', () => {
      // Empty breakpoints list
      const res = calculatePollutantAqi(50, []);
      expect(res.aqi).toBe(0);
      expect(res.category).toBe('good');

      // Concentration that misses all non-contiguous brackets
      const customBp = [{ cLow: 10, cHigh: 20, iLow: 0, iHigh: 50, category: 'good' as const, label: 'Good' }];
      const missed = calculatePollutantAqi(5, customBp);
      expect(missed.aqi).toBe(0);
      expect(missed.category).toBe('good');
    });

    it('covers all health advisories and theme mappings', () => {
      const categories = [
        'good',
        'moderate',
        'unhealthySensitive',
        'unhealthy',
        'veryUnhealthy',
        'hazardous',
        'severe',
      ] as const;

      for (const cat of categories) {
        expect(getHealthAdvisory(cat).length).toBeGreaterThan(10);
        const theme = getAqiColorTheme(cat);
        expect(theme.badgeBg).toBeDefined();
        expect(theme.badgeText).toBeDefined();
        expect(theme.progressColor).toBeDefined();
      }

      // Fallback for unknown category
      expect(getHealthAdvisory('unknown' as any)).toContain('Severe public health crisis');
      expect(getAqiColorTheme('unknown' as any).progressColor).toBe('bg-red-600');
    });
  });

  describe('demoPresets.ts', () => {
    it('verifies all 3 Judge Evaluation demo presets have valid parameters', () => {
      expect(JUDGE_PRESETS.length).toBe(3);
      for (const preset of JUDGE_PRESETS) {
        expect(preset.id).toBeDefined();
        expect(preset.badge).toBeDefined();
        expect(preset.city.length).toBeGreaterThan(2);
        expect(preset.lat).toBeGreaterThan(0);
        expect(preset.lon).toBeGreaterThan(0);
        expect(preset.aqi).toBeGreaterThan(100);
        expect(preset.pm25).toBeGreaterThan(50);
        expect(preset.householdSize).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('commuteGuard.ts edge cases', () => {
    it('covers all inversion time brackets', () => {
      // Before 6:30 AM
      expect(getInversionFactor('05:30').riskLevel).toBe('critical');
      // 6:30 - 7:45 AM
      expect(getInversionFactor('07:15').riskLevel).toBe('critical');
      // 7:46 - 8:30 AM
      expect(getInversionFactor('08:00').riskLevel).toBe('high');
      // 8:31 - 9:15 AM
      expect(getInversionFactor('09:00').riskLevel).toBe('moderate');
      // After 9:15 AM
      expect(getInversionFactor('10:00').riskLevel).toBe('low');
      // Missing or invalid time format
      expect(getInversionFactor('').factor).toBe(1.35);
    });

    it('covers all breathing rates for all commuter and mode combinations', () => {
      const commuters: CommuterType[] = ['child', 'elderly', 'asthma_patient', 'adult'];
      const modes: TravelMode[] = ['open_walk_cycle', 'two_wheeler', 'closed_car', 'metro', 'bus'];

      for (const commuter of commuters) {
        for (const mode of modes) {
          const rate = getBreathingRate(commuter, mode);
          expect(rate).toBeGreaterThan(0);
        }
      }
    });

    it('covers all mask grade tiers and travel modes in analyzeMorningCommute', () => {
      const maskGrades: MaskGrade[] = ['none', 'cloth', 'surgical', 'kn95', 'n95'];
      const modes: TravelMode[] = ['open_walk_cycle', 'two_wheeler', 'closed_car', 'metro', 'bus'];

      for (const mask of maskGrades) {
        for (const mode of modes) {
          const res = analyzeMorningCommute({
            outdoorPm25: 180,
            departureTime: '07:30',
            durationMinutes: 30,
            commuterType: 'child',
            travelMode: mode,
            currentMask: mask,
          });
          expect(res.inhaledDoseUg).toBeGreaterThanOrEqual(0);
          expect(res.routeModeAdvice).toBeDefined();
        }
      }
    });

    it('covers low, moderate, high, and severe PM2.5 levels in commute analysis', () => {
      // <= 50
      const low = analyzeMorningCommute({
        outdoorPm25: 30,
        departureTime: '09:30',
        durationMinutes: 20,
        commuterType: 'adult',
        travelMode: 'closed_car',
        currentMask: 'none',
      });
      expect(low.maskVerdict).toBe('Low Risk / Optional');

      // <= 100
      const mod = analyzeMorningCommute({
        outdoorPm25: 80,
        departureTime: '09:30',
        durationMinutes: 20,
        commuterType: 'adult',
        travelMode: 'closed_car',
        currentMask: 'cloth',
      });
      expect(mod.maskVerdict).toBe('Surgical / KN95 Advisory');

      // <= 200
      const high = analyzeMorningCommute({
        outdoorPm25: 160,
        departureTime: '09:30',
        durationMinutes: 20,
        commuterType: 'adult',
        travelMode: 'closed_car',
        currentMask: 'surgical',
      });
      expect(high.maskVerdict).toBe('KN95 / N95 Recommended');

      // Zero outdoor PM2.5
      const zero = analyzeMorningCommute({
        outdoorPm25: 0,
        departureTime: '10:00',
        durationMinutes: 20,
        commuterType: 'adult',
        travelMode: 'metro',
        currentMask: 'n95',
      });
      expect(zero.delayedDepartureSavingsPct).toBe(0);

      // Invalid departure time parsing (falls back to 7 and 0)
      const invalidTime = analyzeMorningCommute({
        outdoorPm25: 150,
        departureTime: 'invalid',
        durationMinutes: 30,
        commuterType: 'adult',
        travelMode: 'metro',
        currentMask: 'n95',
      });
      expect(invalidTime.effectiveAmbientPm25).toBeGreaterThan(0);

      // Afternoon departure where delayedDepartureSavingsPct <= 15 and commuter type fallback
      const afternoon = analyzeMorningCommute({
        outdoorPm25: 80,
        departureTime: '13:00',
        durationMinutes: 20,
        commuterType: 'general' as any,
        travelMode: 'closed_car',
        currentMask: 'none',
      });
      expect(afternoon.departureShiftAdvice).toContain('aligns with steady conditions');
      expect(afternoon.summary).toContain('commuter');

      // Elderly and asthma patient commuter labels, unknown mask/travelMode, no-minute time
      const elderlyCommute = analyzeMorningCommute({
        outdoorPm25: 120,
        departureTime: '08',
        durationMinutes: 30,
        commuterType: 'elderly',
        travelMode: 'spaceship' as any,
        currentMask: 'unknown_mask' as any,
      });
      expect(elderlyCommute.summary).toContain('elderly family member');

      const asthmaCommute = analyzeMorningCommute({
        outdoorPm25: 120,
        departureTime: '07:30',
        durationMinutes: 30,
        commuterType: 'asthma_patient',
        travelMode: 'metro',
        currentMask: 'n95',
      });
      expect(asthmaCommute.summary).toContain('asthma patient');
    });
  });

  describe('impactEngine.ts edge cases', () => {
    it('covers all vulnerability scoring branches and risk factors', () => {
      // Low vulnerability profile
      const lowProfile: HouseholdProfile = {
        householdSize: 2,
        city: 'Shimla',
        hasAsthma: false,
        hasCopdOrCardiac: false,
        hasChildren: false,
        hasElderly: false,
        isPregnant: false,
        commuteMode: 'metro',
        commuteDistanceKm: 5,
        cookingFuel: 'induction',
        heatingSource: 'none',
        hasAirPurifier: true,
        wearsMaskOutdoors: true,
        vulnerabilityScore: 10,
        vulnerabilityLevel: 'low',
        riskFactors: [],
      };
      const lowRes = calculateHouseholdVulnerability(lowProfile);
      expect(lowRes.level).toBe('low');

      // Walk / cycle commute + biomass chulha
      const biomassProfile: HouseholdProfile = {
        ...lowProfile,
        commuteMode: 'walkOrCycle',
        cookingFuel: 'biomassChulha',
        hasAirPurifier: false,
        wearsMaskOutdoors: false,
      };
      const bioRes = calculateHouseholdVulnerability(biomassProfile);
      expect(bioRes.riskFactors).toContain('Indoor solid biomass combustion');
      expect(bioRes.riskFactors).toContain('Active breathing during severe outdoor smog');

      // Two wheeler + unvented heater
      const heaterProfile: HouseholdProfile = {
        ...lowProfile,
        commuteMode: 'twoWheeler',
        cookingFuel: 'lpg',
        heatingSource: 'unventedHeater',
        hasAirPurifier: false,
        wearsMaskOutdoors: false,
      };
      const heaterRes = calculateHouseholdVulnerability(heaterProfile);
      expect(heaterRes.riskFactors).toContain('Unvented combustion heating indoors');
      expect(heaterRes.riskFactors).toContain('Open two-wheeler commute during morning inversions');

      // Moderate vulnerability score range (25 - 49)
      const modProfile: HouseholdProfile = {
        ...lowProfile,
        hasChildren: true,
        commuteMode: 'car',
        hasAirPurifier: false,
        wearsMaskOutdoors: false,
      };
      const modRes = calculateHouseholdVulnerability(modProfile);
      expect(modRes.level).toBe('moderate');

      // High vulnerability score range (50 - 74)
      const highProfile: HouseholdProfile = {
        ...lowProfile,
        hasAsthma: true,
        hasChildren: true,
        commuteMode: 'car',
        hasAirPurifier: false,
        wearsMaskOutdoors: false,
      };
      const highRes = calculateHouseholdVulnerability(highProfile);
      expect(highRes.level).toBe('high');

      // Household with COPD/cardiac and Pregnancy
      const copdPregProfile: HouseholdProfile = {
        ...lowProfile,
        hasCopdOrCardiac: true,
        isPregnant: true,
      };
      const copdPregRes = calculateHouseholdVulnerability(copdPregProfile);
      expect(copdPregRes.riskFactors).toContain('Cardiovascular / COPD vulnerability');
      expect(copdPregRes.riskFactors).toContain('Pregnancy (Placental PM2.5 translocation risk)');
    });

    it('covers all CO2 savings commute and cooking swap variations', () => {
      // Car to bus swap
      const carToBus = calculateCo2SavingsWeekly({
        baselineCommuteMode: 'car',
        chosenCommuteMode: 'bus',
        oneWayDistanceKm: 15,
        commuteDaysPerWeek: 5,
        baselineCookingFuel: 'biomassChulha',
        chosenCookingFuel: 'lpg',
      });
      expect(carToBus.commuteCo2SavedWeekly).toBeGreaterThan(0);
      expect(carToBus.cookingCo2SavedWeekly).toBe(7);

      // Piped gas cooking fuel
      const pipedGasSwap = calculateCo2SavingsWeekly({
        baselineCommuteMode: 'carpool',
        chosenCommuteMode: 'metro',
        oneWayDistanceKm: 10,
        commuteDaysPerWeek: 5,
        baselineCookingFuel: 'pipedGas',
        chosenCookingFuel: 'induction',
      });
      expect(pipedGasSwap.cookingCo2SavedWeekly).toBe(6.3);

      // Unknown commute and cooking fuel fallbacks
      const unknownFuels = calculateCo2SavingsWeekly({
        baselineCommuteMode: 'hyperloop' as any,
        chosenCommuteMode: 'teleport' as any,
        oneWayDistanceKm: 10,
        baselineCookingFuel: 'fusion' as any,
        chosenCookingFuel: 'solar_oven' as any,
      });
      expect(unknownFuels.totalCo2SavedWeekly).toBeGreaterThanOrEqual(0);

      // calculateMasterImpactLedger with all interventions disabled
      const zeroLedger = calculateMasterImpactLedger(
        150,
        {
          householdSize: 3,
          city: 'Delhi',
          hasAsthma: false,
          hasCopdOrCardiac: false,
          hasChildren: false,
          hasElderly: false,
          isPregnant: false,
          commuteMode: 'car',
          commuteDistanceKm: 10,
          cookingFuel: 'lpg',
          heatingSource: 'none',
          hasAirPurifier: false,
          wearsMaskOutdoors: false,
          vulnerabilityScore: 20,
          vulnerabilityLevel: 'low',
          riskFactors: [],
        },
        {
          useN95Mask: false,
          useAirPurifier: false,
          roomSealImprovement: false,
          wetMoppingDaily: false,
          commuteMode: 'car',
          cookingFuel: 'lpg',
        }
      );
      expect(zeroLedger.inhaledPm25ReductionPct).toBe(0);
      expect(zeroLedger.cleanAirHoursGainedPerDay).toBe(0);
    });

    it('covers zero and edge doses in calculateInhaledPm25Dose and avoid calculations', () => {
      const zeroDose = calculateInhaledPm25Dose({
        outdoorPm25: 0,
        outdoorHours: 0,
        indoorHours: 0,
        outdoorFiltrationEff: 0,
        indoorFiltrationEff: 0,
      });
      expect(zeroDose.baselineDoseUg).toBe(0);
      expect(zeroDose.percentageReduction).toBe(0);

      // Inhaled dose with omitted filtration and rate parameters
      const omittedDose = calculateInhaledPm25Dose({
        outdoorPm25: 100,
      });
      expect(omittedDose.baselineDoseUg).toBeGreaterThan(0);
      expect(omittedDose.percentageReduction).toBe(0);

      const avoidZero = calculateAvoidedCigarettesWeekly({
        outdoorPm25: 0,
        outdoorHours: 0,
        indoorHours: 0,
        outdoorFiltrationEff: 0,
        indoorFiltrationEff: 0,
      });
      expect(avoidZero.avoidedCigarettesPerWeek).toBe(0);
    });
  });

  describe('indoorModel.ts edge cases', () => {
    it('covers drafty windows, biomass cooking, and incense in estimateIndoorAirQuality', () => {
      const leaky = estimateIndoorAirQuality({
        outdoorPm25: 250,
        windowSeal: 'leaky_drafty',
        cookingFuel: 'biomass_chulha',
        incenseUsage: 'multiple_daily',
        ventilationRate: 'high_open',
        airPurifier: 'none',
        roomAreaSqFt: 180,
      });

      expect(leaky.indoorPm25).toBeGreaterThan(50);
      expect(leaky.actionSteps.some((s) => s.title.includes('Weatherstripping'))).toBe(true);
      expect(leaky.actionSteps.some((s) => s.title.includes('Incense'))).toBe(true);
      expect(leaky.actionSteps.some((s) => s.title.includes('Corsi-Rosenthal'))).toBe(true);
    });

    it('covers open_windows and hepa_h13 in estimateIndoorAirQuality', () => {
      const openWin = estimateIndoorAirQuality({
        outdoorPm25: 120,
        windowSeal: 'open_windows',
        cookingFuel: 'induction_clean',
        incenseUsage: 'none',
        ventilationRate: 'low_closed',
        airPurifier: 'hepa_h13',
        roomAreaSqFt: 250,
      });

      expect(openWin.indoorPm25).toBeLessThan(120);
      expect(openWin.purifierBenefitUg).toBeGreaterThan(0);

      // Fallbacks for unknown window seal and purifier with incense dominant
      const unknownInputs = estimateIndoorAirQuality({
        outdoorPm25: 10,
        windowSeal: 'unknown_seal' as any,
        cookingFuel: 'induction',
        incenseUsage: 'single_stick',
        ventilationRate: 'moderate_natural',
        airPurifier: 'unknown_purifier' as any,
        roomAreaSqFt: 200,
      });
      expect(unknownInputs.indoorPm25).toBeGreaterThan(0);
      expect(unknownInputs.dominantHazard).toBe('Indoor Incense / Agarbatti Burning');

      // Cooking dominance without biomass or incense
      const cookingDom = estimateIndoorAirQuality({
        outdoorPm25: 10,
        windowSeal: 'weathersealed',
        cookingFuel: 'lpg_unvented',
        incenseUsage: 'none',
        ventilationRate: 'moderate_natural',
        airPurifier: 'none',
        roomAreaSqFt: 200,
      });
      expect(cookingDom.dominantHazard).toBe('Unvented Cooking Emissions');

      // High ratio hazardously unfiltered (ratio > 0.75 and 35 < indoorPm25 < 150)
      const ratioHazard = estimateIndoorAirQuality({
        outdoorPm25: 100,
        windowSeal: 'open_windows',
        cookingFuel: 'induction',
        incenseUsage: 'none',
        ventilationRate: 'high_draft',
        airPurifier: 'none',
        roomAreaSqFt: 600,
      });
      expect(ratioHazard.ratioIndoorOutdoor).toBeGreaterThan(0.75);
      expect(ratioHazard.indoorPm25).toBeLessThan(150);
      expect(ratioHazard.ventilationRating).toBe('hazardously_unfiltered');
    });
  });

  describe('numbersGuard.ts edge cases', () => {
    it('handles empty text, non-string, and ungrounded numbers', () => {
      // Empty input
      const emptyRes = verifyAndSanitizeText('', { pm25: 100 });
      expect(emptyRes.isFullyGrounded).toBe(true);
      expect(emptyRes.cleanedText).toBe('');

      // Non-string input
      const nullRes = verifyAndSanitizeText(null as any, { pm25: 100 });
      expect(nullRes.isFullyGrounded).toBe(true);

      // Ungrounded numbers in text
      const ungroundedText = 'Wearing an N95 reduces exposure by 99.9% and saves 850 cigarettes weekly.';
      const res = verifyAndSanitizeText(ungroundedText, {
        pm25: 150,
        inhaledPm25ReductionPct: 75,
        avoidedCigarettesPerWeek: 12,
      });
      expect(res.isFullyGrounded).toBe(false);
      expect(res.unverifiedNumbers.length).toBeGreaterThan(0);
      expect(res.cleanedText).toContain('[verified engine figure]');
    });

    it('handles enforceGroundedMetrics with missing values', () => {
      const certified = {
        avoidedCigarettesPerWeek: 14.2,
        co2SavedKgPerWeek: 18.5,
      };
      const enforced = enforceGroundedMetrics({}, certified as any);
      expect(enforced.avoidedCigarettesPerWeek).toBe(14.2);
      expect(enforced.co2SavedKgPerWeek).toBe(18.5);

      // getCertifiedNumbersList non-number filtering
      const certifiedList = getCertifiedNumbersList({
        validVal: 42,
        stringVal: 'text' as any,
        nanVal: Number.NaN,
        nullVal: null as any,
      });
      expect(certifiedList).toContain(42);
      expect(certifiedList).not.toContain('text');
    });
  });

  describe('simulator.ts edge cases', () => {
    it('covers all mask grades and protection tiers in What-If simulator', () => {
      const grades: MaskGrade[] = ['kn95', 'surgical', 'cloth', 'none', 'n95'];

      for (const grade of grades) {
        const res = runWhatIfSimulation({
          ambientPm25: 220,
          householdSize: 4,
          maskGrade: grade,
          purifierRuntimeHours: 12,
          commuteDistanceKm: 15,
          commuteDaysPerWeek: 5,
          baselineCommuteMode: 'car',
          commuteMode: 'metro',
          baselineCookingFuel: 'biomassChulha',
          cookingFuel: 'induction',
        });
        expect(res.inhaledPm25ReductionPct).toBeGreaterThanOrEqual(0);
        expect(res.avoidedCigarettesWeekly).toBeGreaterThanOrEqual(0);
      }

      // Minimal protection tier (< 30% reduction)
      const minimal = runWhatIfSimulation({
        ambientPm25: 200,
        householdSize: 2,
        maskGrade: 'none',
        purifierRuntimeHours: 0,
        commuteDistanceKm: 5,
        commuteDaysPerWeek: 5,
        baselineCommuteMode: 'car',
        commuteMode: 'car',
        baselineCookingFuel: 'lpg',
        cookingFuel: 'lpg',
      });
      expect(minimal.protectionTier).toBe('minimal');

      // Moderate protection tier (30% - 59%)
      const moderate = runWhatIfSimulation({
        ambientPm25: 150,
        householdSize: 2,
        maskGrade: 'cloth',
        purifierRuntimeHours: 10,
        commuteDistanceKm: 5,
        commuteDaysPerWeek: 5,
        baselineCommuteMode: 'car',
        commuteMode: 'car',
        baselineCookingFuel: 'lpg',
        cookingFuel: 'lpg',
      });
      expect(moderate.protectionTier).toBe('moderate');

      // High defense tier (60% - 79%)
      const highDef = runWhatIfSimulation({
        ambientPm25: 200,
        householdSize: 2,
        maskGrade: 'kn95',
        purifierRuntimeHours: 16,
        commuteDistanceKm: 5,
        commuteDaysPerWeek: 5,
        baselineCommuteMode: 'car',
        commuteMode: 'metro',
        baselineCookingFuel: 'lpg',
        cookingFuel: 'induction',
      });
      expect(highDef.protectionTier).toBe('high_defense');

      // Maximum shield tier (>= 80%)
      const maxShield = runWhatIfSimulation({
        ambientPm25: 250,
        householdSize: 4,
        maskGrade: 'n95',
        purifierRuntimeHours: 24,
        commuteDistanceKm: 20,
        commuteDaysPerWeek: 5,
        baselineCommuteMode: 'car',
        commuteMode: 'metro',
        baselineCookingFuel: 'biomassChulha',
        cookingFuel: 'induction',
      });
      expect(maxShield.protectionTier).toBe('maximum_shield');
    });
  });

  describe('communityReports.ts error fallbacks', () => {
    it('handles corrupted localStorage JSON and storage errors gracefully', () => {
      // Mock corrupted JSON in localStorage
      (globalThis as any).window = {
        localStorage: {
          getItem: () => 'corrupted{invalid:json}',
          setItem: () => {},
        },
      };
      const reports = getStoredReports();
      expect(reports.length).toBeGreaterThan(0);

      // Mock throwing localStorage
      (globalThis as any).window = {
        localStorage: {
          getItem: () => {
            throw new Error('Storage failure');
          },
          setItem: () => {
            throw new Error('Storage write quota exceeded');
          },
        },
      };
      expect(getStoredReports().length).toBeGreaterThan(0);
      // saveStoredReports does not throw
      expect(() => saveStoredReports([reports[0]])).not.toThrow();

      // Missing window or window.localStorage
      const origWindow = (globalThis as any).window;
      try {
        (globalThis as any).window = undefined;
        expect(getStoredReports().length).toBeGreaterThan(0);
        expect(() => saveStoredReports([])).not.toThrow();

        (globalThis as any).window = { localStorage: null };
        expect(getStoredReports().length).toBeGreaterThan(0);
        expect(() => saveStoredReports([])).not.toThrow();
      } finally {
        (globalThis as any).window = origWindow;
      }

      // Sanitization in saveStoredReports
      const mockStorage: Record<string, string> = {};
      (globalThis as any).window = {
        localStorage: {
          getItem: (k: string) => mockStorage[k],
          setItem: (k: string, v: string) => {
            mockStorage[k] = v;
          },
        },
      };

      // Non-array input
      saveStoredReports(null as any);

      // Deep sanitization of 55 items, special characters, long strings, negative upvotes, invalid status
      const messyReports = Array.from({ length: 55 }, (_, i) => ({
        id: `!@#id_${i}$%^`,
        neighborhood: 'A'.repeat(150),
        city: 'B'.repeat(150),
        incidentType: 'open_waste_burning' as const,
        severity: 'severe' as const,
        description: 'C'.repeat(600),
        reportedAt: '',
        upvotes: -10,
        status: (i % 2 === 0 ? 'investigating' : 'unknown_status') as any,
        reporterName: '',
      }));

      saveStoredReports(messyReports as any);
      const saved = JSON.parse(mockStorage['vayushield_community_reports']);
      expect(saved.length).toBe(50); // Sliced to 50
      expect(saved[0].id).toBe(`id_${0}`); // Sanitized
      expect(saved[0].neighborhood.length).toBe(100); // Sliced
      expect(saved[0].description.length).toBe(500); // Sliced
      expect(saved[0].upvotes).toBe(0); // Clamped
      expect(saved[0].status).toBe('investigating');
      expect(saved[1].status).toBe('active'); // Fallback from unknown_status
      expect(saved[0].reportedAt).toBe('Just now'); // Fallback
      expect(saved[0].reporterName).toBe('Neighbor'); // Fallback

      // Test mitigated status and empty string fallbacks
      saveStoredReports([
        {
          id: '',
          neighborhood: '',
          city: '',
          incidentType: 'industrial_emission',
          severity: 'moderate',
          description: '',
          reportedAt: '12m ago',
          upvotes: 12,
          status: 'mitigated',
          reporterName: 'Priya Sharma',
        },
      ]);
      const mitigatedSaved = JSON.parse(mockStorage['vayushield_community_reports']);
      expect(mitigatedSaved[0].status).toBe('mitigated');
      expect(mitigatedSaved[0].reporterName).toBe('Priya Sharma');
    });
  });
});
