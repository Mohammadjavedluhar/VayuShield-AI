import React from 'react';
import type { IndoorEstimatorResult } from '../../domain/indoorModel';

interface IndoorGaugesProps {
  city: string;
  result: IndoorEstimatorResult;
  outdoorTheme: { badgeText: string; badgeBg: string };
  indoorTheme: { badgeText: string; badgeBg: string };
}

export const IndoorGauges: React.FC<IndoorGaugesProps> = ({
  city,
  result,
  outdoorTheme,
  indoorTheme,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
      <div className="md:col-span-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-between min-h-[220px]">
        <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
          Outdoor Atmosphere ({city})
        </div>
        <div className="my-2">
          <span className={`text-6xl font-black tracking-tight ${outdoorTheme.badgeText}`}>
            {result.outdoorAqi}
          </span>
          <span className="text-xs font-bold text-slate-400 block mt-1">AQI</span>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {result.outdoorPm25} <span className="text-xs font-normal text-slate-400">µg/m³ PM2.5</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Direct ambient Open-Meteo feed</div>
        </div>
      </div>

      <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-extrabold flex items-center justify-center shadow-md">
          VS
        </div>
        <span className="text-[11px] font-bold text-emerald-500 mt-2">
          {result.ratioIndoorOutdoor < 1
            ? `${Math.round((1 - result.ratioIndoorOutdoor) * 100)}% Cleaner`
            : 'Pollution Trapped'}
        </span>
      </div>

      <div className="md:col-span-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-between min-h-[220px]">
        <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
          Estimated Indoor Living Area
        </div>
        <div className="my-2">
          <span className={`text-6xl font-black tracking-tight ${indoorTheme.badgeText}`}>
            {result.indoorAqi}
          </span>
          <span className="text-xs font-bold text-slate-400 block mt-1">AQI</span>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {result.indoorPm25} <span className="text-xs font-normal text-slate-400">µg/m³ PM2.5</span>
          </div>
          <div className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold border mt-1 ${indoorTheme.badgeBg}`}>
            {result.ventilationRating === 'sealed_clean'
              ? 'Safe Clean Haven'
              : result.ventilationRating === 'moderate'
              ? 'Moderate Infiltration'
              : 'Hazardous Infiltration'}
          </div>
        </div>
      </div>
    </div>
  );
};
