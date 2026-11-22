import React from 'react';
import {
  AirQualityData,
  HouseholdProfile,
  ImpactLedgerMetrics,
  Interventions,
  VisionAuditResult,
} from '../../domain/types';
import { Language } from '../../i18n/translations';
import { MonitorTab } from './MonitorTab';
import { CleanHourTimeline } from '../CleanHourTimeline';
import { CommuteGuardCard } from '../CommuteGuardCard';
import { IndoorAqiCard } from '../IndoorAqiCard';
import { FamilyIntake } from '../FamilyIntake';
import { VisionAudit } from '../VisionAudit';
import { ImpactLedger } from '../ImpactLedger';
import { CommunityWatch } from '../CommunityWatch';
import { WhatIfSimulator } from '../WhatIfSimulator';
import { CommunityPledge } from '../CommunityPledge';
import { AskAssistant } from '../AskAssistant';

interface AppTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  airQuality: AirQualityData | null;
  isLoadingAqi: boolean;
  language: Language;
  currentCity: string;
  profile: HouseholdProfile;
  setProfile: (p: HouseholdProfile) => void;
  interventions: Interventions;
  setInterventions: (i: Interventions) => void;
  impactMetrics: ImpactLedgerMetrics;
  auditResult: VisionAuditResult | null;
  isLoadingVision: boolean;
  isLoadingIntake: boolean;
  intakeTier: string;
  onRunIntake: (text: string) => Promise<void>;
  onRunVisionAudit: (b64: string, mime: string, ctx?: string) => Promise<void>;
  onAskApi: (q: string) => Promise<string>;
  onOpenCrModal: () => void;
}

export const AppTabs: React.FC<AppTabsProps> = ({
  activeTab,
  setActiveTab,
  airQuality,
  isLoadingAqi,
  language,
  currentCity,
  profile,
  setProfile,
  interventions,
  setInterventions,
  impactMetrics,
  auditResult,
  isLoadingVision,
  isLoadingIntake,
  intakeTier,
  onRunIntake,
  onRunVisionAudit,
  onAskApi,
  onOpenCrModal,
}) => {
  return (
    <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {activeTab === 'monitor' && (
        <MonitorTab airQuality={airQuality} isLoadingAqi={isLoadingAqi} language={language} onNavigateTab={setActiveTab} />
      )}
      {activeTab === 'commute' && (
        <div className="space-y-8 animate-fade-in">
          <CommuteGuardCard outdoorPm25={airQuality?.pm25 || 185} city={currentCity} language={language} />
        </div>
      )}
      {activeTab === 'indoor' && (
        <div className="space-y-8 animate-fade-in">
          <IndoorAqiCard outdoorPm25={airQuality?.pm25 || 185} city={currentCity} language={language} onOpenCrModal={onOpenCrModal} />
        </div>
      )}
      {activeTab === 'intake' && (
        <div className="space-y-8 animate-fade-in">
          <FamilyIntake profile={profile} onUpdateProfile={setProfile} onRunIntakeApi={onRunIntake} isLoading={isLoadingIntake} language={language} resilienceTier={intakeTier} />
          <ImpactLedger profile={profile} interventions={interventions} metrics={impactMetrics} onUpdateInterventions={setInterventions} language={language} />
        </div>
      )}
      {activeTab === 'timeline' && (
        <div className="space-y-8 animate-fade-in">
          {airQuality ? <CleanHourTimeline airQuality={airQuality} language={language} /> : <div className="p-8 text-center text-slate-400">Loading forecast...</div>}
        </div>
      )}
      {activeTab === 'scanner' && (
        <div className="space-y-8 animate-fade-in">
          <VisionAudit onRunVisionApi={onRunVisionAudit} auditResult={auditResult} isLoading={isLoadingVision} language={language} onOpenCrModal={onOpenCrModal} />
        </div>
      )}
      {activeTab === 'ledger' && (
        <div className="space-y-8 animate-fade-in">
          <ImpactLedger profile={profile} interventions={interventions} metrics={impactMetrics} onUpdateInterventions={setInterventions} language={language} />
          <CommunityPledge profile={profile} metrics={impactMetrics} language={language} />
        </div>
      )}
      {activeTab === 'community' && (
        <div className="space-y-8 animate-fade-in">
          <CommunityWatch city={currentCity} language={language} />
        </div>
      )}
      {activeTab === 'simulator' && (
        <div className="space-y-8 animate-fade-in">
          <WhatIfSimulator ambientPm25={airQuality?.pm25 || 185} profile={profile} city={currentCity} language={language} />
        </div>
      )}
      {activeTab === 'pledge' && (
        <div className="space-y-8 animate-fade-in">
          <CommunityPledge profile={profile} metrics={impactMetrics} language={language} />
        </div>
      )}
      {activeTab === 'assistant' && (
        <div className="space-y-8 animate-fade-in">
          <AskAssistant onAskQuestion={onAskApi} airQuality={airQuality} profile={profile} metrics={impactMetrics} language={language} />
        </div>
      )}
    </main>
  );
};
