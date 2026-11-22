import { describe, expect, it } from 'vitest';
import {
  fallbackAsk,
  fallbackIntake,
  fallbackVisionAudit,
} from '../api/_lib/deterministicFallbacks';

describe('Deterministic Fallbacks Coverage - tests/apiFallbacksCoverage.test.ts', () => {
  describe('fallbackIntake', () => {
    it('covers all recognized cities', () => {
      const cities = [
        'noida',
        'gurugram',
        'ghaziabad',
        'faridabad',
        'mumbai',
        'lahore',
        'kolkata',
        'patna',
        'lucknow',
        'chandigarh',
        'beijing',
        'london',
        'salt lake city',
      ];
      for (const c of cities) {
        const res = fallbackIntake(`Family living in ${c}`);
        expect(res.city.toLowerCase()).toBe(c.toLowerCase());
      }
    });

    it('covers all commute modes', () => {
      expect(fallbackIntake('Taking the metro subway train to office').commuteMode).toBe('metro');
      expect(fallbackIntake('Riding a two wheeler scooter bike').commuteMode).toBe('twoWheeler');
      expect(fallbackIntake('Taking public bus daily').commuteMode).toBe('bus');
      expect(fallbackIntake('Walking and cycle commute').commuteMode).toBe('walkOrCycle');
      expect(fallbackIntake('Using carpool ride share').commuteMode).toBe('carpool');
      expect(fallbackIntake('Driving an electric vehicle EV').commuteMode).toBe('ev');
    });

    it('covers all cooking fuels and heating sources', () => {
      expect(fallbackIntake('Cooking on biomass chulha wood').cookingFuel).toBe('biomassChulha');
      expect(fallbackIntake('Using electric induction stove').cookingFuel).toBe('induction');
      expect(fallbackIntake('Cooking on piped gas PNG').cookingFuel).toBe('pipedGas');

      expect(fallbackIntake('Using unvented gas heater blower').heatingSource).toBe('unventedHeater');
      expect(fallbackIntake('Heating with electric oil radiator heater').heatingSource).toBe('electricHeater');
      expect(fallbackIntake('Heating with firewood angithi').heatingSource).toBe('firewood');
    });

    it('covers medical flags and family sizes', () => {
      const res = fallbackIntake(
        'Household of 6 people with asthma inhaler, heart condition copd, school kid, elderly grandfather, and pregnant mother commuting 25 km with hepa purifier and n95 mask'
      );
      expect(res.householdSize).toBe(6);
      expect(res.hasAsthma).toBe(true);
      expect(res.hasCopdOrCardiac).toBe(true);
      expect(res.hasChildren).toBe(true);
      expect(res.hasElderly).toBe(true);
      expect(res.isPregnant).toBe(true);
      expect(res.commuteDistanceKm).toBe(25);
      expect(res.hasAirPurifier).toBe(true);
      expect(res.wearsMaskOutdoors).toBe(true);
      expect(res.explanation).toContain('Asthma');
      expect(res.explanation).toContain('Cardiovascular');
      expect(res.explanation).toContain('Elderly');
      expect(res.explanation).toContain('Children');
      expect(res.explanation).toContain('Pregnancy');
    });
  });

  describe('fallbackVisionAudit', () => {
    it('covers all room context branches', () => {
      // Mask context
      const maskAudit = fallbackVisionAudit('n95 mask fit photo');
      expect(maskAudit.scanCategory).toBe('mask_fit');
      expect(maskAudit.maskFitAnalysis?.fitStatus).toBe('leaky_gaps');

      // Filter context
      const filterAudit = fallbackVisionAudit('dusty air purifier filter replacement');
      expect(filterAudit.scanCategory).toBe('filter_condition');
      expect(filterAudit.filterConditionAnalysis?.saturationLevel).toBe('critically_saturated');

      // Kitchen context
      const kitchenAudit = fallbackVisionAudit('kitchen cooking smoke chulha');
      expect(kitchenAudit.scanCategory).toBe('room_indoor');
      expect(kitchenAudit.roomType).toContain('Kitchen');

      // Street / outdoor smog context
      const streetAudit = fallbackVisionAudit('outside street window smog');
      expect(streetAudit.scanCategory).toBe('outdoor_smog');
      expect(streetAudit.roomType).toContain('Window');

      // Default bedroom / living room context
      const defaultAudit = fallbackVisionAudit('living room');
      expect(defaultAudit.scanCategory).toBe('room_indoor');
      expect(defaultAudit.crBoxRecommended).toBe(true);

      // Undefined or empty context fallback
      const undefinedAudit = fallbackVisionAudit();
      expect(undefinedAudit.scanCategory).toBe('room_indoor');
      const emptyAudit = fallbackVisionAudit('');
      expect(emptyAudit.scanCategory).toBe('room_indoor');
    });
  });

  describe('fallbackAsk', () => {
    it('covers all specific knowledge queries', () => {
      // Outdoor exercise query
      const exercise = fallbackAsk('Is it safe to run and jog outdoors in morning?');
      expect(exercise.answer).toContain('outdoor morning exercise');
      expect(exercise.isGrounded).toBe(true);

      // Corsi Rosenthal box query
      const cr = fallbackAsk('How to build a DIY Corsi Rosenthal box purifier?');
      expect(cr.answer).toContain('Corsi-Rosenthal Box');
      expect(cr.isGrounded).toBe(true);

      // N95 masks query
      const mask = fallbackAsk('What cloth mask or N95 should I wear outdoors?');
      expect(mask.answer).toContain('N95');
      expect(mask.isGrounded).toBe(true);

      // Cigarette Berkeley Earth query
      const cig = fallbackAsk('How does PM2.5 compare to cigarette smoking in Berkeley formula?');
      expect(cig.answer).toContain('Berkeley Earth formula');
      expect(cig.isGrounded).toBe(true);

      // General query with context
      const general = fallbackAsk('What is the general air advice?', {
        city: 'Jaipur',
        aqi: 220,
        pm25: 140,
      });
      expect(general.answer).toContain('Jaipur');
      expect(general.answer).toContain('220');
      expect(general.isGrounded).toBe(true);
    });
  });
});
