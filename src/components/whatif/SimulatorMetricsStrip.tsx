import React from 'react';
import { SimulatorOutputs } from '../../domain/simulator';

interface SimulatorMetricsStripProps {
  outputs: SimulatorOutputs;
}

export const SimulatorMetricsStrip: React.FC<SimulatorMetricsStripProps> = ({ outputs }) => {
  return (
    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
      <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold text-slate-400">Inhaled PM2.5 Drop</span>
        <div className="text-3xl sm:text-4xl font-black text-cyan-500 my-1">{outputs.inhaledPm25ReductionPct}%</div>
        <span className="text-[11px] text-cyan-700 dark:text-cyan-300">EPA Exposure Model</span>
      </div>

      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold text-slate-400">Avoided Smoke</span>
        <div className="text-3xl sm:text-4xl font-black text-amber-500 my-1">{outputs.avoidedCigarettesWeekly}</div>
        <span className="text-[11px] text-amber-700 dark:text-amber-300">Cigarettes / week (Household)</span>
      </div>

      <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold text-slate-400">CO2 Saved</span>
        <div className="text-3xl sm:text-4xl font-black text-emerald-500 my-1">{outputs.co2SavedWeeklyKg} <span className="text-sm font-normal">kg</span></div>
        <span className="text-[11px] text-emerald-700 dark:text-emerald-300">{outputs.annualCo2SavedKg} kg / year</span>
      </div>

      <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold text-slate-400">Est. Monthly Savings</span>
        <div className="text-3xl sm:text-4xl font-black text-purple-500 my-1">₹{outputs.estimatedMonthlyRupeeSavings}</div>
        <span className="text-[11px] text-purple-700 dark:text-purple-300">Fuel + Health clinic visits</span>
      </div>
    </div>
  );
};
