import React from 'react';
import { Shield, ShieldCheck, Sparkles, Wind } from 'lucide-react';
import { CommuteMode, CookingFuel, Interventions } from '../../domain/types';
import { CommuteSwapGrid } from './CommuteSwapGrid';
import { CookingSwapGrid } from './CookingSwapGrid';

interface LedgerInterventionTogglesProps {
  interventions: Interventions;
  onToggle: (key: keyof Interventions) => void;
  onCommuteSelect: (mode: CommuteMode) => void;
  onCookingSelect: (fuel: CookingFuel) => void;
  toggleN95: string;
  toggleN95Sub: string;
  togglePurifier: string;
  togglePurifierSub: string;
  toggleSealing: string;
  toggleWetMopping: string;
  toggleCommute: string;
  toggleCooking: string;
}

export const LedgerInterventionToggles: React.FC<LedgerInterventionTogglesProps> = ({
  interventions,
  onToggle,
  onCommuteSelect,
  onCookingSelect,
  toggleN95,
  toggleN95Sub,
  togglePurifier,
  togglePurifierSub,
  toggleSealing,
  toggleWetMopping,
  toggleCommute,
  toggleCooking,
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
        Personalized Sustainable Interventions &amp; Swaps
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onToggle('useN95Mask')}
          className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
            interventions.useN95Mask
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-900 dark:text-cyan-100'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${interventions.useN95Mask ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm">{toggleN95}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{toggleN95Sub}</div>
            </div>
          </div>
          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${interventions.useN95Mask ? 'bg-cyan-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}>
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onToggle('useAirPurifier')}
          className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
            interventions.useAirPurifier
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${interventions.useAirPurifier ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm">{togglePurifier}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{togglePurifierSub}</div>
            </div>
          </div>
          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${interventions.useAirPurifier ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}>
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onToggle('roomSealImprovement')}
          className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
            interventions.roomSealImprovement
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-100'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${interventions.roomSealImprovement ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm">{toggleSealing}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Cuts cold draft leaks by ~35%</div>
            </div>
          </div>
          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${interventions.roomSealImprovement ? 'bg-amber-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}>
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onToggle('wetMoppingDaily')}
          className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
            interventions.wetMoppingDaily
              ? 'bg-teal-500/10 border-teal-500/40 text-teal-900 dark:text-teal-100'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${interventions.wetMoppingDaily ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm">{toggleWetMopping}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Captures dust without resuspension</div>
            </div>
          </div>
          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${interventions.wetMoppingDaily ? 'bg-teal-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}>
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </div>
        </button>
      </div>

      <CommuteSwapGrid currentMode={interventions.commuteMode} onCommuteSelect={onCommuteSelect} title={toggleCommute} />
      <CookingSwapGrid currentFuel={interventions.cookingFuel} onCookingSelect={onCookingSelect} title={toggleCooking} />
    </div>
  );
};
