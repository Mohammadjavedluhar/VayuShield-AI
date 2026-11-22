import React from 'react';
import { CheckCircle2, Flame, Zap } from 'lucide-react';
import { CookingFuel, Interventions } from '../../domain/types';

interface CookingSwapGridProps {
  currentFuel: Interventions['cookingFuel'];
  onCookingSelect: (fuel: CookingFuel) => void;
  title: string;
}

export const CookingSwapGrid: React.FC<CookingSwapGridProps> = ({
  currentFuel,
  onCookingSelect,
  title,
}) => {
  return (
    <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-extrabold text-slate-400">{title}</span>
        <span className="text-xs font-semibold text-emerald-500">
          Current: {currentFuel.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onCookingSelect('lpg')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between min-h-[44px] ${
            currentFuel === 'lpg'
              ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-bold'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-xs font-extrabold">Conventional LPG / Gas Burner</div>
              <div className="text-[11px] text-slate-400">~1.5 kg CO2/day + indoor NO2 spikes</div>
            </div>
          </div>
          {currentFuel === 'lpg' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
        </button>

        <button
          onClick={() => onCookingSelect('induction')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between min-h-[44px] ${
            currentFuel === 'induction'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-xs font-extrabold">Clean Induction Cooktop (Recommended)</div>
              <div className="text-[11px] text-slate-400">~0.45 kg CO2/day • 0 indoor combustion gases</div>
            </div>
          </div>
          {currentFuel === 'induction' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        </button>
      </div>
    </div>
  );
};
