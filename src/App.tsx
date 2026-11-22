import { useEffect, useMemo, useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Wind,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LiveAqiCard } from './components/LiveAqiCard';
import { FamilyIntake } from './components/FamilyIntake';
import { VisionAudit } from './components/VisionAudit';
import { CleanHourTimeline } from './components/CleanHourTimeline';
import { ImpactLedger } from './components/ImpactLedger';
import { CommunityPledge } from './components/CommunityPledge';
import { AskAssistant } from './components/AskAssistant';
import { CorsiRosenthalModal } from './components/CorsiRosenthalModal';
import { JudgeDemoBar } from './components/JudgeDemoBar';
import { DemoPreset } from './domain/demoPresets';
import { CommuteGuardCard } from './components/CommuteGuardCard';
import { IndoorAqiCard } from './components/IndoorAqiCard';
import { CommunityWatch } from './components/CommunityWatch';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import {
  AirQualityData,
  AqiCategory,
  HouseholdProfile,
  Interventions,
  VisionAuditResult,
} from './domain/types';
import {
  calculateMasterImpactLedger,
} from './domain/impactEngine';
import { Language, translations } from './i18n/translations';
import { fetchAirQualityData } from './services/openMeteo';
import { CityLocation, PRESET_CITIES } from './services/geocoding';
import {
  callAskApi,
  callIntakeApi,
  callVisionAuditApi,
} from './services/apiClient';

