import React from 'react';
import {
  AlertTriangle,
  Flame,
  Info,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AirQualityData } from '../domain/types';
import { getAqiColorTheme } from '../domain/airQuality';
import { calculateCigaretteEquivalents } from '../domain/impactEngine';
import { Language, translations } from '../i18n/translations';

interface LiveAqiCardProps {
  data: AirQualityData;
  language: Language;
  onSelectHour?: (hour: number) => void;
}

const getHourSafetyLabel = (isExerciseSafe: boolean, isCommuteWarning: boolean): string => {
  if (isExerciseSafe) return '🏃 Clean';
  if (isCommuteWarning) return '⚠️ Smog';
  return 'Indoor';
};

export const LiveAqiCard: React.FC<LiveAqiCardProps> = ({ data, language }) => {
  const t = translations[language];
  const theme = getAqiColorTheme(data.category);
  const dailyCigarettes = calculateCigaretteEquivalents(data.pm25, 24);

  // AQI needle percentage (0 - 500)
  const aqiPct = Math.min(100, Math.max(0, (data.currentAqi / 500) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span>{t.liveUpdated}: {data.timestamp} • {data.city}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.liveAqiTitle}
          </h2>
        </div>

        {/* Berkeley Earth Cigarette equivalent pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
          <Flame className="w-5 h-5 text-amber-500" />
          <div className="text-left">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Berkeley Earth Equivalent
            </div>
            <div className="text-sm font-extrabold">
              ≈ {dailyCigarettes} cigarettes / day
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Gauge + Pollutant Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-center">
        {/* Left: Giant AQI Dial */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">
            US EPA Composite Index
          </div>

          {/* AQI Numeric */}
          <div className="relative my-2">
            <span className={`text-6xl sm:text-7xl font-black tracking-tighter ${theme.badgeText}`}>
              {data.currentAqi}
            </span>
            <span className="text-xs font-bold text-slate-400 block mt-1">AQI</span>
          </div>

          {/* Status Badge */}
          <div
            className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold border ${theme.badgeBg}`}
          >
            {data.categoryLabel}
          </div>

          {/* Progress bar scale */}
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
            <span>{t.dominantPollutant}: <strong className="text-slate-700 dark:text-slate-200">{data.dominantPollutant}</strong></span>
          </div>
        </div>

        {/* Right: Key Pollutant Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* PM2.5 */}
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

          {/* PM10 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold">PM10</span>
              <span className="text-[10px] font-medium">Coarse Dust</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {data.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Road Dust & Ash
            </div>
          </div>

          {/* NO2 */}
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

          {/* O3 */}
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

          {/* SO2 */}
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

          {/* Clean Hour Status */}
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
      </div>

      {/* Clinical Health Advisory Banner */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {t.healthAdvisoryTitle}
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
            {data.healthAdvisory}
          </p>
        </div>
      </div>

      {/* 24-Hour Diurnal Sparkline / Hour Strip */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.hourlyTrendTitle}
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:block">
            {t.tapToViewSafeHours}
          </span>
        </div>

        {/* Scrollable Hourly Blocks */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {data.hourlyForecast.map((hour) => {
            const hTheme = getAqiColorTheme(hour.aqiCategory);
            return (
              <div
                key={hour.time}
                className="flex-shrink-0 flex flex-col items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500 transition w-16 text-center cursor-default"
                title={`${hour.time} — AQI: ${hour.aqi} (${hour.recommendation})`}
              >
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {hour.time}
                </span>
                <span className={`text-sm font-black my-1 ${hTheme.badgeText}`}>
                  {hour.aqi}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${hTheme.progressColor}`}
                />
                <span className="text-[9px] text-slate-400 mt-1">
                  {getHourSafetyLabel(hour.isExerciseSafe, hour.isCommuteWarning)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
