import React from 'react';
import { CommuteMode, CookingFuel } from '../../domain/types';
import { MaskGrade } from '../../domain/commuteGuard';

interface SimulatorControlsProps {
  commuteDistanceKm: number;
  setCommuteDistanceKm: (val: number) => void;
  purifierHours: number;
  setPurifierHours: (val: number) => void;
  commuteMode: CommuteMode;
  setCommuteMode: (val: CommuteMode) => void;
  maskGrade: MaskGrade;
  setMaskGrade: (val: MaskGrade) => void;
  cookingFuel: CookingFuel;
  setCookingFuel: (val: CookingFuel) => void;
}

const getPurifierRuntimeBadge = (hours: number): string => {
  if (hours >= 20) return 'Continuous Clean';
  if (hours >= 12) return 'Overnight + Evening';
  return 'Part-time';
};

/**
 * SimulatorControls - Interactive sliders and dropdown controls for the What-If sandbox.
 */
export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  commuteDistanceKm,
  setCommuteDistanceKm,
  purifierHours,
  setPurifierHours,
  commuteMode,
  setCommuteMode,
  maskGrade,
  setMaskGrade,
  cookingFuel,
  setCookingFuel,
}) => {
  return (
    <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-1">
        Simulation Parameters
      </div>

      {/* Slider 1: Commute Distance */}
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
          <label htmlFor="whatif-commute-distance">One-Way Commute Distance: {commuteDistanceKm} km</label>
          <span className="text-slate-400">Round trip: {commuteDistanceKm * 2} km</span>
        </div>
        <input
          id="whatif-commute-distance"
          type="range"
          min={2}
          max={40}
          step={1}
          value={commuteDistanceKm}
          onChange={(e) => setCommuteDistanceKm(Number.parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-cyan-500"
        />
      </div>

      {/* Slider 2: Purifier Runtime Hours */}
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
          <label htmlFor="whatif-purifier-hours">Air Purifier / CR Box Runtime: {purifierHours} hours / day</label>
          <span className="text-cyan-500 font-extrabold">
            {getPurifierRuntimeBadge(purifierHours)}
          </span>
        </div>
        <input
          id="whatif-purifier-hours"
          type="range"
          min={0}
          max={24}
          step={1}
          value={purifierHours}
          onChange={(e) => setPurifierHours(Number.parseInt(e.target.value, 10))}
          className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-emerald-500"
        />
      </div>

      {/* Commute Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div>
          <label htmlFor="whatif-commute-mode" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Commute Transition
          </label>
          <select
            id="whatif-commute-mode"
            value={commuteMode}
            onChange={(e) => setCommuteMode(e.target.value as CommuteMode)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold min-h-[44px]"
          >
            <option value="metro">🚇 Electric Metro Train</option>
            <option value="carpool">🚌 Shared Carpool / Bus</option>
            <option value="ev">⚡ Electric Scooter / EV</option>
            <option value="walkOrCycle">🚲 Walking / Cycling (with N95)</option>
            <option value="car">🚗 Solo Car (No change)</option>
          </select>
        </div>

        <div>
          <label htmlFor="whatif-mask-grade" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Outdoor Mask Grade
          </label>
          <select
            id="whatif-mask-grade"
            value={maskGrade}
            onChange={(e) => setMaskGrade(e.target.value as MaskGrade)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold min-h-[44px]"
          >
            <option value="n95">Certified N95 (95% cut)</option>
            <option value="kn95">KN95 Ear Loop (90% cut)</option>
            <option value="surgical">Surgical Mask (35% cut)</option>
            <option value="cloth">Cloth Mask (20% cut)</option>
          </select>
        </div>

        <div>
          <label htmlFor="whatif-cooking-fuel" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Kitchen Cooking Fuel
          </label>
          <select
            id="whatif-cooking-fuel"
            value={cookingFuel}
            onChange={(e) => setCookingFuel(e.target.value as CookingFuel)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold min-h-[44px]"
          >
            <option value="induction">⚡ Clean Induction Plate</option>
            <option value="lpg">🔥 LPG Gas Burner</option>
          </select>
        </div>
      </div>
    </div>
  );
};
