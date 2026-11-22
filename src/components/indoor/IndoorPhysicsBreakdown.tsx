import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { IndoorEstimatorResult } from '../../domain/indoorModel';

interface IndoorPhysicsBreakdownProps {
  result: IndoorEstimatorResult;
}

export const IndoorPhysicsBreakdown: React.FC<IndoorPhysicsBreakdownProps> = ({ result }) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
        <span className="text-xs uppercase font-extrabold text-slate-400 block mb-2">
          Indoor PM2.5 Composition
        </span>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500">Infiltrated Outdoor Smog:</span>
            <strong className="text-slate-800 dark:text-slate-200">
              {result.infiltratedOutdoorPm25} µg/m³
            </strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500">Self-Generated Indoor Sources:</span>
            <strong className="text-amber-500">
              +{result.selfGeneratedIndoorPm25} µg/m³
            </strong>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Air Purifier Particulate Removal:</span>
            <strong className="text-emerald-500">
              -{result.purifierBenefitUg} µg/m³
            </strong>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
        <span className="text-xs uppercase font-extrabold text-slate-400 block mb-2">
          Targeted Fixes to Reach Clean Air (&lt;35 µg/m³)
        </span>
        <div className="space-y-2">
          {result.actionSteps.map((step) => (
            <div key={`${step.title}-${step.action.slice(0, 15)}`} className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200">{step.title}: </strong>
                <span className="text-slate-500 dark:text-slate-400">{step.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
