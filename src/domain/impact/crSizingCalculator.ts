/**
 * VayuShield AI - Corsi-Rosenthal Box Sizing Calculator
 * Computes ACH (air changes per hour) and required CADR (CFM) for DIY filtration.
 */

import type { CorsiRosenthalSizing } from '../types';

/**
 * Computes Corsi-Rosenthal box sizing parameters, ACH clearance time, and cost savings.
 * @param roomAreaSqFt - Floor area in square feet
 * @param ceilingHeightFt - Ceiling height in feet (default: 9)
 * @param targetAch - Target air changes per hour (default: 5)
 * @returns CorsiRosenthalSizing metrics
 */
export function calculateCorsiRosenthalSizing(
  roomAreaSqFt: number,
  ceilingHeightFt: number = 9,
  targetAch: number = 5
): CorsiRosenthalSizing {
  const area = Math.max(50, roomAreaSqFt);
  const height = Math.max(7, Math.min(20, ceilingHeightFt));
  const ach = Math.max(2, Math.min(12, targetAch));

  const roomVolumeCuFt = area * height;
  const requiredCadrCfm = Math.round((roomVolumeCuFt * ach) / 60);

  const unitCapacityCfm = 350;
  const recommendedUnits = Math.max(1, Math.ceil(requiredCadrCfm / unitCapacityCfm));
  const timeTo90PctClearanceMinutes = Math.round((2.302585 / ach) * 60);

  const diyCostEstimateInr = 2800 * recommendedUnits;
  const commercialHepaCostInr = 14500 * recommendedUnits;
  const savingsPct = Math.round(((commercialHepaCostInr - diyCostEstimateInr) / commercialHepaCostInr) * 100);

  return {
    roomAreaSqFt: area,
    ceilingHeightFt: height,
    roomVolumeCuFt,
    targetAch: ach,
    requiredCadrCfm,
    recommendedUnits,
    timeTo90PctClearanceMinutes,
    diyCostEstimateInr,
    commercialHepaCostInr,
    savingsPct,
  };
}
