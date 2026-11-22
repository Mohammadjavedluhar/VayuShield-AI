import React from 'react';
import { IncidentSeverity, IncidentType } from '../../domain/communityReports';

interface ReportHotspotFormProps {
  neighborhood: string;
  setNeighborhood: (val: string) => void;
  reporterName: string;
  setReporterName: (val: string) => void;
  incidentType: IncidentType;
  setIncidentType: (val: IncidentType) => void;
  severity: IncidentSeverity;
  setSeverity: (val: IncidentSeverity) => void;
  description: string;
  setDescription: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

/**
 * ReportHotspotForm - Form allowing citizens to log hyperlocal pollution hotspots.
 */
export const ReportHotspotForm: React.FC<ReportHotspotFormProps> = ({
  neighborhood,
  setNeighborhood,
  reporterName,
  setReporterName,
  incidentType,
  setIncidentType,
  severity,
  setSeverity,
  description,
  setDescription,
  onSubmit,
  onCancel,
}) => {
  return (
    <form
      onSubmit={onSubmit}
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
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium min-h-[44px]"
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
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium min-h-[44px]"
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
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold min-h-[44px]"
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
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold min-h-[44px]"
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
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md min-h-[44px]"
        >
          Submit Report
        </button>
      </div>
    </form>
  );
};
