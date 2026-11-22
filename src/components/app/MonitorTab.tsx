import React from 'react';
import { Wind } from 'lucide-react';
import { AirQualityData } from '../../domain/types';
import { Language } from '../../i18n/translations';
import { LiveAqiCard } from '../LiveAqiCard';
import { CleanHourTimeline } from '../CleanHourTimeline';

interface MonitorTabProps {
  airQuality: AirQualityData | null;
  isLoadingAqi: boolean;
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const MonitorTab: React.FC<MonitorTabProps> = ({
  airQuality,
  isLoadingAqi,
  language,
  onNavigateTab,
}) => {
  return (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigateTab('commute')}
          className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all group min-h-[44px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 font-bold text-lg">🚸</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">School &amp; Elderly Commute Guard</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Inversion layer timing, N95 verdict &amp; departure delay optimizer</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">Open &rarr;</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('indoor')}
          className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 hover:border-cyan-500/40 cursor-pointer transition-all group min-h-[44px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-500 font-bold text-lg">🏠</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">Real-Time Indoor AQI Estimator</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">EPA mass-balance physics model without hardware sensors</p>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full">Open &rarr;</span>
          </div>
        </button>
      </div>
      {airQuality && <CleanHourTimeline airQuality={airQuality} language={language} />}
    </div>
  );
};
