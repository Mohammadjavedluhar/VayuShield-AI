import React from 'react';
import { Award, Flame, Leaf, ShieldAlert } from 'lucide-react';
import type { HouseholdProfile, ImpactLedgerMetrics } from '../../domain/types';

interface CertifiedBadgeCardProps {
  profile: HouseholdProfile;
  metrics: ImpactLedgerMetrics;
  pledgeName: string;
  badgeTitle: string;
  certificateId: string;
}

export const CertifiedBadgeCard: React.FC<CertifiedBadgeCardProps> = ({
  profile,
  metrics,
  pledgeName,
  badgeTitle,
  certificateId,
}) => {
  return (
    <div className="relative mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white border-2 border-emerald-500/40 shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              Official Clean Air Certificate
            </span>
            <h3 className="text-2xl font-black text-white mt-0.5">
              {badgeTitle}
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs font-semibold text-slate-400">Issued To</div>
          <div className="text-xl font-black text-emerald-300">
            {pledgeName || 'Community Champion'}
          </div>
          <div className="text-xs text-slate-400">{profile.city} • Winter Smog Initiative</div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Smoke Avoided</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {metrics.avoidedCigarettesPerWeek}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Cigarettes-equivalent / week
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CO2 Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {metrics.co2SavedKgPerWeek} <span className="text-base font-normal">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Weekly transport &amp; fuel emissions
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PM2.5 Inhalation Drop</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 mt-2">
            {metrics.inhaledPm25ReductionPct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Verified EPA dose reduction
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-emerald-500/20 text-xs text-slate-400">
        <div>
          Verified by <strong>VayuShield AI</strong> &bull; Berkeley Earth Muller Formula &bull; US EPA 2024 Standard
        </div>
        <div className="font-mono text-[11px] text-emerald-400">
          ID: {certificateId}
        </div>
      </div>
    </div>
  );
};
