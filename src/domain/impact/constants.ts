/**
 * VayuShield AI - Impact Constants
 * Emission factors, baseline inhalation rates, and Berkeley Earth constants.
 */

import type { CommuteMode, CookingFuel } from '../types';

// Berkeley Earth constant: 22 ug/m3 for 24 hours equals 1 cigarette
export const BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE = 528; // 22 * 24

// Default adult daily inhalation volume in m3 (approx 0.6 m3/h * 24h = 14.4 m3/day)
export const DEFAULT_DAILY_INHALATION_M3 = 14.4;
export const DEFAULT_HOURLY_INHALATION_M3 = 0.6;

// Baseline indoor infiltration ratio without active filtration (I/O ratio)
export const BASELINE_INDOOR_INFILTRATION_RATIO = 0.70;

// Emission factors (kg CO2 per passenger km)
export const CO2_EMISSION_FACTORS: Record<CommuteMode, number> = {
  car: 0.170,        // Single-occupancy gasoline sedan
  carpool: 0.085,    // Shared car (2-3 passengers)
  twoWheeler: 0.070, // 100-150cc petrol motorcycle / scooter
  bus: 0.060,        // Urban diesel/CNG bus
  metro: 0.035,      // Electric mass rapid transit
  ev: 0.045,         // Electric 2-wheeler / EV (grid-charged)
  walkOrCycle: 0.0,  // Active human mobility
};

// Daily cooking CO2 equivalent emissions in kg
export const COOKING_DAILY_CO2_KG: Record<CookingFuel, number> = {
  lpg: 1.50,            // ~1.5 hours LPG burner usage
  biomassChulha: 2.50,  // Fuelwood / dung cake combustion with high particulate + GHG
  induction: 0.45,      // Induction cooktop on standard electric grid
  pipedGas: 1.35,       // Piped natural gas (PNG)
};
