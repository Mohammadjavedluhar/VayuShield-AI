import React from 'react';
import type { CorsiRosenthalSizing } from '../../domain/types';

interface CrStatsGridProps {
  sizing: CorsiRosenthalSizing;
}

export const CrStatsGrid: React.FC<CrStatsGridProps> = ({ sizing }) => {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Required CADR</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {sizing.requiredCadrCfm}
          </div>
          <span className="text-[10px] text-slate-500">CFM clean air</span>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Recommended Units</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {sizing.recommendedUnits}
          </div>
          <span className="text-[10px] text-slate-500">20" Box Fan Units</span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">90% Clearance</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {sizing.timeTo90PctClearanceMinutes} <span className="text-sm font-normal">min</span>
          </div>
          <span className="text-[10px] text-slate-500">Fast room scrub</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Estimated Savings</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {sizing.savingsPct}%
          </div>
          <span className="text-[10px] text-slate-500">vs commercial HEPA</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
        <div>
          <span className="text-slate-500 block">DIY Cost (Box fan + 4 MERV-13 filters + tape):</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
            ₹{sizing.diyCostEstimateInr} INR
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 block">Commercial HEPA Equivalent ({sizing.requiredCadrCfm} CFM):</span>
          <span className="font-extrabold text-slate-400 line-through text-base">
            ₹{sizing.commercialHepaCostInr} INR
          </span>
        </div>
      </div>
    </>
  );
};
