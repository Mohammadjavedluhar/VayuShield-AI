/**
 * VayuShield AI - Indoor Mass Balance Constants
 * Penetration factors, emission rates, and ventilation standards for EPA modeling.
 */

export type WindowSealType = 'weathersealed' | 'standard_closed' | 'leaky_drafty' | 'open_windows';
export type IndoorCookingType = 'induction' | 'lpg_with_exhaust' | 'lpg_unvented' | 'biomass_chulha';
export type IncenseType = 'none' | 'single_stick' | 'multiple_dhoop';
export type VentilationRateType = 'low_sealed' | 'moderate_natural' | 'high_draft';
export type AirPurifierType = 'none' | 'diy_corsi_rosenthal' | 'hepa_h13' | 'dual_purifiers';

// Penetration factors P (fraction of outdoor PM2.5 entering building envelope)
export const PENETRATION_FACTORS: Record<WindowSealType, number> = {
  weathersealed: 0.40,
  standard_closed: 0.65,
  leaky_drafty: 0.85,
  open_windows: 1.00,
};

// Air exchange rate a (ACH = Air Changes per Hour, h^-1)
export const AIR_EXCHANGE_RATES: Record<VentilationRateType, number> = {
  low_sealed: 0.35,
  moderate_natural: 0.65,
  high_draft: 1.30,
};

// Indoor Source Generation Rates S (µg/hour)
export const COOKING_SOURCE_RATES_UG_H: Record<IndoorCookingType, number> = {
  induction: 0,
  lpg_with_exhaust: 850,
  lpg_unvented: 4500,
  biomass_chulha: 19500,
};

export const INCENSE_SOURCE_RATES_UG_H: Record<IncenseType, number> = {
  none: 0,
  single_stick: 2600,
  multiple_dhoop: 7200,
};

// CADR in m³/h (1 CFM = 1.699011 m³/h)
export const AIR_PURIFIER_CADR_M3_H: Record<AirPurifierType, { cadrM3H: number; cadrCfm: number }> = {
  none: { cadrM3H: 0, cadrCfm: 0 },
  diy_corsi_rosenthal: { cadrM3H: 595, cadrCfm: 350 },
  hepa_h13: { cadrM3H: 374, cadrCfm: 220 },
  dual_purifiers: { cadrM3H: 934, cadrCfm: 550 },
};

// Surface deposition loss rate k (approx 0.35 h^-1 for fine PM2.5)
export const SURFACE_DEPOSITION_RATE_K = 0.35;
