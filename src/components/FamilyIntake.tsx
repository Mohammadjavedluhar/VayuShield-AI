import React, { useState } from 'react';
import { Brain, Send } from 'lucide-react';
import { HouseholdProfile } from '../domain/types';
import { Language, translations } from '../i18n/translations';
import { CardSectionHeader } from './common/CardSectionHeader';
import { FamilyProfileDisplay } from './intake/FamilyProfileDisplay';
import { FamilySampleChips } from './intake/FamilySampleChips';

interface FamilyIntakeProps {
  profile: HouseholdProfile;
  onUpdateProfile: (newProfile: HouseholdProfile) => void;
  onRunIntakeApi: (text: string) => Promise<void>;
  isLoading: boolean;
  language: Language;
  resilienceTier?: string;
}

const SAMPLE_PROMPTS = [
  'Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car',
  'Household of 3 in Noida with a pregnant mother and 1 infant, cooking with LPG, commuting by metro',
  'Family of 5 in Lahore with a heart patient grandfather and 2 cyclists commuting daily',
  'Solo commuter in Gurugram driving 20 km daily, unvented heating, no air purifier',
];

/**
 * FamilyIntake - Natural language household extraction card.
 */
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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <CardSectionHeader
        icon={<Brain className="w-4 h-4 text-cyan-500" />}
        badgeText="GenAI Natural Language Extraction"
        title={t.intakeTitle}
        subtitle={t.intakeSubtitle}
        rightAction={
          resilienceTier ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Tier: {resilienceTier.replace('tier2_', '').replace('tier4_', '')}</span>
            </div>
          ) : undefined
        }
      />

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
            className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30 hover:opacity-95 disabled:opacity-40 transition flex items-center justify-center min-w-[44px] min-h-[44px]"
            title={t.intakeBtn}
            aria-label={t.intakeBtn}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <FamilySampleChips
          samples={SAMPLE_PROMPTS}
          onSelectSample={handleSelectSample}
          title={t.samplePromptsTitle}
        />
      </form>

      <FamilyProfileDisplay
        profile={profile}
        vulnerabilityIndexText={t.vulnerabilityIndex}
        medicalFlagsText={t.medicalFlags}
        membersCountText={t.membersCount}
      />
    </div>
  );
};
