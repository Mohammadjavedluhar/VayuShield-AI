import React from 'react';
import { Dumbbell, GraduationCap, Moon, Wind } from 'lucide-react';
import type { HourlyForecastItem } from '../../domain/types';

interface RoutineCardsProps {
  bestExercise: HourlyForecastItem | undefined;
  morningCommuteAvgAqi: number;
}

export const RoutineCards: React.FC<RoutineCardsProps> = ({
  bestExercise,
  morningCommuteAvgAqi,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
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
          Severe nocturnal cold inversion traps vehicle exhaust &amp; smoke at ground level. Certified N95 mandatory.
        </p>
      </div>

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
  );
};
