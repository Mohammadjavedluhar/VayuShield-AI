import React from 'react';
import { Building, Flame, ThumbsUp, Truck, Wind } from 'lucide-react';
import { CommunityReport, IncidentType } from '../../domain/communityReports';

interface IncidentCardProps {
  report: CommunityReport;
  onUpvote: (id: string) => void;
}

function getIncidentIcon(type: IncidentType): React.ReactElement {
  switch (type) {
    case 'waste_burning':
    case 'crop_residue':
      return <Flame className="w-4 h-4 text-rose-500" />;
    case 'traffic_gridlock':
      return <Truck className="w-4 h-4 text-amber-500" />;
    case 'construction_dust':
      return <Wind className="w-4 h-4 text-orange-500" />;
    case 'diesel_generator':
      return <Building className="w-4 h-4 text-purple-500" />;
  }
}

/**
 * IncidentCard - Single crowd-verified neighborhood pollution incident report.
 */
export const IncidentCard: React.FC<IncidentCardProps> = ({ report, onUpvote }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
          {getIncidentIcon(report.incidentType)}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {report.neighborhood}
            </span>
            <span className="text-xs text-slate-400">({report.city})</span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                report.severity === 'critical'
                  ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30'
              }`}
            >
              {report.severity}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {report.description}
          </p>

          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
            <span>Reported {report.reportedAt}</span>
            <span>&bull;</span>
            <span>By {report.reporterName || 'Resident'}</span>
            <span>&bull;</span>
            <span className="capitalize font-semibold text-emerald-500">{report.status}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onUpvote(report.id)}
        aria-label={`Verify incident report with ${report.upvotes} upvotes`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-300 transition shrink-0 self-end sm:self-auto min-h-[44px]"
      >
        <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
        <span>Verify ({report.upvotes})</span>
      </button>
    </div>
  );
};
