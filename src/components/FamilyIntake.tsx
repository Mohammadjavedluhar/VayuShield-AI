import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Baby,
  Brain,
  Car,
  CheckCircle2,
  Flame,
  HeartPulse,
  Home,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { HouseholdProfile } from '../domain/types';
import { Language, translations } from '../i18n/translations';

interface FamilyIntakeProps {
  profile: HouseholdProfile;
  onUpdateProfile: (newProfile: HouseholdProfile) => void;
  onRunIntakeApi: (text: string) => Promise<void>;
  isLoading: boolean;
  language: Language;
  resilienceTier?: string;
}

export const FamilyIntake: React.FC<FamilyIntakeProps> = ({
  profile,
  onRunIntakeApi,
  isLoading,
  language,
  resilienceTier,
}) => {
  const t = translations[language];
  const [inputText, setInputText] = useState(
    profile.rawInput || 'Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car'
  );

  const samplePrompts = [
    'Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car',
    'Household of 3 in Noida with a pregnant mother and 1 infant, cooking with LPG, commuting by metro',
    'Family of 5 in Lahore with a heart patient grandfather and 2 cyclists commuting daily',
    'Solo commuter in Gurugram driving 20 km daily, unvented heating, no air purifier',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim().length >= 3) {
      onRunIntakeApi(inputText);
    }
  };

  const handleSelectSample = (sample: string) => {
    setInputText(sample);
    onRunIntakeApi(sample);
  };

  const getVulnColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'moderate':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Brain className="w-4 h-4 text-cyan-500" />
            <span>GenAI Natural Language Extraction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.intakeTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.intakeSubtitle}
          </p>
        </div>

        {resilienceTier && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Tier: {resilienceTier.replace('tier2_', '').replace('tier4_', '')}</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={t.intakePlaceholder}
            className="w-full p-4 pr-12 text-sm sm:text-base rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none transition"
          />
          <button
            type="submit"
            disabled={isLoading || inputText.trim().length < 3}
            className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30 hover:opacity-95 disabled:opacity-40 transition flex items-center justify-center"
            title={t.intakeBtn}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Sample Prompt Chips */}
        <div className="mt-3">
          <span className="text-xs font-semibold text-slate-400 block mb-1.5">
            {t.samplePromptsTitle}
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample) => (
              <button
                key={`sample-prompt-${sample.slice(0, 25)}`}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-500 shrink-0" />
                <span className="truncate max-w-xs">{sample}</span>
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Extracted Profile Dashboard */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-500" />
          <span>Extracted Household Sensitivity Profile</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vulnerability Score Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                {t.vulnerabilityIndex}
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {profile.vulnerabilityScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase border ${getVulnColor(
                  profile.vulnerabilityLevel
                )}`}
              >
                {profile.vulnerabilityLevel} Risk
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Derived from medical vulnerability, commute exposure, and heating source.
              </p>
            </div>
          </div>

          {/* Clinical Vulnerability Flags */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
              {t.medicalFlags}
            </div>

            <div className="space-y-2">
              <div
                className={`flex items-center justify-between text-xs p-2 rounded-xl border ${
                  profile.hasAsthma
                    ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
                    : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'
                }`}
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Asthma Patient
                </span>
                <span>{profile.hasAsthma ? 'Detected (+35)' : 'No'}</span>
              </div>

              <div
                className={`flex items-center justify-between text-xs p-2 rounded-xl border ${
                  profile.hasCopdOrCardiac
                    ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
                    : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'
                }`}
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <HeartPulse className="w-3.5 h-3.5" /> COPD / Cardiac Patient
                </span>
                <span>{profile.hasCopdOrCardiac ? 'Detected (+40)' : 'No'}</span>
              </div>

              <div
                className={`flex items-center justify-between text-xs p-2 rounded-xl border ${
                  profile.hasElderly
                    ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30'
                    : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'
                }`}
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Users className="w-3.5 h-3.5" /> Elderly Family Members
                </span>
                <span>{profile.hasElderly ? 'Detected (+20)' : 'No'}</span>
              </div>

              <div
                className={`flex items-center justify-between text-xs p-2 rounded-xl border ${
                  profile.hasChildren
                    ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30'
                    : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'
                }`}
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Baby className="w-3.5 h-3.5" /> School / Young Kids
                </span>
                <span>{profile.hasChildren ? 'Detected (+20)' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Commute & Household Profile */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Household Parameters
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-500" /> {t.membersCount}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {profile.householdSize} members ({profile.city})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-cyan-500" /> Commute Mode
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                {profile.commuteMode} ({profile.commuteDistanceKm} km)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Cooking Fuel
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                {profile.cookingFuel}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-cyan-500" /> Air Purifier Active
              </span>
              <span
                className={`font-bold ${
                  profile.hasAirPurifier ? 'text-emerald-500' : 'text-slate-400'
                }`}
              >
                {profile.hasAirPurifier ? 'Yes' : 'Not installed'}
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Rationale Box */}
        {profile.rawInput && (
          <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-700 dark:text-cyan-300 font-bold block mb-0.5">
                AI Clinical Intake Extraction:
              </strong>
              <span>
                Personalized profile synthesized for {profile.householdSize} residents in {profile.city}. Tailored air filtration calculations and routine windows calibrated to these medical constraints.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
