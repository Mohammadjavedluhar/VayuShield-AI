import React, { useState } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import {
  analyzeMorningCommute,
  CommuterType,
  MaskGrade,
  TravelMode,
} from '../domain/commuteGuard';
import { Language } from '../i18n/translations';
import { CommuteControls } from './commute/CommuteControls';
import { CommuteVerdictBanner } from './commute/CommuteVerdictBanner';

interface CommuteGuardCardProps {
  outdoorPm25: number;
  city: string;
  language?: Language;
}

const RISK_THEMES: Record<string, string> = {
  critical: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30',
  high: 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/30',
  moderate: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30',
};

export const CommuteGuardCard: React.FC<CommuteGuardCardProps> = ({
  outdoorPm25,
  city,
}) => {
  const [commuterType, setCommuterType] = useState<CommuterType>('child');
  const [departureTime, setDepartureTime] = useState<string>('07:15');
  const durationMinutes = 35;
  const [travelMode, setTravelMode] = useState<TravelMode>('bus');
  const [currentMask, setCurrentMask] = useState<MaskGrade>('cloth');

  const verdict = analyzeMorningCommute({
    outdoorPm25,
    departureTime,
    durationMinutes,
    commuterType,
    travelMode,
    currentMask,
  });

  const verdictTheme = RISK_THEMES[verdict.inversionRiskLevel] || RISK_THEMES.low;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Thermal Inversion &amp; School Commute Protection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            School &amp; Elderly Morning Commute Guard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Calculates exact inhaled particulate dosage during peak nocturnal cold layer compression (6:30 AM – 9:00 AM) against WHO safe budgets.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold border self-start sm:self-auto ${verdictTheme}`}>
          <Clock className="w-4 h-4" />
          <span>Inversion Risk: {verdict.inversionRiskLevel.toUpperCase()}</span>
        </div>
      </div>

      <CommuteControls
        commuterType={commuterType}
        departureTime={departureTime}
        travelMode={travelMode}
        currentMask={currentMask}
        onCommuterTypeChange={setCommuterType}
        onDepartureTimeChange={setDepartureTime}
        onTravelModeChange={setTravelMode}
        onCurrentMaskChange={setCurrentMask}
      />

      <CommuteVerdictBanner verdict={verdict} city={city} />
    </div>
  );
};
