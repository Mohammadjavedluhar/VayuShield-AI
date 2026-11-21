import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Dumbbell,
  GraduationCap,
  Info,
  Moon,
  ShieldCheck,
  Sun,
  Wind,
} from 'lucide-react';
import { AirQualityData, HourlyForecastItem } from '../domain/types';
import { getAqiColorTheme } from '../domain/airQuality';
import { Language, translations } from '../i18n/translations';

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

  // Safest exercise window (best afternoon hour)
  const afternoonHours = hourly.filter((h) => h.hour >= 12 && h.hour <= 16);
  const bestExercise =
    afternoonHours.length > 0
      ? afternoonHours.reduce((min, h) => (h.aqi < min.aqi ? h : min), afternoonHours[0])
      : hourly[14] || hourly[0];

  // Morning commute (7 to 9 AM)
  const morningCommute = hourly.filter((h) => h.hour >= 7 && h.hour <= 9);
  const morningCommuteAvgAqi =
    morningCommute.length > 0
      ? Math.round(morningCommute.reduce((s, h) => s + h.aqi, 0) / morningCommute.length)
      : Math.round(airQuality.currentAqi * 1.25);

  const activeTheme = getAqiColorTheme(activeHour.aqiCategory);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Header */}
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

      {/* Routine Safe-Windows High-Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {/* 1. Exercise Window */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider">Exercise / Running</span>
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
              {bestExercise ? `${bestExercise.time} – ${(bestExercise.hour + 2) % 24}:00` : '1:00 PM – 3:30 PM'}
            </div>
            <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              AQI ~{bestExercise ? bestExercise.aqi : 160} (Lowest of Day)
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Thermal boundary layer lifts due to solar heating, diluting ground smog. Safest period for outdoor errands.
          </p>
        </div>

        {/* 2. Morning Commute Alert */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
              <span className="text-xs font-bold uppercase tracking-wider">School / Office Run</span>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
              7:00 AM – 9:30 AM
            </div>
            <div className="text-xs font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
              AQI ~{morningCommuteAvgAqi} (Smog Peak)
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Severe nocturnal cold inversion traps vehicle exhaust & smoke at ground level. Certified N95 mandatory.
          </p>
        </div>

        {/* 3. Filtered Cross-Ventilation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400">
              <span className="text-xs font-bold uppercase tracking-wider">Filtered Air Exchange</span>
              <Wind className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
              1:30 PM – 2:30 PM
            </div>
            <div className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">
              {bestExercise && bestExercise.aqi < 150 ? 'Permissible 15 min' : 'Keep Windows Closed'}
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Flush indoor CO2 build-up only during minimum outdoor PM2.5 hour, then resume full filtration immediately.
          </p>
        </div>

        {/* 4. Night Sleep Air Management */}
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
              <span className="text-xs font-bold uppercase tracking-wider">Nighttime Air Boost</span>
              <Moon className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
              10:00 PM – 6:00 AM
            </div>
            <div className="text-xs font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
              Run Filter Medium-High
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Colder night air accelerates indoor draft infiltration. Keep doors closed and run CR-box near bedroom center.
          </p>
        </div>
      </div>

      {/* Interactive 24-Hour Timeline Bar Strip */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Hourly Visual Smog Forecast (Click any hour to inspect)
          </span>
          <span className="text-xs text-cyan-500 font-semibold">
            Inspecting: {activeHour.time}
          </span>
        </div>

        {/* Visual Timeline Bar */}
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

      {/* Selected Hour Deep Inspection Card */}
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
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${activeTheme.badgeBg}`}
              >
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
    </div>
  );
};
