import React from 'react';
import { Flame, Leaf, Shield, Sparkles } from 'lucide-react';
import { ImpactLedgerMetrics } from '../../domain/types';

interface LedgerMetricsCardsProps {
  metrics: ImpactLedgerMetrics;
  inhaledDropText: string;
  cigarettesAvoidedText: string;
  co2SavedText: string;
}

/**
 * LedgerMetricsCards - Grid of 4 live-calculated scientific impact cards.
 */
export const LedgerMetricsCards: React.FC<LedgerMetricsCardsProps> = ({
  metrics,
  inhaledDropText,
  cigarettesAvoidedText,
  co2SavedText,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {/* Metric 1: Inhaled PM2.5 Reduction */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 flex flex-col justify-between">
        <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400">
          <span className="text-xs font-extrabold uppercase tracking-wider">{inhaledDropText}</span>
          <Shield className="w-4 h-4" />
        </div>
        <div className="my-3">
          <span className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
            {metrics.inhaledPm25ReductionPct}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
            {metrics.protectedInhaledPm25DoseUgPerDay} µg vs {metrics.baselineInhaledPm25DoseUgPerDay} µg/day
          </span>
        </div>
        <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">
          EPA Inhalation Dose Model
        </div>
      </div>

      {/* Metric 2: Avoided Cigarettes */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex flex-col justify-between">
        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
          <span className="text-xs font-extrabold uppercase tracking-wider">{cigarettesAvoidedText}</span>
          <Flame className="w-4 h-4" />
        </div>
        <div className="my-3">
          <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
            {metrics.avoidedCigarettesPerWeek}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
            ≈ {metrics.avoidedCigarettesPerDay} cigarettes saved / day
          </span>
        </div>
        <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
          Berkeley Earth Formula (22 µg/m³ = 1 cig)
        </div>
      </div>

      {/* Metric 3: CO2 Saved */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
          <span className="text-xs font-extrabold uppercase tracking-wider">{co2SavedText}</span>
          <Leaf className="w-4 h-4" />
        </div>
        <div className="my-3">
          <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.co2SavedKgPerWeek} <span className="text-lg">kg</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
            Avoided from commute &amp; clean cooking
          </span>
        </div>
        <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
          EPA &amp; DEFRA Transport Factors
        </div>
      </div>

      {/* Metric 4: Risk Reduction Score */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 flex flex-col justify-between">
        <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
          <span className="text-xs font-extrabold uppercase tracking-wider">Composite Risk Score</span>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="my-3">
          <span className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">
            {metrics.riskReductionScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
            {metrics.cleanAirHoursGainedPerDay} hours clean air / day
          </span>
        </div>
        <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
          Comprehensive Household Defense
        </div>
      </div>
    </div>
  );
};
