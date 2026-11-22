import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import {
  CommunityReport,
  getStoredReports,
  IncidentSeverity,
  IncidentType,
  saveStoredReports,
} from '../domain/communityReports';
import { Language } from '../i18n/translations';
import { SocietyImpactCard } from './community/SocietyImpactCard';
import { ReportHotspotForm } from './community/ReportHotspotModal';
import { IncidentCard } from './community/IncidentCard';

interface CommunityWatchProps {
  city: string;
  language?: Language;
}

/**
 * CommunityWatch - Real-time crowd-verified citizen pollution reporting feed.
 */
export const CommunityWatch: React.FC<CommunityWatchProps> = ({ city }) => {
  const [reports, setReports] = useState<CommunityReport[]>(getStoredReports());
  const [showAddForm, setShowAddForm] = useState(false);
  const [societyFamiliesCount, setSocietyFamiliesCount] = useState<number>(25);

  const [neighborhood, setNeighborhood] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('waste_burning');
  const [severity, setSeverity] = useState<IncidentSeverity>('critical');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!neighborhood.trim() || !description.trim()) return;

    const newReport: CommunityReport = {
      id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `rep-${Date.now()}`,
      city,
      neighborhood: neighborhood.trim(),
      incidentType,
      severity,
      description: description.trim(),
      reportedAt: 'Just now',
      upvotes: 1,
      status: 'active',
      reporterName: reporterName.trim() || 'Local Resident',
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    saveStoredReports(updated);

    setNeighborhood('');
    setDescription('');
    setShowAddForm(false);
  };

  const handleUpvote = (id: string) => {
    const updated = reports.map((r) =>
      r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r
    );
    setReports(updated);
    saveStoredReports(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Hyperlocal Citizen Pollution Watch &bull; Community Feed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Community Smog &amp; Burning Watch
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time neighborhood incident reporting for waste burning, construction dust, and diesel chokepoints with crowd-verified upvotes.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:opacity-95 transition self-start sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Report Smog Incident</span>
        </button>
      </div>

      <SocietyImpactCard
        societyFamiliesCount={societyFamiliesCount}
        setSocietyFamiliesCount={setSocietyFamiliesCount}
      />

      {showAddForm && (
        <ReportHotspotForm
          neighborhood={neighborhood}
          setNeighborhood={setNeighborhood}
          reporterName={reporterName}
          setReporterName={setReporterName}
          incidentType={incidentType}
          setIncidentType={setIncidentType}
          severity={severity}
          setSeverity={setSeverity}
          description={description}
          setDescription={setDescription}
          onSubmit={handleAddReport}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Live Citizen Incident Reports ({reports.length})
        </div>
        {reports.map((report) => (
          <IncidentCard key={report.id} report={report} onUpvote={handleUpvote} />
        ))}
      </div>
    </div>
  );
};