function getAqiCategoryMeta(aqi: number): { category: AqiCategory; categoryLabel: string } {
  if (aqi > 300) return { category: 'hazardous', categoryLabel: 'Hazardous' };
  if (aqi > 200) return { category: 'veryUnhealthy', categoryLabel: 'Very Unhealthy' };
  if (aqi > 150) return { category: 'unhealthy', categoryLabel: 'Unhealthy' };
  if (aqi > 100) return { category: 'unhealthySensitive', categoryLabel: 'Unhealthy for Sensitive Groups' };
  return { category: 'moderate', categoryLabel: 'Moderate' };
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('monitor');
  const [isCrModalOpen, setIsCrModalOpen] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);

  // Selected city & geocoding
  const [currentCity, setCurrentCity] = useState<string>('Delhi');
  const [location, setLocation] = useState<{ lat: number; lon: number }>({
    lat: PRESET_CITIES[0].latitude,
    lon: PRESET_CITIES[0].longitude,
  });

  // Air Quality Data
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoadingAqi, setIsLoadingAqi] = useState<boolean>(false);

  // Household Profile
  const [profile, setProfile] = useState<HouseholdProfile>({
    householdSize: 4,
    city: 'Delhi',
    hasAsthma: true,
    hasCopdOrCardiac: false,
    hasChildren: true,
    hasElderly: true,
    isPregnant: false,
    commuteMode: 'car',
    commuteDistanceKm: 12,
    cookingFuel: 'lpg',
    heatingSource: 'none',
    hasAirPurifier: false,
    wearsMaskOutdoors: false,
    vulnerabilityScore: 85,
    vulnerabilityLevel: 'critical',
    rawInput: 'Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car',
  });
  const [isLoadingIntake, setIsLoadingIntake] = useState<boolean>(false);
  const [intakeTier, setIntakeTier] = useState<string>('tier2_flash');

  // Interventions
  const [interventions, setInterventions] = useState<Interventions>({
    useN95Mask: true,
    useAirPurifier: true,
    commuteMode: 'metro',
    cookingFuel: 'induction',
    roomSealImprovement: true,
    wetMoppingDaily: true,
  });

  // Multimodal Vision Result
  const [auditResult, setAuditResult] = useState<VisionAuditResult | null>(null);
  const [isLoadingVision, setIsLoadingVision] = useState<boolean>(false);

  const t = translations[language];

  // Apply Dark Mode class to <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load air quality on mount and when location changes
  const loadAirQuality = async (lat: number, lon: number, cityName: string) => {
    setIsLoadingAqi(true);
    try {
      const data = await fetchAirQualityData(lat, lon, cityName);
      setAirQuality(data);
    } catch (err) {
      console.error('Failed to load air quality:', err);
    } finally {
      setIsLoadingAqi(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const fetchAqi = async () => {
      setIsLoadingAqi(true);
      try {
        const data = await fetchAirQualityData(location.lat, location.lon, currentCity);
        if (!isCancelled) {
          setAirQuality(data);
        }
      } catch (err) {
        console.error('Failed to load air quality:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingAqi(false);
        }
      }
    };
    void fetchAqi();
    return () => {
      isCancelled = true;
    };
  }, [location.lat, location.lon, currentCity]);

  // Real-time deterministic impact ledger calculation
  const impactMetrics = useMemo(() => {
    const outdoorPm25 = airQuality?.pm25 || 185;
    return calculateMasterImpactLedger(outdoorPm25, profile, interventions);
  }, [airQuality?.pm25, profile, interventions]);

  // Preset selection handler for Hackathon Judges
  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    setCurrentCity(preset.city);
    setLocation({ lat: preset.lat, lon: preset.lon });
    setProfile({
      householdSize: preset.householdSize,
      city: preset.city,
      hasAsthma: preset.hasAsthma,
      hasCopdOrCardiac: false,
      hasChildren: preset.hasChildren,
      hasElderly: preset.hasElderly,
      isPregnant: false,
      commuteMode: preset.commuteMode,
      commuteDistanceKm: 12,
      cookingFuel: preset.cookingFuel === 'biomassChulha' ? 'biomassChulha' : preset.cookingFuel,
      heatingSource: 'none',
      hasAirPurifier: preset.usePurifier,
      wearsMaskOutdoors: preset.useN95,
      vulnerabilityScore: preset.hasAsthma ? 90 : 45,
      vulnerabilityLevel: preset.hasAsthma ? 'critical' : 'moderate',
      rawInput: preset.description,
    });
    setInterventions({
      useN95Mask: preset.useN95,
      useAirPurifier: preset.usePurifier,
      commuteMode: 'metro',
      cookingFuel: preset.cookingFuel === 'biomassChulha' ? 'lpg' : 'induction',
      roomSealImprovement: true,
      wetMoppingDaily: true,
    });
    setAirQuality((prev) => ({
      city: preset.city,
      latitude: preset.lat,
      longitude: preset.lon,
      timestamp: new Date().toISOString(),
      currentAqi: preset.aqi,
      pm25: preset.pm25,
      pm10: Math.round(preset.pm25 * 1.6),
      no2: Math.round(preset.pm25 * 0.35),
      temperature: prev?.temperature ?? 18,
      humidity: prev?.humidity ?? 65,
      ...getAqiCategoryMeta(preset.aqi),
      dominantPollutant: 'PM2.5',
      healthAdvisory: preset.description,
      hourlyForecast: prev?.hourlyForecast && prev.hourlyForecast.length > 0 ? prev.hourlyForecast : [
        {
          time: '06:00',
          hour: 6,
          aqi: Math.round(preset.aqi * 1.15),
          pm25: Math.round(preset.pm25 * 1.15),
          pm10: Math.round(preset.pm25 * 1.8),
          no2: 60,
          aqiCategory: 'hazardous',
          isExerciseSafe: false,
          isCommuteWarning: true,
          isVentilationSafe: false,
          recommendation: 'Severe morning thermal inversion. Keep windows sealed.',
        },
        {
          time: '08:00',
          hour: 8,
          aqi: preset.aqi,
          pm25: preset.pm25,
          pm10: Math.round(preset.pm25 * 1.6),
          no2: 55,
          aqiCategory: 'hazardous',
          isExerciseSafe: false,
          isCommuteWarning: true,
          isVentilationSafe: false,
          recommendation: 'Peak school-run smog. Certified N95 mandatory.',
        },
        {
          time: '12:00',
          hour: 12,
          aqi: Math.round(preset.aqi * 0.7),
          pm25: Math.round(preset.pm25 * 0.7),
          pm10: Math.round(preset.pm25 * 1.2),
          no2: 40,
          aqiCategory: 'veryUnhealthy',
          isExerciseSafe: false,
          isCommuteWarning: false,
          isVentilationSafe: true,
          recommendation: 'Solar boundary layer mixed. Safest 30-min window for HEPA-filtered air flush.',
        },
        {
          time: '16:00',
          hour: 16,
          aqi: Math.round(preset.aqi * 0.65),
          pm25: Math.round(preset.pm25 * 0.65),
          pm10: Math.round(preset.pm25 * 1.1),
          no2: 38,
          aqiCategory: 'unhealthy',
          isExerciseSafe: false,
          isCommuteWarning: false,
          isVentilationSafe: true,
          recommendation: 'Late afternoon dispersion before sunset temperature inversion.',
        },
        {
          time: '20:00',
          hour: 20,
          aqi: Math.round(preset.aqi * 0.95),
          pm25: Math.round(preset.pm25 * 0.95),
          pm10: Math.round(preset.pm25 * 1.5),
          no2: 52,
          aqiCategory: 'hazardous',
          isExerciseSafe: false,
          isCommuteWarning: true,
          isVentilationSafe: false,
          recommendation: 'Nocturnal boundary layer descending. Turn on Corsi-Rosenthal / HEPA filtration.',
        },
      ],
    }));
  };

  const handleResetPreset = () => {
    setActivePresetId(undefined);
    void loadAirQuality(location.lat, location.lon, currentCity);
  };

  // Handlers
  const handleCitySelect = (city: CityLocation) => {
    setActivePresetId(undefined);
    setCurrentCity(city.name);
    setLocation({ lat: city.latitude, lon: city.longitude });
    setProfile((prev) => ({ ...prev, city: city.name }));
  };

  const handleRunIntake = async (text: string) => {
    setIsLoadingIntake(true);
    try {
      const result = await callIntakeApi(text, currentCity);
      setProfile(result.profile);
      setIntakeTier(result.tier);
    } catch (err) {
      console.error('Intake failed:', err);
    } finally {
      setIsLoadingIntake(false);
    }
  };

  const handleRunVisionAudit = async (
    imageBase64: string,
    mimeType: string,
    roomContext?: string
  ) => {
    setIsLoadingVision(true);
    try {
      const result = await callVisionAuditApi(imageBase64, mimeType, roomContext);
      setAuditResult(result.audit);
    } catch (err) {
      console.error('Vision audit failed:', err);
    } finally {
      setIsLoadingVision(false);
    }
  };

  const handleAskApi = async (question: string) => {
    return await callAskApi(question, {
      city: currentCity,
      aqi: airQuality?.currentAqi || 280,
      pm25: airQuality?.pm25 || 175,
      profile,
      ledger: impactMetrics,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col">
      {/* Accessibility: Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 px-4 py-2 bg-cyan-600 text-white rounded-lg"
      >
        Skip to main content
      </a>

      {/* Interactive Demo Mode (1-Click Judge Presets) */}
      <JudgeDemoBar
        onSelectPreset={handleSelectPreset}
        onReset={handleResetPreset}
        activePresetId={activePresetId}
        language={language}
      />

      {/* Navigation Bar */}
      <Navbar
        currentCity={currentCity}
        airQuality={airQuality}
        language={language}
        onLanguageChange={setLanguage}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onCitySelect={handleCitySelect}
        onRefresh={() => { void loadAirQuality(location.lat, location.lon, currentCity); }}
        onOpenCrModal={() => setIsCrModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Sub-hero Hero Banner */}
      <section className="relative overflow-hidden py-8 sm:py-12 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hack2Skill Urban Air Quality Challenge &bull; Production GenAI</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                VayuShield <span className="bg-gradient-to-r from-cyan-500 to-emerald-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="px-3 py-1 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Inhaled PM2.5</span>
                <span className="text-lg sm:text-xl font-black text-cyan-500">
                  -{impactMetrics.inhaledPm25ReductionPct}%
                </span>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Smoke Avoided</span>
                <span className="text-lg sm:text-xl font-black text-amber-500">
                  {impactMetrics.avoidedCigarettesPerWeek} <span className="text-xs font-normal">cigs/wk</span>
                </span>
              </div>
              <div className="px-3 py-1 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CO2 Saved</span>
                <span className="text-lg sm:text-xl font-black text-emerald-500">
                  {impactMetrics.co2SavedKgPerWeek} <span className="text-xs font-normal">kg/wk</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Tab 1: Live Smog Monitor */}
        {activeTab === 'monitor' && (
          <div className="space-y-8 animate-fade-in">
            {isLoadingAqi && (
              <div className="w-full h-1 bg-cyan-500/20 overflow-hidden rounded-full mb-3" role="status" aria-label="Updating air quality telemetry">
                <div className="w-1/3 h-full bg-cyan-500 animate-pulse" />
              </div>
            )}
            {airQuality ? (
              <LiveAqiCard data={airQuality} language={language} />
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Wind className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Fetching real-time atmospheric data from Open-Meteo...</p>
              </div>
            )}
            {/* Quick feature links banner for judge evaluation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('commute')}
                className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 font-bold text-lg">
                      🚸
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        School &amp; Elderly Commute Guard
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Inversion layer timing, N95 verdict &amp; departure delay optimizer
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                    Open &rarr;
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('indoor')}
                className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 hover:border-cyan-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-500 font-bold text-lg">
                      🏠
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                        Real-Time Indoor AQI Estimator
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        EPA mass-balance physics model without hardware sensors
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full">
                    Open &rarr;
                  </span>
                </div>
              </button>
            </div>

            {/* Embedded timeline preview for convenience */}
            {airQuality && (
              <CleanHourTimeline airQuality={airQuality} language={language} />
            )}
          </div>
        )}

        {/* Tab 2: School & Elderly Morning Commute Guard */}
        {activeTab === 'commute' && (
          <div className="space-y-8 animate-fade-in">
            <CommuteGuardCard
              outdoorPm25={airQuality?.pm25 || 185}
              city={currentCity}
              language={language}
            />
          </div>
        )}

        {/* Tab 3: Real-Time Indoor AQI Estimator (EPA Mass-Balance) */}
        {activeTab === 'indoor' && (
          <div className="space-y-8 animate-fade-in">
            <IndoorAqiCard
              outdoorPm25={airQuality?.pm25 || 185}
              city={currentCity}
              language={language}
              onOpenCrModal={() => setIsCrModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: 1-Sentence Smart Family Intake */}
        {activeTab === 'intake' && (
          <div className="space-y-8 animate-fade-in">
            <FamilyIntake
              profile={profile}
              onUpdateProfile={setProfile}
              onRunIntakeApi={handleRunIntake}
              isLoading={isLoadingIntake}
              language={language}
              resilienceTier={intakeTier}
            />
            {/* Show connected impact preview */}
            <ImpactLedger
              profile={profile}
              interventions={interventions}
              metrics={impactMetrics}
              onUpdateInterventions={setInterventions}
              language={language}
            />
          </div>
        )}

        {/* Tab 5: Clean-Hour Routine Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-8 animate-fade-in">
            {airQuality ? (
              <CleanHourTimeline airQuality={airQuality} language={language} />
            ) : (
              <div className="p-8 text-center text-slate-400">Loading forecast...</div>
            )}
          </div>
        )}

        {/* Tab 6: Room, Mask Fit & Purifier Filter Scanner */}
        {activeTab === 'scanner' && (
          <div className="space-y-8 animate-fade-in">
            <VisionAudit
              onRunVisionApi={handleRunVisionAudit}
              auditResult={auditResult}
              isLoading={isLoadingVision}
              language={language}
              onOpenCrModal={() => setIsCrModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 7: Interactive Impact Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-8 animate-fade-in">
            <ImpactLedger
              profile={profile}
              interventions={interventions}
              metrics={impactMetrics}
              onUpdateInterventions={setInterventions}
              language={language}
            />
            <CommunityPledge
              profile={profile}
              metrics={impactMetrics}
              language={language}
            />
          </div>
        )}

        {/* Tab 8: Hyper-Local Community Watch & Crop/Waste Burning Feed */}
        {activeTab === 'community' && (
          <div className="space-y-8 animate-fade-in">
            <CommunityWatch city={currentCity} language={language} />
          </div>
        )}

        {/* Tab 9: Interactive What-If Impact Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-8 animate-fade-in">
            <WhatIfSimulator
              ambientPm25={airQuality?.pm25 || 185}
              profile={profile}
              city={currentCity}
              language={language}
            />
          </div>
        )}

        {/* Tab 10: Community Pledge & Shareable Badge */}
        {activeTab === 'pledge' && (
          <div className="space-y-8 animate-fade-in">
            <CommunityPledge
              profile={profile}
              metrics={impactMetrics}
              language={language}
            />
          </div>
        )}

        {/* Tab 11: Ask VayuShield AI Assistant */}
        {activeTab === 'ask' && (
          <div className="space-y-8 animate-fade-in">
            {airQuality && (
              <AskAssistant
                airQuality={airQuality}
                profile={profile}
                ledger={impactMetrics}
                onAskApi={handleAskApi}
                language={language}
              />
            )}
          </div>
        )}
      </main>

      {/* Corsi-Rosenthal Interactive Modal */}
      <CorsiRosenthalModal
        isOpen={isCrModalOpen}
        onClose={() => setIsCrModalOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-500" />
            <span>
              <strong>VayuShield AI</strong> &bull; Hack2Skill Urban Air Quality &amp; Winter Smog Assistant
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Berkeley Earth Muller Formula</span>
            <span>US EPA 2024 Breakpoints</span>
            <span>Open-Meteo Air Quality</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
