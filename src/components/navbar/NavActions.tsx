import React from 'react';
import { Globe, Moon, RefreshCw, ShieldCheck, Sun, Type, Wind, Wrench } from 'lucide-react';
import { AirQualityData } from '../../domain/types';
import { Language, translations } from '../../i18n/translations';

interface NavActionsProps {
  airQuality: AirQualityData | null;
  textScale: string;
  cycleScale: () => void;
  onOpenAuditLog?: () => void;
  onRefresh: () => void;
  onOpenCrModal: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({
  airQuality,
  textScale,
  cycleScale,
  onOpenAuditLog,
  onRefresh,
  onOpenCrModal,
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
}) => {
  const t = translations[language];

  return (
    <div className="flex items-center gap-2">
      {airQuality && (
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300">
          <Wind className="w-4 h-4 animate-spin-slow" />
          <span>AQI {airQuality.currentAqi} • {airQuality.categoryLabel}</span>
        </div>
      )}

      <button
        onClick={cycleScale}
        title={`Senior Font Scaler: ${textScale}%`}
        className="px-2.5 py-1.5 min-h-[44px] min-w-[44px] rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1"
      >
        <Type className="w-3.5 h-3.5" />
        <span>{textScale}%</span>
      </button>

      {onOpenAuditLog && (
        <button
          onClick={onOpenAuditLog}
          title="View Immutable Audit Log"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500/20 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audit</span>
        </button>
      )}

      <button
        onClick={onRefresh}
        title={t.refreshData}
        className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-center"
        aria-label={t.refreshData}
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      <button
        onClick={onOpenCrModal}
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
      >
        <Wrench className="w-3.5 h-3.5" />
        <span>DIY CR Box</span>
      </button>

      <button
        onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
        className="flex items-center justify-center gap-1 px-2.5 py-1.5 min-h-[44px] min-w-[44px] rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition"
        title="Toggle Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-500" />
        <span>{t.langToggle}</span>
      </button>

      <button
        onClick={onToggleTheme}
        className="p-2 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-center"
        aria-label={isDark ? t.themeToggleLight : t.themeToggleDark}
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
      </button>
    </div>
  );
};
