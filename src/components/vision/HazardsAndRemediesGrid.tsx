import React from 'react';
import { AlertCircle, ShieldCheck, Wrench } from 'lucide-react';
import { VisionDiyFix, VisionHazard } from '../../domain/types';

interface HazardsAndRemediesGridProps {
  hazards: VisionHazard[];
  diyFixes: VisionDiyFix[];
  hazardsFoundText: string;
  diyRemediesText: string;
}

export const HazardsAndRemediesGrid: React.FC<HazardsAndRemediesGridProps> = ({
  hazards,
  diyFixes,
  hazardsFoundText,
  diyRemediesText,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{hazardsFoundText}</span>
        </div>
        {hazards.map((hazard) => (
          <div key={`hazard-${hazard.hazard}-${hazard.severity}`} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{hazard.hazard}</span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${hazard.severity === 'critical' || hazard.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                {hazard.severity} severity
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hazard.description}</p>
            <div className="mt-2 text-[11px] font-semibold text-rose-500">+~{hazard.estimatedPm25ContributionUg} µg/m³ PM2.5 contribution</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
          <Wrench className="w-4 h-4 text-emerald-500" />
          <span>{diyRemediesText}</span>
        </div>
        {diyFixes.map((fix) => (
          <div key={`fix-${fix.title}-${fix.costTier}`} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{fix.title}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Cost: {fix.costTier}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{fix.action}</p>
            <div className="mt-2 text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Expected PM2.5 drop: ~{fix.expectedPm25DropPct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
