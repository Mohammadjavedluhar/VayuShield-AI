import React from 'react';
import { Wind } from 'lucide-react';
import { CorsiRosenthalSizing } from '../../domain/types';

interface CrBoxSizingCardProps {
  crBoxSizing: CorsiRosenthalSizing;
  title: string;
  onOpenCrModal: () => void;
}

export const CrBoxSizingCard: React.FC<CrBoxSizingCardProps> = ({
  crBoxSizing,
  title,
  onOpenCrModal,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 border border-emerald-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-400">
            <Wind className="w-4 h-4" />
            <span>{title}</span>
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {crBoxSizing.recommendedUnits} x 4-Filter MERV-13 Box Fan Unit
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Delivers {crBoxSizing.requiredCadrCfm} CFM of certified particulate filtration. Cleans 90% of indoor smoke in {crBoxSizing.timeTo90PctClearanceMinutes} minutes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">DIY Cost vs Commercial</div>
            <div className="text-lg font-black text-emerald-500">
              ₹{crBoxSizing.diyCostEstimateInr}{' '}
              <span className="text-xs text-slate-400 line-through">₹{crBoxSizing.commercialHepaCostInr}</span>
            </div>
            <div className="text-[10px] font-bold text-emerald-400">Save {crBoxSizing.savingsPct}%</div>
          </div>
          <button onClick={onOpenCrModal} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition min-h-[44px]">
            Build Guide
          </button>
        </div>
      </div>
    </div>
  );
};
