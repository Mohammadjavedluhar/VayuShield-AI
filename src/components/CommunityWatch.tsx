import React, { useState } from 'react';
import {
  Building,
  Flame,
  Plus,
  ThumbsUp,
  Truck,
  Users,
  Wind,
} from 'lucide-react';
import {
  calculateCollectiveSocietyImpact,
  CommunityReport,
  getStoredReports,
  IncidentSeverity,
  IncidentType,
  saveStoredReports,
} from '../domain/communityReports';
import { Language } from '../i18n/translations';

interface CommunityWatchProps {
  city: string;
  language?: Language;
}

export const CommunityWatch: React.FC<CommunityWatchProps> = ({ city }) => {
  const [reports, setReports] = useState<CommunityReport[]>(getStoredReports());
  const [showAddForm, setShowAddForm] = useState(false);
  const [societyFamiliesCount, setSocietyFamiliesCount] = useState<number>(25);

  // Form states
  const [neighborhood, setNeighborhood] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('waste_burning');
  const [severity, setSeverity] = useState<IncidentSeverity>('critical');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');

  const societyImpact = calculateCollectiveSocietyImpact(societyFamiliesCount);

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

    // Reset form
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

  const getIncidentIcon = (type: IncidentType) => {
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:opacity-95 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report Smog Incident</span>
        </button>
      </div>

      {/* Collective Society Impact Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Collective Society Impact Calculator
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Impact of {societyFamiliesCount} Pledged Neighborhood Families
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              When apartments and RWAs ban open leaf burning and organize shared metro carpools, collective community emission reductions scale dramatically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="watch-society-families" className="text-xs font-bold text-slate-300">Pledged Families:</label>
            <input
              id="watch-society-families"
              type="range"
              min={5}
              max={150}
              step={5}
              value={societyFamiliesCount}
              onChange={(e) => setSocietyFamiliesCount(Number.parseInt(e.target.value, 10))}
              className="w-28 h-2 rounded-lg bg-slate-800 accent-emerald-500"
            />
            <span className="text-sm font-black text-emerald-400 w-8">{societyFamiliesCount}</span>
          </div>
        </div>

        {/* Collective Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Avoided PM2.5</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {societyImpact.weeklyAvoidedPm25Kg} <span className="text-xs font-normal">kg</span>
            </div>
            <span className="text-[10px] text-slate-400">Weekly prevented emissions</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">CO2 Saved</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              {societyImpact.weeklySavedCo2Kg} <span className="text-xs font-normal">kg</span>
            </div>
            <span className="text-[10px] text-slate-400">Carpool / transit shift</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Smoke Avoided</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {societyImpact.weeklyAvoidedCigarettes}
            </div>
            <span className="text-[10px] text-slate-400">Cigarettes equiv / week</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Health Savings</span>
            <div className="text-2xl font-black text-purple-400 mt-1">
              ₹{(societyImpact.annualCommunityHealthSavingsInr / 1000).toFixed(0)}k
            </div>
            <span className="text-[10px] text-slate-400">Annual doctor visits avoided</span>
          </div>
        </div>
      </div>

      {/* Incident Form (Conditional) */}
      {showAddForm && (
        <form
          onSubmit={handleAddReport}
          className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Log Hyperlocal Smog Trigger
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="watch-neighborhood" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Neighborhood / Colony
              </label>
              <input
                id="watch-neighborhood"
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Anand Vihar, Rohini Sec 16"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
              />
            </div>

            <div>
              <label htmlFor="watch-reporter" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Reporter / Society
              </label>
              <input
                id="watch-reporter"
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Verma Family / Flat 402"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
              />
            </div>

            <div>
              <label htmlFor="watch-incident-type" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Incident Category
              </label>
              <select
                id="watch-incident-type"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="waste_burning">🔥 Municipal / Leaf Waste Burning</option>
                <option value="crop_residue">🌾 Stubble / Biomass Burning Drift</option>
                <option value="construction_dust">🚜 Uncovered Construction Dust</option>
                <option value="traffic_gridlock">🚛 Heavy Diesel Truck Chokepoint</option>
                <option value="diesel_generator">⚡ Commercial DG Set Smoke</option>
              </select>
            </div>

            <div>
              <label htmlFor="watch-severity" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Severity Level
              </label>
              <select
                id="watch-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="critical">Critical (Dense dark plume entering homes)</option>
                <option value="high">High (Strong smell, reduced visibility)</option>
                <option value="moderate">Moderate (Intermittent dust/smoke)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="watch-description" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
              Description &amp; Landmark
            </label>
            <textarea
              id="watch-description"
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is burning or emitting smoke and exact landmark..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md"
            >
              Submit Report
            </button>
          </div>
        </form>
      )}

      {/* Feed Stream */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Live Citizen Incident Reports ({reports.length})
        </div>

        {reports.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
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

            {/* Upvote Button */}
            <button
              onClick={() => handleUpvote(report.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-300 transition shrink-0 self-end sm:self-auto"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verify ({report.upvotes})</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
