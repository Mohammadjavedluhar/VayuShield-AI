import React from 'react';
import { calculateCollectiveSocietyImpact } from '../../domain/communityReports';

interface SocietyImpactCardProps {
  societyFamiliesCount: number;
  setSocietyFamiliesCount: (count: number) => void;
}

/**
 * SocietyImpactCard - Collective society impact calculator showing pooled community savings.
 */
export const SocietyImpactCard: React.FC<SocietyImpactCardProps> = ({
  societyFamiliesCount,
  setSocietyFamiliesCount,
}) => {
  const societyImpact = calculateCollectiveSocietyImpact(societyFamiliesCount);

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 border border-emerald-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Collective Society Impact Calculator
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Impact of {societyFamiliesCount} Pledged Neighborhood Families
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            When apartments and RWAs ban open leaf burning and organize shared metro carpools, collective community emission reductions scale dramatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="watch-society-families" className="text-xs font-bold text-slate-300">Pledged Families:</label>
          <input
            id="watch-society-families"
            type="range"
            min={5}
            max={150}
            step={5}
            value={societyFamiliesCount}
            onChange={(e) => setSocietyFamiliesCount(Number.parseInt(e.target.value, 10))}
            className="w-28 h-2 rounded-lg bg-slate-800 accent-emerald-500"
          />
          <span className="text-sm font-black text-emerald-400 w-8">{societyFamiliesCount}</span>
        </div>
      </div>

      {/* Collective Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avoided PM2.5</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {societyImpact.weeklyAvoidedPm25Kg} <span className="text-xs font-normal">kg</span>
          </div>
          <span className="text-[10px] text-slate-400">Weekly prevented emissions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">CO2 Saved</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {societyImpact.weeklySavedCo2Kg} <span className="text-xs font-normal">kg</span>
          </div>
          <span className="text-[10px] text-slate-400">Carpool / transit shift</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Smoke Avoided</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {societyImpact.weeklyAvoidedCigarettes}
          </div>
          <span className="text-[10px] text-slate-400">Cigarettes equiv / week</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Health Savings</span>
          <div className="text-2xl font-black text-purple-400 mt-1">
            ₹{(societyImpact.annualCommunityHealthSavingsInr / 1000).toFixed(0)}k
          </div>
          <span className="text-[10px] text-slate-400">Annual clinic visits avoided</span>
        </div>
      </div>
    </div>
  );
};
