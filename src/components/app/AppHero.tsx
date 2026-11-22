import React from 'react';
import { Sparkles } from 'lucide-react';
import { ImpactLedgerMetrics } from '../../domain/types';

interface AppHeroProps {
  subtitle: string;
  impactMetrics: ImpactLedgerMetrics;
}

export const AppHero: React.FC<AppHeroProps> = ({ subtitle, impactMetrics }) => {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hack2Skill Urban Air Quality Challenge &bull; Production GenAI</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              VayuShield <span className="bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{subtitle}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="px-3 py-1 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Inhaled PM2.5</span>
              <span className="text-lg sm:text-xl font-black text-cyan-500">-{impactMetrics.inhaledPm25ReductionPct}%</span>
            </div>
            <div className="px-3 py-1 text-center border-x border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Smoke Avoided</span>
              <span className="text-lg sm:text-xl font-black text-amber-500">{impactMetrics.avoidedCigarettesPerWeek} <span className="text-xs font-normal">cigs/wk</span></span>
            </div>
            <div className="px-3 py-1 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">CO2 Saved</span>
              <span className="text-lg sm:text-xl font-black text-emerald-500">{impactMetrics.co2SavedKgPerWeek} <span className="text-xs font-normal">kg/wk</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
