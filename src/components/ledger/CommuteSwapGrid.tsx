import React from 'react';
import { Bike, Bus, Car, Train, Zap } from 'lucide-react';
import { CommuteMode, Interventions } from '../../domain/types';

interface CommuteSwapGridProps {
  currentMode: Interventions['commuteMode'];
  onCommuteSelect: (mode: CommuteMode) => void;
  title: string;
}

const COMMUTE_OPTIONS = [
  { id: 'car', label: 'Solo Car', icon: Car, ef: '0.17 kg/km' },
  { id: 'carpool', label: 'Carpool', icon: Bus, ef: '0.08 kg/km' },
  { id: 'metro', label: 'Metro Train', icon: Train, ef: '0.035 kg/km' },
  { id: 'ev', label: 'Electric EV', icon: Zap, ef: '0.045 kg/km' },
  { id: 'walkOrCycle', label: 'Cycle / Walk', icon: Bike, ef: '0.0 kg/km' },
] as const;

export const CommuteSwapGrid: React.FC<CommuteSwapGridProps> = ({
  currentMode,
  onCommuteSelect,
  title,
}) => {
  return (
    <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-extrabold text-slate-400">
          {title} (Choose sustainable commute)
        </span>
        <span className="text-xs font-semibold text-emerald-500">
          Current: {currentMode.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {COMMUTE_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onCommuteSelect(item.id as CommuteMode)}
              className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[44px] ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
              }`}
            >
              <Icon className="w-5 h-5 mb-1 text-cyan-500" />
              <span className="text-xs font-bold">{item.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{item.ef}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
