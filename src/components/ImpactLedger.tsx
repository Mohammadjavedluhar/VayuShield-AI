import React from 'react';
import {
  Award,
  Bike,
  Bus,
  Car,
  CheckCircle2,
  Flame,
  Leaf,
  Shield,
  ShieldCheck,
  Sparkles,
  Train,
  Wind,
  Zap,
} from 'lucide-react';
import { CommuteMode, CookingFuel, HouseholdProfile, ImpactLedgerMetrics, Interventions } from '../domain/types';
import { Language, translations } from '../i18n/translations';

interface ImpactLedgerProps {
  profile: HouseholdProfile;
  interventions: Interventions;
  metrics: ImpactLedgerMetrics;
  onUpdateInterventions: (interventions: Interventions) => void;
  language: Language;
}

export const ImpactLedger: React.FC<ImpactLedgerProps> = ({
  interventions,
  metrics,
  onUpdateInterventions,
  language,
}) => {
  const t = translations[language];

  const handleToggle = (key: keyof Interventions) => {
    onUpdateInterventions({
      ...interventions,
      [key]: !interventions[key],
    });
  };

  const handleCommuteSelect = (mode: CommuteMode) => {
    onUpdateInterventions({
      ...interventions,
      commuteMode: mode as any,
    });
  };

  const handleCookingSelect = (fuel: CookingFuel) => {
    onUpdateInterventions({
      ...interventions,
      cookingFuel: fuel as any,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>Deterministic Impact Engine (Berkeley Earth & US EPA Formulas)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.ledgerTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.ledgerSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          <Award className="w-4 h-4" />
          <span>{t.berkeleyBadge}</span>
        </div>
      </div>

      {/* Real-Time Live Math Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* Metric 1: Inhaled PM2.5 Reduction */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">
              {t.metricInhaledDrop}
            </span>
            <Shield className="w-4 h-4" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
              {metrics.inhaledPm25ReductionPct}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              {metrics.protectedInhaledPm25DoseUgPerDay} µg vs {metrics.baselineInhaledPm25DoseUgPerDay} µg/day
            </span>
          </div>
          <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">
            EPA Inhalation Dose Model
          </div>
        </div>

        {/* Metric 2: Avoided Cigarettes / Week */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">
              {t.metricCigarettesAvoided}
            </span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
              {metrics.avoidedCigarettesPerWeek}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              ≈ {metrics.avoidedCigarettesPerDay} cigarettes saved / day
            </span>
          </div>
          <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            Berkeley Earth Formula (22 µg/m³ = 1 cig)
          </div>
        </div>

        {/* Metric 3: CO2 Saved / Week */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">
              {t.metricCo2Saved}
            </span>
            <Leaf className="w-4 h-4" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.co2SavedKgPerWeek} <span className="text-lg">kg</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              Avoided from commute &amp; clean cooking
            </span>
          </div>
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            EPA &amp; DEFRA Transport Factors
          </div>
        </div>

        {/* Metric 4: Risk Reduction Score */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Composite Risk Score
            </span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">
              {metrics.riskReductionScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              {metrics.cleanAirHoursGainedPerDay} hours clean air / day
            </span>
          </div>
          <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
            Comprehensive Household Defense
          </div>
        </div>
      </div>

      {/* Toggles & Swaps Section */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
          Personalized Sustainable Interventions &amp; Swaps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle: N95 Mask */}
          <div
            onClick={() => handleToggle('useN95Mask')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              interventions.useN95Mask
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-900 dark:text-cyan-100'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  interventions.useN95Mask ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm">{t.toggleN95}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.toggleN95Sub}</div>
              </div>
            </div>
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                interventions.useN95Mask ? 'bg-cyan-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* Toggle: Air Purifier */}
          <div
            onClick={() => handleToggle('useAirPurifier')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              interventions.useAirPurifier
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  interventions.useAirPurifier
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm">{t.togglePurifier}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.togglePurifierSub}</div>
              </div>
            </div>
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                interventions.useAirPurifier
                  ? 'bg-emerald-500 justify-end'
                  : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* Toggle: Weatherstripping */}
          <div
            onClick={() => handleToggle('roomSealImprovement')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              interventions.roomSealImprovement
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-100'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  interventions.roomSealImprovement
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm">{t.toggleSealing}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Cuts cold smog draft infiltration by ~35%
                </div>
              </div>
            </div>
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                interventions.roomSealImprovement
                  ? 'bg-amber-500 justify-end'
                  : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* Toggle: Wet Mopping */}
          <div
            onClick={() => handleToggle('wetMoppingDaily')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              interventions.wetMoppingDaily
                ? 'bg-teal-500/10 border-teal-500/40 text-teal-900 dark:text-teal-100'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  interventions.wetMoppingDaily
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm">{t.toggleWetMopping}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Captures settled dust without resuspension
                </div>
              </div>
            </div>
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                interventions.wetMoppingDaily
                  ? 'bg-teal-500 justify-end'
                  : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>
        </div>

        {/* Commute Swap Selector */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold text-slate-400">
              {t.toggleCommute} (Choose sustainable commute)
            </span>
            <span className="text-xs font-semibold text-emerald-500">
              Current: {interventions.commuteMode.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'car', label: 'Solo Car', icon: Car, ef: '0.17 kg/km' },
              { id: 'carpool', label: 'Carpool', icon: Bus, ef: '0.08 kg/km' },
              { id: 'metro', label: 'Metro Train', icon: Train, ef: '0.035 kg/km' },
              { id: 'ev', label: 'Electric EV', icon: Zap, ef: '0.045 kg/km' },
              { id: 'walkOrCycle', label: 'Cycle / Walk', icon: Bike, ef: '0.0 kg/km' },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = interventions.commuteMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCommuteSelect(item.id as CommuteMode)}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 text-cyan-500" />
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{item.ef}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cooking Swap Selector */}
        <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold text-slate-400">
              {t.toggleCooking}
            </span>
            <span className="text-xs font-semibold text-emerald-500">
              Current: {interventions.cookingFuel.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleCookingSelect('lpg')}
              className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                interventions.cookingFuel === 'lpg'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-xs font-extrabold">Conventional LPG / Gas Burner</div>
                  <div className="text-[11px] text-slate-400">~1.5 kg CO2/day + indoor NO2 spikes</div>
                </div>
              </div>
              {interventions.cookingFuel === 'lpg' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
            </button>

            <button
              onClick={() => handleCookingSelect('induction')}
              className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                interventions.cookingFuel === 'induction'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="text-xs font-extrabold">Clean Induction Cooktop (Recommended)</div>
                  <div className="text-[11px] text-slate-400">~0.45 kg CO2/day • 0 indoor combustion gases</div>
                </div>
              </div>
              {interventions.cookingFuel === 'induction' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
