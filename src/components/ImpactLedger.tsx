import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { CommuteMode, CookingFuel, HouseholdProfile, ImpactLedgerMetrics, Interventions } from '../domain/types';
import { Language, translations } from '../i18n/translations';
import { LedgerMetricsCards } from './ledger/LedgerMetricsCards';
import { LedgerInterventionToggles } from './ledger/LedgerInterventionToggles';

interface ImpactLedgerProps {
  profile: HouseholdProfile;
  interventions: Interventions;
  metrics: ImpactLedgerMetrics;
  onUpdateInterventions: (interventions: Interventions) => void;
  language: Language;
}

/**
 * ImpactLedger - Ground-truth personalized emissions and particulate savings ledger.
 */
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
      commuteMode: mode as Interventions['commuteMode'],
    });
  };

  const handleCookingSelect = (fuel: CookingFuel) => {
    onUpdateInterventions({
      ...interventions,
      cookingFuel: fuel as Interventions['cookingFuel'],
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>Deterministic Impact Engine (Berkeley Earth &amp; US EPA Formulas)</span>
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

      <LedgerMetricsCards
        metrics={metrics}
        inhaledDropText={t.metricInhaledDrop}
        cigarettesAvoidedText={t.metricCigarettesAvoided}
        co2SavedText={t.metricCo2Saved}
      />

      <LedgerInterventionToggles
        interventions={interventions}
        onToggle={handleToggle}
        onCommuteSelect={handleCommuteSelect}
        onCookingSelect={handleCookingSelect}
        toggleN95={t.toggleN95}
        toggleN95Sub={t.toggleN95Sub}
        togglePurifier={t.togglePurifier}
        togglePurifierSub={t.togglePurifierSub}
        toggleSealing={t.toggleSealing}
        toggleWetMopping={t.toggleWetMopping}
        toggleCommute={t.toggleCommute}
        toggleCooking={t.toggleCooking}
      />
    </div>
  );
};
