import { useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { CorsiRosenthalModal } from './components/CorsiRosenthalModal';
import { AuditLogModal } from './components/AuditLogModal';
import { JudgeDemoBar } from './components/JudgeDemoBar';
import { DemoPreset } from './domain/demoPresets';
import { AirQualityData, HouseholdProfile, Interventions, VisionAuditResult } from './domain/types';
import { calculateMasterImpactLedger } from './domain/impactEngine';
import { recordAuditEvent } from './domain/auditLog';
import { Language, translations } from './i18n/translations';
import { fetchAirQualityData } from './services/openMeteo';
import { PRESET_CITIES } from './services/geocoding';
import { callAskApi, callIntakeApi, callVisionAuditApi } from './services/apiClient';
import { buildSyntheticPresetForecast, getAqiCategoryMeta } from './components/app/presetHelpers';
import { AppHero } from './components/app/AppHero';
import { AppTabs } from './components/app/AppTabs';
import { AppFooter } from './components/app/AppFooter';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('monitor');
  const [isCrModalOpen, setIsCrModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);
  const [currentCity, setCurrentCity] = useState<string>('Delhi');
  const [location, setLocation] = useState({ lat: PRESET_CITIES[0].latitude, lon: PRESET_CITIES[0].longitude });

  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoadingAqi, setIsLoadingAqi] = useState<boolean>(false);
  const [profile, setProfile] = useState<HouseholdProfile>({
    householdSize: 4, city: 'Delhi', hasAsthma: true, hasCopdOrCardiac: false,
    hasChildren: true, hasElderly: true, isPregnant: false, commuteMode: 'car',
    commuteDistanceKm: 12, cookingFuel: 'lpg', heatingSource: 'none',
    hasAirPurifier: false, wearsMaskOutdoors: false, vulnerabilityScore: 85,
    vulnerabilityLevel: 'critical', rawInput: 'Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car',
  });
  const [isLoadingIntake, setIsLoadingIntake] = useState(false);
  const [intakeTier, setIntakeTier] = useState('tier2_flash');
  const [interventions, setInterventions] = useState<Interventions>({
    useN95Mask: true, useAirPurifier: true, commuteMode: 'metro',
    cookingFuel: 'induction', roomSealImprovement: true, wetMoppingDaily: true,
  });
  const [auditResult, setAuditResult] = useState<VisionAuditResult | null>(null);
  const [isLoadingVision, setIsLoadingVision] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    let isCancelled = false;
    void fetchAirQualityData(location.lat, location.lon, currentCity).then((d) => {
      if (!isCancelled) { setAirQuality(d); setIsLoadingAqi(false); }
    });
    return () => { isCancelled = true; };
  }, [location.lat, location.lon, currentCity]);

  const impactMetrics = useMemo(() => {
    return calculateMasterImpactLedger(airQuality?.pm25 || 185, profile, interventions);
  }, [airQuality?.pm25, profile, interventions]);

  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    setCurrentCity(preset.city);
    setLocation({ lat: preset.lat, lon: preset.lon });
    setProfile((prev) => ({ ...prev, city: preset.city, hasAsthma: preset.hasAsthma, rawInput: preset.description }));
    setAirQuality((prev) => ({
      city: preset.city, latitude: preset.lat, longitude: preset.lon,
      timestamp: new Date().toISOString(), currentAqi: preset.aqi, pm25: preset.pm25,
      pm10: Math.round(preset.pm25 * 1.6), no2: Math.round(preset.pm25 * 0.35),
      temperature: prev?.temperature ?? 18, humidity: prev?.humidity ?? 65,
      ...getAqiCategoryMeta(preset.aqi), dominantPollutant: 'PM2.5',
      healthAdvisory: preset.description, hourlyForecast: buildSyntheticPresetForecast(preset.aqi, preset.pm25),
    }));
    recordAuditEvent('plan_generated', `Activated preset scenario for ${preset.city}`, { presetId: preset.id });
  };

  const handleRunIntake = async (text: string) => {
    setIsLoadingIntake(true);
    try {
      const res = await callIntakeApi(text, currentCity);
      setProfile(res.profile);
      setIntakeTier(res.tier);
      recordAuditEvent('intake_completed', `Extracted profile for ${currentCity}`, { vuln: res.profile.vulnerabilityScore });
    } finally { setIsLoadingIntake(false); }
  };

  const handleRunVisionAudit = async (b64: string, mime: string, ctx?: string) => {
    setIsLoadingVision(true);
    try {
      const res = await callVisionAuditApi(b64, mime, ctx);
      setAuditResult(res.audit);
      recordAuditEvent('vision_scanned', `Audited room: ${res.audit.roomType}`, { rating: res.audit.overallVentilationRating });
    } finally { setIsLoadingVision(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 px-4 py-2 bg-cyan-600 text-white rounded-lg">Skip to main content</a>
      <JudgeDemoBar onSelectPreset={handleSelectPreset} onReset={() => setActivePresetId(undefined)} activePresetId={activePresetId} language={language} />
      <Navbar
        currentCity={currentCity} onSelectCity={(c) => { setCurrentCity(c.name); setLocation({ lat: c.latitude, lon: c.longitude }); }}
        airQuality={airQuality} onRefresh={() => fetchAirQualityData(location.lat, location.lon, currentCity).then(setAirQuality)}
        language={language} onLanguageChange={setLanguage} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)}
        activeTab={activeTab} onTabChange={setActiveTab} onOpenCrModal={() => setIsCrModalOpen(true)} onOpenAuditLog={() => setIsAuditModalOpen(true)}
      />
      <AppHero subtitle={t.subtitle} impactMetrics={impactMetrics} />
      <AppTabs
        activeTab={activeTab} setActiveTab={setActiveTab} airQuality={airQuality} isLoadingAqi={isLoadingAqi}
        language={language} currentCity={currentCity} profile={profile} setProfile={setProfile}
        interventions={interventions} setInterventions={setInterventions} impactMetrics={impactMetrics}
        auditResult={auditResult} isLoadingVision={isLoadingVision} isLoadingIntake={isLoadingIntake}
        intakeTier={intakeTier} onRunIntake={handleRunIntake} onRunVisionAudit={handleRunVisionAudit}
        onAskApi={async (q) => {
          const res = await callAskApi(q, { city: currentCity, aqi: airQuality?.currentAqi || 280, pm25: airQuality?.pm25 || 175, profile, ledger: impactMetrics });
          return res.answer;
        }}
        onOpenCrModal={() => setIsCrModalOpen(true)}
      />
      <CorsiRosenthalModal isOpen={isCrModalOpen} onClose={() => setIsCrModalOpen(false)} language={language} />
      <AuditLogModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
      <AppFooter />
    </div>
  );
}
