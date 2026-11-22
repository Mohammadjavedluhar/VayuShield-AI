import React from 'react';
import { AlertTriangle, Flame, TrendingUp } from 'lucide-react';
import { AirQualityData } from '../domain/types';
import { getAqiColorTheme } from '../domain/airQuality';
import { calculateCigaretteEquivalents } from '../domain/impactEngine';
import { Language, translations } from '../i18n/translations';
import { AqiDial } from './live/AqiDial';
import { PollutantGrid } from './live/PollutantGrid';

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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-center">
        <AqiDial
          currentAqi={data.currentAqi}
          categoryLabel={data.categoryLabel}
          dominantPollutant={data.dominantPollutant}
          dominantPollutantLabel={t.dominantPollutant}
          theme={theme}
        />
        <PollutantGrid data={data} />
      </div>

      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.healthAdvisoryTitle}</h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
            {data.healthAdvisory}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{t.hourlyTrendTitle}</h4>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:block">{t.tapToViewSafeHours}</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {data.hourlyForecast.map((hour) => {
            const hTheme = getAqiColorTheme(hour.aqiCategory);
            return (
              <div
                key={hour.time}
                className="flex-shrink-0 flex flex-col items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500 transition w-16 text-center cursor-default"
                title={`${hour.time} — AQI: ${hour.aqi} (${hour.recommendation})`}
              >
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{hour.time}</span>
                <span className={`text-sm font-black my-1 ${hTheme.badgeText}`}>{hour.aqi}</span>
                <div className={`w-2 h-2 rounded-full ${hTheme.progressColor}`} />
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
