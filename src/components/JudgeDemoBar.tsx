import React from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Flame,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

export interface DemoPreset {
  id: string;
  badge: string;
  title: string;
  city: string;
  lat: number;
  lon: number;
  aqi: number;
  pm25: number;
  householdSize: number;
  hasAsthma: boolean;
  hasChildren: boolean;
  hasElderly: boolean;
  commuteMode: 'car' | 'twoWheeler' | 'metro';
  cookingFuel: 'lpg' | 'induction' | 'biomassChulha';
  useN95: boolean;
  usePurifier: boolean;
  description: string;
}

export const JUDGE_PRESETS: DemoPreset[] = [
  {
    id: 'delhi_severe',
    badge: 'Scenario A (Critical Smog)',
    title: 'Severe Delhi Winter Inversion (AQI 420)',
    city: 'Delhi',
    lat: 28.6139,
    lon: 77.2090,
    aqi: 420,
    pm25: 310,
    householdSize: 5,
    hasAsthma: true,
    hasChildren: true,
    hasElderly: true,
    commuteMode: 'car',
    cookingFuel: 'lpg',
    useN95: true,
    usePurifier: true,
    description: 'Joint family in Anand Vihar with asthmatic child & elderly grandparent during severe morning inversion.',
  },
  {
    id: 'jaipur_moderate',
    badge: 'Scenario B (Moderate Haze)',
    title: 'Jaipur Morning Smog Haze (AQI 165)',
    city: 'Jaipur',
    lat: 26.9124,
    lon: 75.7873,
    aqi: 165,
    pm25: 85,
    householdSize: 3,
    hasAsthma: false,
    hasChildren: true,
    hasElderly: false,
    commuteMode: 'twoWheeler',
    cookingFuel: 'lpg',
    useN95: false,
    usePurifier: false,
    description: 'Budget apartment in Mansarovar with two-wheeler school commute and unvented kitchen cooking.',
  },
  {
    id: 'society_drive',
    badge: 'Scenario C (Community Collective)',
    title: 'Society Collective Action (25 Families)',
    city: 'Noida',
    lat: 28.5355,
    lon: 77.3910,
    aqi: 280,
    pm25: 175,
    householdSize: 4,
    hasAsthma: true,
    hasChildren: true,
    hasElderly: false,
    commuteMode: 'metro',
    cookingFuel: 'induction',
    useN95: true,
    usePurifier: true,
    description: '25 RWA families switching to shared metro carpools, induction cooking, and no-waste-burning pledges.',
  },
];

interface JudgeDemoBarProps {
  onSelectPreset: (preset: DemoPreset) => void;
  onReset: () => void;
  activePresetId?: string;
  language: Language;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  onSelectPreset,
  onReset,
  activePresetId,
  language,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border-b border-cyan-500/30 py-2.5 px-4 sm:px-6 lg:px-8 text-white transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Label */}
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center gap-1 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Judge Demo Bar</span>
          </span>
          <span className="text-xs text-slate-300 hidden sm:inline">
            1-Click realistic evaluation scenarios:
          </span>
        </div>

        {/* 3 Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {JUDGE_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10 hover:border-cyan-500/40'
                }`}
                title={preset.description}
              >
                {preset.id === 'delhi_severe' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                {preset.id === 'jaipur_moderate' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {preset.id === 'society_drive' && <Users className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{preset.badge}</span>
              </button>
            );
          })}

          {activePresetId && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Reset to Live Open-Meteo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
