import React from 'react';
import { Info } from 'lucide-react';

interface AqiDialProps {
  currentAqi: number;
  categoryLabel: string;
  dominantPollutant: string;
  dominantPollutantLabel: string;
  theme: {
    badgeBg: string;
    badgeText: string;
    progressColor: string;
    border: string;
  };
}

export const AqiDial: React.FC<AqiDialProps> = ({
  currentAqi,
  categoryLabel,
  dominantPollutant,
  dominantPollutantLabel,
  theme,
}) => {
  const aqiPct = Math.min(100, Math.max(0, (currentAqi / 500) * 100));

  return (
    <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-center">
      <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">
        US EPA Composite Index
      </div>

      <div className="relative my-2">
        <span className={`text-6xl sm:text-7xl font-black tracking-tighter ${theme.badgeText}`}>
          {currentAqi}
        </span>
        <span className="text-xs font-bold text-slate-400 block mt-1">AQI</span>
      </div>

      <div className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold border ${theme.badgeBg}`}>
        {categoryLabel}
      </div>

      <div className="w-full mt-6">
        <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
          <span>0 (Good)</span>
          <span>150</span>
          <span>300</span>
          <span>500+ (Severe)</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${theme.progressColor}`}
            style={{ width: `${Math.max(5, aqiPct)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-cyan-500" />
        <span>{dominantPollutantLabel}: <strong className="text-slate-700 dark:text-slate-200">{dominantPollutant}</strong></span>
      </div>
    </div>
  );
};
