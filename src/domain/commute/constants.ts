/**
 * VayuShield AI - Commute Guard Constants
 * Penetration factors, mask filtration efficiencies, and inhalation rates.
 */

export type CommuterType = 'child' | 'elderly' | 'adult' | 'asthma_patient';
export type TravelMode =
  | 'open_walk_cycle'
  | 'two_wheeler'
  | 'auto_rickshaw'
  | 'bus'
  | 'closed_car'
  | 'metro';
export type MaskGrade = 'none' | 'cloth' | 'surgical' | 'kn95' | 'n95';

export const TRAVEL_MODE_PENETRATION: Record<TravelMode, number> = {
  open_walk_cycle: 1.0,
  two_wheeler: 1.0,
  auto_rickshaw: 0.90,
  bus: 0.80,
  closed_car: 0.40,
  metro: 0.30,
};

export const MASK_EFFICIENCY: Record<MaskGrade, number> = {
  none: 0.0,
  cloth: 0.20,
  surgical: 0.35,
  kn95: 0.90,
  n95: 0.95,
};

export const COMMUTER_LABELS: Record<CommuterType, string> = {
  child: 'school child',
  elderly: 'elderly family member',
  asthma_patient: 'asthma patient',
  adult: 'commuter',
};

/**
 * Hourly breathing rates in m³/hour based on EPA Exposure Factors Handbook.
 * @param commuterType - Vulnerability age or clinical group
 * @param travelMode - Commute vehicle or walking mode
 * @returns Inhalation rate in m3/h
 */
export function getBreathingRate(commuterType: CommuterType, travelMode: TravelMode): number {
  let baseHourlyRate = 0.60;

  if (commuterType === 'child') {
    baseHourlyRate = 0.50;
  } else if (commuterType === 'elderly') {
    baseHourlyRate = 0.54;
  } else if (commuterType === 'asthma_patient') {
    baseHourlyRate = 0.58;
  }

  if (travelMode === 'open_walk_cycle') {
    baseHourlyRate *= 1.4;
  } else if (travelMode === 'two_wheeler') {
    baseHourlyRate *= 1.1;
  }

  return Number(baseHourlyRate.toFixed(2));
}
