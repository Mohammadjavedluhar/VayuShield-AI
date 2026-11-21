import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Flame,
  Home,
  ShieldCheck,
  Sparkles,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  AirPurifierType,
  estimateIndoorAirQuality,
  IncenseType,
  IndoorCookingType,
  VentilationRateType,
  WindowSealType,
} from '../domain/indoorModel';
import { getAqiColorTheme } from '../domain/airQuality';
import { Language, translations } from '../i18n/translations';

interface IndoorAqiCardProps {
  outdoorPm25: number;
  city: string;
  language: Language;
  onOpenCrModal: () => void;
}

export const IndoorAqiCard: React.FC<IndoorAqiCardProps> = ({
  outdoorPm25,
  city,
  language,
  onOpenCrModal,
}) => {
  const [windowSeal, setWindowSeal] = useState<WindowSealType>('standard_closed');
  const [cookingFuel, setCookingFuel] = useState<IndoorCookingType>('lpg_unvented');
  const [incenseUsage, setIncenseUsage] = useState<IncenseType>('single_stick');
  const [ventilationRate, setVentilationRate] = useState<VentilationRateType>('moderate_natural');
  const [airPurifier, setAirPurifier] = useState<AirPurifierType>('diy_corsi_rosenthal');
  const [roomAreaSqFt, setRoomAreaSqFt] = useState<number>(220);

  const result = estimateIndoorAirQuality({
    outdoorPm25,
    windowSeal,
    cookingFuel,
    incenseUsage,
    ventilationRate,
    airPurifier,
    roomAreaSqFt,
  });

  const outdoorTheme = getAqiColorTheme(
    result.outdoorAqi > 300
      ? 'hazardous'
      : result.outdoorAqi > 200
      ? 'veryUnhealthy'
      : result.outdoorAqi > 150
      ? 'unhealthy'
      : 'moderate'
  );

  const indoorTheme = getAqiColorTheme(result.indoorCategory);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>EPA Mass-Balance Physics Simulation (No Hardware Needed)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Real-Time Indoor AQI Estimator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Simulates indoor particulate steady-state using ambient Open-Meteo readings, building penetration factor (P), and internal generation sources.
          </p>
        </div>

        <button
          onClick={onOpenCrModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition self-start sm:self-auto"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>DIY Purifier CADR</span>
        </button>
      </div>

      {/* Side-by-Side Live Comparison Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
        {/* Left: Outdoor AQI */}
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

        {/* Center: Vs Divider */}
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

        {/* Right: Estimated Indoor AQI */}
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
            <div
              className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold border mt-1 ${indoorTheme.badgeBg}`}
            >
              {result.ventilationRating === 'sealed_clean'
                ? 'Safe Clean Haven'
                : result.ventilationRating === 'moderate'
                ? 'Moderate Infiltration'
                : 'Hazardous Infiltration'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Household Sliders & Inputs */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
          Adjust Your Home Envelope &amp; Internal Sources
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Window Sealing */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Window &amp; Balcony Seal (P)
            </label>
            <select
              value={windowSeal}
              onChange={(e) => setWindowSeal(e.target.value as WindowSealType)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
            >
              <option value="weathersealed">Weathersealed Tape (P = 0.40)</option>
              <option value="standard_closed">Standard Closed (P = 0.65)</option>
              <option value="leaky_drafty">Leaky Single-Pane (P = 0.85)</option>
              <option value="open_windows">Open Windows (P = 1.00)</option>
            </select>
          </div>

          {/* Cooking Fuel */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Kitchen Cooking Source
            </label>
            <select
              value={cookingFuel}
              onChange={(e) => setCookingFuel(e.target.value as IndoorCookingType)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
            >
              <option value="induction">Clean Induction (0 µg/h)</option>
              <option value="lpg_with_exhaust">LPG with Chimney Exhaust</option>
              <option value="lpg_unvented">Unvented LPG Stove (+4,500 µg/h)</option>
              <option value="biomass_chulha">Biomass Chulha (+19,500 µg/h)</option>
            </select>
          </div>

          {/* Incense Usage */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Puja Incense / Agarbatti
            </label>
            <select
              value={incenseUsage}
              onChange={(e) => setIncenseUsage(e.target.value as IncenseType)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
            >
              <option value="none">None / Flameless LED (0 µg/h)</option>
              <option value="single_stick">1 Agarbatti Stick (+2,600 µg/h)</option>
              <option value="multiple_dhoop">Multiple Dhoop Cones (+7,200 µg/h)</option>
            </select>
          </div>

          {/* Air Purifier */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Active Air Purifier
            </label>
            <select
              value={airPurifier}
              onChange={(e) => setAirPurifier(e.target.value as AirPurifierType)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
            >
              <option value="diy_corsi_rosenthal">Corsi-Rosenthal Box (350 CFM)</option>
              <option value="none">No Purifier Running (0 CFM)</option>
              <option value="hepa_h13">Commercial HEPA (220 CFM)</option>
              <option value="dual_purifiers">Dual Purifiers (550 CFM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Physics Breakdown & Action Steps */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-xs uppercase font-extrabold text-slate-400 block mb-2">
            Indoor PM2.5 Composition
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500">Infiltrated Outdoor Smog:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {result.infiltratedOutdoorPm25} µg/m³
              </strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500">Self-Generated Indoor Sources:</span>
              <strong className="text-amber-500">
                +{result.selfGeneratedIndoorPm25} µg/m³
              </strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Air Purifier Particulate Removal:</span>
              <strong className="text-emerald-500">
                -{result.purifierBenefitUg} µg/m³
              </strong>
            </div>
          </div>
        </div>

        {/* Targeted Engineering Fixes */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-xs uppercase font-extrabold text-slate-400 block mb-2">
            Targeted Fixes to Reach Clean Air (&lt;35 µg/m³)
          </span>
          <div className="space-y-2">
            {result.actionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">{step.title}: </strong>
                  <span className="text-slate-500 dark:text-slate-400">{step.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
