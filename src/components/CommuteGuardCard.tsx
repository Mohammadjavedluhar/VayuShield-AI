import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Baby,
  Bus,
  Car,
  Clock,
  HeartPulse,
  Info,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Users,
} from 'lucide-react';
import {
  analyzeMorningCommute,
  CommuterType,
  MaskGrade,
  TravelMode,
} from '../domain/commuteGuard';
import { Language, translations } from '../i18n/translations';

interface CommuteGuardCardProps {
  outdoorPm25: number;
  city: string;
  language: Language;
}

export const CommuteGuardCard: React.FC<CommuteGuardCardProps> = ({
  outdoorPm25,
  city,
  language,
}) => {
  const [commuterType, setCommuterType] = useState<CommuterType>('child');
  const [departureTime, setDepartureTime] = useState<string>('07:15');
  const [durationMinutes, setDurationMinutes] = useState<number>(35);
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

  const getVerdictTheme = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/30';
      case 'moderate':
        return 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Header */}
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

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 self-start sm:self-auto">
          <Clock className="w-4 h-4" />
          <span>Inversion Risk: {verdict.inversionRiskLevel.toUpperCase()}</span>
        </div>
      </div>

      {/* Control Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
        {/* Commuter Type */}
        <div>
          <label htmlFor="commute-commuter-type" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Commuter Vulnerability
          </label>
          <select
            id="commute-commuter-type"
            value={commuterType}
            onChange={(e) => setCommuterType(e.target.value as CommuterType)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="child">🎒 School Child (Higher ventilation / kg)</option>
            <option value="elderly">👴 Elderly Family Member</option>
            <option value="asthma_patient">🫁 Asthma / COPD Patient</option>
            <option value="adult">👤 Standard Adult</option>
          </select>
        </div>

        {/* Departure Time */}
        <div>
          <label htmlFor="commute-departure-time" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Departure Time
          </label>
          <select
            id="commute-departure-time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="06:45">6:45 AM (Severe compressed smog)</option>
            <option value="07:15">7:15 AM (Morning school bell)</option>
            <option value="07:45">7:45 AM (Office rush peak)</option>
            <option value="08:15">8:15 AM (Sun rising)</option>
            <option value="08:45">8:45 AM (Solar dispersion begins)</option>
            <option value="09:15">9:15 AM (Inversion breaking)</option>
          </select>
        </div>

        {/* Transit Mode */}
        <div>
          <label htmlFor="commute-transit-mode" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Transit Mode
          </label>
          <select
            id="commute-transit-mode"
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value as TravelMode)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="bus">🚌 School / Public Bus</option>
            <option value="two_wheeler">🛵 Two-Wheeler / Motorcycle</option>
            <option value="auto_rickshaw">🛺 Auto Rickshaw</option>
            <option value="closed_car">🚗 Car (AC Recirculate)</option>
            <option value="metro">🚇 Metro Train (Filtered)</option>
            <option value="open_walk_cycle">🚶 Walking / Cycling</option>
          </select>
        </div>

        {/* Current Mask Grade */}
        <div>
          <label htmlFor="commute-current-mask" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Current Mask Worn
          </label>
          <select
            id="commute-current-mask"
            value={currentMask}
            onChange={(e) => setCurrentMask(e.target.value as MaskGrade)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="cloth">Cloth Mask (~20% filtration)</option>
            <option value="none">No Mask (Bare Breathing 0%)</option>
            <option value="surgical">Surgical Mask (~35% filtration)</option>
            <option value="kn95">KN95 Ear Loop (~90% filtration)</option>
            <option value="n95">Certified N95 / FFP2 (~95% tight seal)</option>
          </select>
        </div>
      </div>

      {/* Main Verdict Display Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950 text-white border border-rose-500/30 my-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-rose-400">
              <span>Ground Inversion Impact Verdict</span>
              <span>&bull;</span>
              <span>{city}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {verdict.maskVerdict}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {verdict.maskRecommendation}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">WHO Dose Ratio</span>
              <span className="text-3xl font-black text-rose-400">
                {verdict.whoSafeLimitMultiplier}x
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">above safe limit</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Effective PM2.5</span>
              <span className="text-3xl font-black text-white">
                {verdict.effectiveAmbientPm25}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">µg/m³ ground smog</span>
            </div>
          </div>
        </div>

        {/* Departure Shift Recommendation */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-amber-300">
                {verdict.delayedDepartureSavingsPct > 15
                  ? `Delaying departure by 45 mins cuts inhale dose by ${verdict.delayedDepartureSavingsPct}%!`
                  : 'Commute Schedule Optimal for current window'}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {verdict.departureShiftAdvice}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Optimal Window</span>
            <span className="text-lg font-black text-emerald-400">{verdict.suggestedDepartureTime} AM</span>
          </div>
        </div>

        {/* Route / Vehicle Enclosure Advice */}
        <div className="mt-4 text-xs text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span><strong>Route Advice:</strong> {verdict.routeModeAdvice}</span>
        </div>
      </div>
    </div>
  );
};
