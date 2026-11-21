import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  MapPin,
  RefreshCw,
  Sun,
  Moon,
  Wind,
  Wrench,
  Globe,
} from 'lucide-react';
import { AirQualityData } from '../domain/types';
import { getAqiColorTheme } from '../domain/airQuality';
import { Language, translations } from '../i18n/translations';
import { CityLocation, PRESET_CITIES, searchCities } from '../services/geocoding';

interface NavbarProps {
  currentCity: string;
  airQuality: AirQualityData | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onCitySelect: (city: CityLocation) => void;
  onRefresh: () => void;
  onOpenCrModal: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  airQuality,
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
  onCitySelect,
  onRefresh,
  onOpenCrModal,
  activeTab,
  onTabChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const t = translations[language];
  const colorTheme = airQuality ? getAqiColorTheme(airQuality.category) : null;

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length >= 2) {
      setIsSearching(true);
      const results = await searchCities(val);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const selectCity = (city: CityLocation) => {
    onCitySelect(city);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const navTabs = [
    { id: 'monitor', label: t.tabMonitor },
    { id: 'commute', label: t.tabCommuteGuard },
    { id: 'indoor', label: t.tabIndoor },
    { id: 'intake', label: t.tabIntake },
    { id: 'timeline', label: t.tabTimeline },
    { id: 'scanner', label: t.tabScanner },
    { id: 'ledger', label: t.tabLedger },
    { id: 'community', label: t.tabCommunityWatch },
    { id: 'simulator', label: t.tabSimulator },
    { id: 'pledge', label: t.tabPledge },
    { id: 'ask', label: t.tabAsk },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  GenAI 2.5
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* City selector & Search */}
          <div className="relative flex-1 max-w-xs md:max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchResults.length > 0 || searchQuery.length >= 2) setShowDropdown(true);
                }}
                placeholder={`${currentCity} • ${t.searchCityPlaceholder}`}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {isSearching && (
                <RefreshCw className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 animate-spin" />
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div
                className="absolute left-0 right-0 mt-1.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="px-3 py-1 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Presets & Results
                </div>
                {(searchResults.length > 0 ? searchResults : PRESET_CITIES).map((c, idx) => (
                  <button
                    key={`${c.name}-${idx}`}
                    onClick={() => selectCity(c)}
                    className="w-full text-left px-3 py-2 flex items-center justify-between text-sm hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-slate-400">({c.country})</span>
                    </span>
                    <span className="text-xs text-slate-400">{c.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right status & controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live AQI pill */}
            {airQuality && (
              <div
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  colorTheme?.badgeBg ?? ''
                }`}
                title={`PM2.5: ${airQuality.pm25} µg/m³`}
              >
                <Wind className="w-4 h-4 animate-spin-slow" />
                <span>
                  AQI {airQuality.currentAqi} • {airQuality.categoryLabel}
                </span>
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={onRefresh}
              title={t.refreshData}
              className="p-2 rounded-xl text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              aria-label={t.refreshData}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* CR Box Calculator Button */}
            <button
              onClick={onOpenCrModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>DIY CR Box</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-500" />
              <span>{t.langToggle}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              aria-label={isDark ? t.themeToggleLight : t.themeToggleDark}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800/60">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
