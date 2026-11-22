import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { AirQualityData } from '../../domain/types';

interface PollutantGridProps {
  data: AirQualityData;
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ data }) => {
  return (
    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-bold">PM2.5</span>
          <span className="text-[10px] font-medium">Fine Dust</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {data.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {data.pm25 > 125 ? 'High Lung Penetration' : 'Moderate Inhalation'}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-bold">PM10</span>
          <span className="text-[10px] font-medium">Coarse Dust</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {data.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Road Dust &amp; Ash
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-bold">NO2</span>
          <span className="text-[10px] font-medium">Vehicular / Gas</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {data.no2} <span className="text-xs font-normal text-slate-400">µg/m³</span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Airway Irritant
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-bold">Ozone (O3)</span>
          <span className="text-[10px] font-medium">Smog Gas</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {data.o3 ?? 38} <span className="text-xs font-normal text-slate-400">µg/m³</span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Secondary Smog
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-bold">SO2</span>
          <span className="text-[10px] font-medium">Industrial</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {data.so2 ?? 16} <span className="text-xs font-normal text-slate-400">µg/m³</span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Sulfur Traces
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
        <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 mb-1">
          <span className="font-bold">Best Window</span>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
          1:00 PM – 4:00 PM
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          Solar boundary mixing
        </div>
      </div>
    </div>
  );
};
