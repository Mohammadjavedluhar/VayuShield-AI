import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { AirQualityData } from '../domain/types';
import { Language, translations } from '../i18n/translations';
import { CityLocation } from '../services/geocoding';
import { useTextScale } from '../hooks/useTextScale';
import { CitySearchBar } from './navbar/CitySearchBar';
import { NavTabLinks } from './navbar/NavTabLinks';
import { NavActions } from './navbar/NavActions';

interface NavbarProps {
  currentCity: string;
  onSelectCity: (city: CityLocation) => void;
  airQuality: AirQualityData | null;
  onRefresh: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCrModal: () => void;
  onOpenAuditLog?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  airQuality,
  onRefresh,
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
  activeTab,
  onTabChange,
  onOpenCrModal,
  onOpenAuditLog,
}) => {
  const t = translations[language];
  const { scale, setScale } = useTextScale();
  const cycleScale = () => {
    setScale(scale === '100' ? '125' : scale === '125' ? '150' : '100');
  };

  const navTabs = [
    { id: 'monitor', label: t.tabMonitor },
    { id: 'intake', label: t.tabIntake },
    { id: 'timeline', label: t.tabTimeline },
    { id: 'scanner', label: t.tabScanner },
    { id: 'ledger', label: t.tabLedger },
    { id: 'pledge', label: t.tabPledge },
    { id: 'assistant', label: t.tabAsk },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          <CitySearchBar currentCity={currentCity} onCitySelect={onSelectCity} placeholderText={t.searchCityPlaceholder} />

          <NavActions
            airQuality={airQuality}
            textScale={scale}
            cycleScale={cycleScale}
            onOpenAuditLog={onOpenAuditLog}
            onRefresh={onRefresh}
            onOpenCrModal={onOpenCrModal}
            language={language}
            onLanguageChange={onLanguageChange}
            isDark={isDark}
            onToggleTheme={onToggleTheme}
          />
        </div>

        <NavTabLinks tabs={navTabs} activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </header>
  );
};
