import React from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import type { HourlyForecastItem } from '../../domain/types';
import { getAqiColorTheme } from '../../domain/airQuality';

interface HourlyInspectionCardProps {
  activeHour: HourlyForecastItem;
}

export const HourlyInspectionCard: React.FC<HourlyInspectionCardProps> = ({ activeHour }) => {
  const activeTheme = getAqiColorTheme(activeHour.aqiCategory);

  return (
    <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl border ${activeTheme.badgeBg} text-center min-w-[90px]`}>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Forecast</div>
          <div className={`text-3xl font-black ${activeTheme.badgeText}`}>
            {activeHour.aqi}
          </div>
          <div className="text-[10px] font-bold mt-0.5">AQI</div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              {activeHour.time} Routine Recommendation
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${activeTheme.badgeBg}`}>
              {activeHour.aqiCategory}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {activeHour.recommendation}
          </p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
            <span>PM2.5: <strong>{activeHour.pm25} µg/m³</strong></span>
            <span>PM10: <strong>{activeHour.pm10} µg/m³</strong></span>
            <span>NO2: <strong>{activeHour.no2} µg/m³</strong></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {activeHour.isExerciseSafe ? (
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> Exercise Permissible
          </span>
        ) : activeHour.isCommuteWarning ? (
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-4 h-4" /> Commute Warning Peak
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Info className="w-4 h-4" /> Regular Indoor Shielding
          </span>
        )}
      </div>
    </div>
  );
};
