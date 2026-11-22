import React from 'react';
import { CheckCircle2, Droplets, Flower2, ShieldCheck, Wind } from 'lucide-react';
import { VisionAuditResult } from '../../domain/types';
import { CrBoxSizingCard } from './CrBoxSizingCard';
import { HazardsAndRemediesGrid } from './HazardsAndRemediesGrid';

interface VisionAuditResultsProps {
  auditResult: VisionAuditResult;
  onOpenCrModal: () => void;
  hazardsFoundText: string;
  diyRemediesText: string;
  crBoxCardTitleText: string;
  airPlantsTitleText: string;
}

function getRatingBadge(rating: 'poor' | 'fair' | 'good'): string {
  switch (rating) {
    case 'poor': return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'fair': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    case 'good': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  }
}

export const VisionAuditResults: React.FC<VisionAuditResultsProps> = ({
  auditResult,
  onOpenCrModal,
  hazardsFoundText,
  diyRemediesText,
  crBoxCardTitleText,
  airPlantsTitleText,
}) => {
  return (
    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
      {/* Top Results Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs uppercase font-bold text-slate-400">Audited Room Classification</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{auditResult.roomType}</div>
        </div>
        <div className="flex items-center gap-3">
          {auditResult.confidenceScore && (
            <div className="hidden sm:inline-flex px-2.5 py-1 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              {auditResult.confidenceScore}% Vision Confidence
            </div>
          )}
          <div className="text-right">
            <div className="text-xs text-slate-400">Est. Indoor PM2.5</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {auditResult.estimatedIndoorPm25} <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase border ${getRatingBadge(auditResult.overallVentilationRating)}`}>
            {auditResult.overallVentilationRating} Ventilation
          </div>
        </div>
      </div>

      {/* Diagnostics */}
      {auditResult.maskFitAnalysis && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-slate-900/40 to-teal-500/10 border border-cyan-500/30">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-cyan-400" /><span className="font-extrabold text-sm text-slate-900 dark:text-white">Respirator Fit Diagnostic</span></div>
            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">{auditResult.maskFitAnalysis.fitStatus.replace('_', ' ')}</span>
          </div>
          <div className="mt-2 text-xs text-slate-300">{auditResult.maskFitAnalysis.correctiveAction}</div>
        </div>
      )}

      {auditResult.filterConditionAnalysis && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/40 to-orange-500/10 border border-amber-500/30">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2"><Wind className="w-5 h-5 text-amber-400" /><span className="font-extrabold text-sm text-slate-900 dark:text-white">Filter Saturation Audit</span></div>
            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/30">{auditResult.filterConditionAnalysis.saturationLevel}</span>
          </div>
          <div className="mt-2 text-xs text-amber-400 font-bold">Est. Remaining Life: {auditResult.filterConditionAnalysis.remainingLifeDays} Days</div>
        </div>
      )}

      {/* Summary */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
        <div><strong className="text-cyan-700 dark:text-cyan-300 block mb-0.5 font-bold">Gemini Vision Assessment:</strong><span>{auditResult.summary}</span></div>
      </div>

      <HazardsAndRemediesGrid hazards={auditResult.hazardsIdentified} diyFixes={auditResult.diyFixes} hazardsFoundText={hazardsFoundText} diyRemediesText={diyRemediesText} />

      {auditResult.crBoxSizing && <CrBoxSizingCard crBoxSizing={auditResult.crBoxSizing} title={crBoxCardTitleText} onOpenCrModal={onOpenCrModal} />}

      {auditResult.plantsRecommended && auditResult.plantsRecommended.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white mb-3">
            <Flower2 className="w-4 h-4 text-emerald-500" /><span>{airPlantsTitleText}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {auditResult.plantsRecommended.map((plant) => (
              <div key={`plant-${plant.name}-${plant.targetPollutant}`} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0"><Droplets className="w-5 h-5" /></div>
                <div><div className="font-bold text-sm text-slate-800 dark:text-slate-200">{plant.name}</div><div className="text-xs font-semibold text-emerald-500 mt-0.5">Targets: {plant.targetPollutant}</div><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plant.airBenefit}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
