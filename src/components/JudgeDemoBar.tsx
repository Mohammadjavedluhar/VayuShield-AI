import React from 'react';
import {
  AlertTriangle,
  Flame,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';
import { DemoPreset, JUDGE_PRESETS } from '../domain/demoPresets';
import { Language } from '../i18n/translations';

interface JudgeDemoBarProps {
  onSelectPreset: (preset: DemoPreset) => void;
  onReset: () => void;
  activePresetId?: string;
  language?: Language;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  onSelectPreset,
  onReset,
  activePresetId,
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
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
                }`}
                title={preset.description}
                aria-label={`Select evaluation scenario ${preset.badge}`}
              >
                {preset.id === 'delhi_severe' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                {preset.id === 'jaipur_moderate' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {preset.id === 'society_drive' && <Users className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{preset.badge}</span>
              </button>
            );
          })}

          {activePresetId && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs px-2.5 py-1.5 rounded-xl font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 flex items-center gap-1 transition"
              title="Reset to live location telemetry"
              aria-label="Reset scenario to live telemetry"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
