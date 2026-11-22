import React, { useState } from 'react';
import { Clock, Sun } from 'lucide-react';
import { AirQualityData, HourlyForecastItem } from '../domain/types';
import { getAqiColorTheme } from '../domain/airQuality';
import { Language, translations } from '../i18n/translations';
import { RoutineCards } from './timeline/RoutineCards';
import { HourlyInspectionCard } from './timeline/HourlyInspectionCard';

interface CleanHourTimelineProps {
  airQuality: AirQualityData;
  language: Language;
}

export const CleanHourTimeline: React.FC<CleanHourTimelineProps> = ({
  airQuality,
  language,
}) => {
  const t = translations[language];
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(0);
  const hourly = airQuality.hourlyForecast;
  const activeHour: HourlyForecastItem = hourly[selectedHourIndex] || hourly[0];

  const afternoonHours = hourly.filter((h) => h.hour >= 12 && h.hour <= 16);
  const bestExercise =
    afternoonHours.length > 0
      ? afternoonHours.reduce((min, h) => (h.aqi < min.aqi ? h : min), afternoonHours[0])
      : hourly[14] || hourly[0];

  const morningCommute = hourly.filter((h) => h.hour >= 7 && h.hour <= 9);
  const morningCommuteAvgAqi =
    morningCommute.length > 0
      ? Math.round(morningCommute.reduce((s, h) => s + h.aqi, 0) / morningCommute.length)
      : Math.round(airQuality.currentAqi * 1.25);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span>Diurnal Thermal Inversion Dynamics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.timelineTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.timelineSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 self-start sm:self-auto">
          <Sun className="w-3.5 h-3.5" />
          <span>Solar Dispersion Peak: 1:00 PM – 4:00 PM</span>
        </div>
      </div>

      <RoutineCards bestExercise={bestExercise} morningCommuteAvgAqi={morningCommuteAvgAqi} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Hourly Visual Smog Forecast (Click any hour to inspect)
          </span>
          <span className="text-xs text-cyan-500 font-semibold">
            Inspecting: {activeHour.time}
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-24 gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {hourly.map((hour, idx) => {
            const hTheme = getAqiColorTheme(hour.aqiCategory);
            const isSelected = idx === selectedHourIndex;
            return (
              <button
                key={hour.time}
                onClick={() => setSelectedHourIndex(idx)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                  isSelected
                    ? 'ring-2 ring-cyan-500 bg-white dark:bg-slate-800 shadow-md scale-105'
                    : 'hover:bg-white/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400">{hour.time.slice(0, 2)}</span>
                <div
                  className={`w-full h-8 sm:h-12 rounded-lg my-1 flex items-end justify-center pb-1 ${hTheme.badgeBg}`}
                >
                  <span className={`text-[10px] sm:text-xs font-black ${hTheme.badgeText}`}>
                    {hour.aqi}
                  </span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${hTheme.progressColor}`} />
              </button>
            );
          })}
        </div>
      </div>

      <HourlyInspectionCard activeHour={activeHour} />
    </div>
  );
};
