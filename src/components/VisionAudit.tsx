import React, { useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Droplets,
  Eye,
  Flower2,
  Image as ImageIcon,
  ShieldCheck,
  Upload,
  Wind,
  Wrench,
} from 'lucide-react';
import { VisionAuditResult } from '../domain/types';
import { Language, translations } from '../i18n/translations';

interface VisionAuditProps {
  onRunVisionApi: (imageBase64: string, mimeType: string, roomContext?: string) => Promise<void>;
  auditResult: VisionAuditResult | null;
  isLoading: boolean;
  language: Language;
  onOpenCrModal: () => void;
}

interface SamplePhoto {
  id: string;
  name: string;
  description: string;
  context: string;
  svgPreview: string; // SVG data URL for instant zero-dependency display
}

// Crisp lightweight SVG mockups for immediate sample auditing
const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'incense',
    name: '🪔 Living Room with Incense / Dhoop',
    description: 'Puja corner with burning incense sticks, closed room, and heavy rugs.',
    context: 'Living room puja altar with solid incense burning and sealed windows.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%232b2118"/><rect x="40" y="80" width="320" height="150" fill="%233e3124" rx="10"/><circle cx="200" cy="110" r="30" fill="%23eab308" opacity="0.3"/><rect x="195" y="125" width="10" height="50" fill="%23d97706"/><path d="M198 120 Q180 80 200 40 T220 20" stroke="%23cbd5e1" stroke-width="4" fill="none" opacity="0.7"/><text x="200" y="240" fill="%23fbbf24" font-family="sans-serif" font-size="14" text-anchor="middle">Incense Altar &amp; Closed Room</text></svg>',
  },
  {
    id: 'kitchen',
    name: '🍳 Kitchen with Unvented Gas Stove',
    description: 'LPG combustion burner, active spice frying, and no active exhaust hood.',
    context: 'Kitchen cooking station with unvented gas burner and frying oil splatter.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><rect x="60" y="130" width="280" height="100" fill="%23334155" rx="8"/><circle cx="150" cy="130" r="35" fill="%230ea5e9" opacity="0.4"/><circle cx="250" cy="130" r="35" fill="%230ea5e9" opacity="0.4"/><ellipse cx="150" cy="110" rx="30" ry="8" fill="%23f97316"/><path d="M150 90 Q160 50 140 20" stroke="%23e2e8f0" stroke-width="3" fill="none" opacity="0.6"/><text x="200" y="245" fill="%2338bdf8" font-family="sans-serif" font-size="14" text-anchor="middle">Unvented Gas Stove &amp; Cooking Fumes</text></svg>',
  },
  {
    id: 'window',
    name: '🪟 Drafty Window Facing Road Smog',
    description: 'Single-pane glass with visible perimeter gap drafts and black road dust.',
    context: 'Bedroom window facing arterial road with unsealed sash and morning smog infiltration.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%23475569"/><rect x="80" y="30" width="240" height="180" fill="%2364748b" stroke="%23cbd5e1" stroke-width="8" rx="4"/><line x1="200" y1="30" x2="200" y2="210" stroke="%23cbd5e1" stroke-width="6"/><line x1="80" y1="120" x2="320" y2="120" stroke="%23cbd5e1" stroke-width="6"/><rect x="84" y="34" width="232" height="172" fill="%2394a3b8" opacity="0.4"/><text x="200" y="240" fill="%23f1f5f9" font-family="sans-serif" font-size="14" text-anchor="middle">Single-Pane Window Draft Leaks</text></svg>',
  },
  {
    id: 'balcony',
    name: '🌫️ Balcony View of Heavy Winter Smog',
    description: 'Dense winter thermal inversion obscuring buildings 50 meters away.',
    context: 'Apartment balcony looking onto heavy grey smog with severe inversion layer.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%236b7280"/><rect x="0" y="160" width="400" height="100" fill="%23374151"/><rect x="50" y="90" width="60" height="120" fill="%234b5563" opacity="0.5"/><rect x="160" y="60" width="80" height="150" fill="%234b5563" opacity="0.3"/><rect x="280" y="110" width="70" height="100" fill="%234b5563" opacity="0.4"/><text x="200" y="240" fill="%23f3f4f6" font-family="sans-serif" font-size="14" text-anchor="middle">Dense Ambient Winter Smog View</text></svg>',
  },
  {
    id: 'mask_fit',
    name: '😷 N95 Mask Fit & Nose Seal Check',
    description: 'Respirator facial seal check, nose clip contouring, and perimeter gap detection.',
    context: 'N95 respirator mask fit inspection with unpinched nose bridge and cheek leakage',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%230f172a"/><path d="M140 100 Q200 60 260 100 Q280 180 200 210 Q120 180 140 100 Z" fill="%23f8fafc" stroke="%2338bdf8" stroke-width="4"/><line x1="170" y1="90" x2="230" y2="90" stroke="%2394a3b8" stroke-width="6"/><path d="M140 110 Q90 120 130 170" stroke="%23cbd5e1" stroke-width="3" fill="none"/><path d="M260 110 Q310 120 270 170" stroke="%23cbd5e1" stroke-width="3" fill="none"/><text x="200" y="245" fill="%2338bdf8" font-family="sans-serif" font-size="14" text-anchor="middle">N95 Mask Fit &amp; Leakage Check</text></svg>',
  },
  {
    id: 'filter_saturated',
    name: '🌪️ Saturated HEPA / MERV Filter',
    description: 'Examine filter pleats for gray/black particulate loading and CADR airflow drop.',
    context: 'air cleaner filter replacement check with dark dust loading and saturated pleats',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><rect x="60" y="40" width="280" height="160" fill="%23334155" stroke="%2394a3b8" stroke-width="4"/><line x1="100" y1="40" x2="100" y2="200" stroke="%23475569" stroke-width="8"/><line x1="140" y1="40" x2="140" y2="200" stroke="%23334155" stroke-width="8"/><line x1="180" y1="40" x2="180" y2="200" stroke="%231e293b" stroke-width="8"/><line x1="220" y1="40" x2="220" y2="200" stroke="%230f172a" stroke-width="8"/><line x1="260" y1="40" x2="260" y2="200" stroke="%231e293b" stroke-width="8"/><line x1="300" y1="40" x2="300" y2="200" stroke="%23475569" stroke-width="8"/><text x="200" y="240" fill="%23f87171" font-family="sans-serif" font-size="14" text-anchor="middle">Saturated Dark Gray HEPA Pleats</text></svg>',
  },
];

export const VisionAudit: React.FC<VisionAuditProps> = ({
  onRunVisionApi,
  auditResult,
  isLoading,
  language,
  onOpenCrModal,
}) => {
  const t = translations[language];
  const [selectedPreview, setSelectedPreview] = useState<string>(SAMPLE_PHOTOS[0].svgPreview);
  const [roomContext, setRoomContext] = useState<string>('Living room / bedroom space');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedPreview(base64);
      onRunVisionApi(base64, file.type, roomContext);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SamplePhoto) => {
    setSelectedPreview(sample.svgPreview);
    setRoomContext(sample.context);
    // Convert data url / svg to base64 for API
    const base64 = btoa(sample.svgPreview);
    onRunVisionApi(base64, 'image/svg+xml', sample.context);
  };

  const getRatingBadge = (rating: 'poor' | 'fair' | 'good') => {
    switch (rating) {
      case 'poor':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'fair':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'good':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Camera className="w-4 h-4 text-cyan-500" />
            <span>Gemini 2.5 Flash Multimodal Vision</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.scannerTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.scannerSubtitle}
          </p>
        </div>

        <button
          onClick={onOpenCrModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition self-start sm:self-auto"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>DIY Box Calculator</span>
        </button>
      </div>

      {/* Upload Zone & Preloaded Samples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left: Drag and drop or selected image preview */}
        <div className="lg:col-span-6 flex flex-col">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`relative rounded-3xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[260px] overflow-hidden ${
              isDragOver
                ? 'border-cyan-500 bg-cyan-500/5'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-cyan-500/60'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />

            {selectedPreview ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img
                  src={selectedPreview}
                  alt="Room to audit"
                  className="max-h-60 rounded-2xl object-cover shadow-md border border-slate-200 dark:border-slate-800"
                />
                <span className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> Click or drop new photo to re-scan
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 mx-auto flex items-center justify-center">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t.dragDropText}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP, or live camera capture
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Context input */}
          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              {t.roomContextLabel}
            </label>
            <input
              type="text"
              value={roomContext}
              onChange={(e) => setRoomContext(e.target.value)}
              placeholder={t.roomContextPlaceholder}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Scan Action Button */}
          <button
            onClick={() => {
              if (selectedPreview) {
                const b64 = selectedPreview.includes('base64,')
                  ? selectedPreview.split('base64,')[1]
                  : btoa(selectedPreview);
                onRunVisionApi(b64, 'image/jpeg', roomContext);
              }
            }}
            disabled={isLoading}
            className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30 hover:opacity-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.scanningLoading}</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>{t.scanPhotoBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Quick Sample Room Photos */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t.quickSamplePhotos}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_PHOTOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 hover:bg-cyan-500/5 transition group flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={sample.svgPreview}
                      alt={sample.name}
                      className="w-full h-24 rounded-xl object-cover border border-slate-200 dark:border-slate-800 group-hover:scale-[1.02] transition"
                    />
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">
                      {sample.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {sample.description}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-cyan-500 mt-2 self-end">
                    Audit This Scene →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vision Audit Results View */}
      {auditResult && (
        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
          {/* Top Results Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">
                Audited Room Classification
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {auditResult.roomType}
              </div>
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

              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase border ${getRatingBadge(
                  auditResult.overallVentilationRating
                )}`}
              >
                {auditResult.overallVentilationRating} Ventilation
              </div>
            </div>
          </div>

          {/* Mask Fit Analysis Diagnostic Card (If scanning mask) */}
          {auditResult.maskFitAnalysis && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-slate-900/40 to-teal-500/10 border border-cyan-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Respirator Fit &amp; Facial Seal Diagnostic
                  </span>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                    auditResult.maskFitAnalysis.fitStatus === 'tight_certified'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {auditResult.maskFitAnalysis.fitStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-3 text-xs space-y-2">
                <div>
                  <strong className="text-slate-400">Identified Leakage Points:</strong>{' '}
                  <span className="text-slate-700 dark:text-slate-200">
                    {auditResult.maskFitAnalysis.gapLocations.join(', ')}
                  </span>
                </div>
                <div>
                  <strong className="text-cyan-600 dark:text-cyan-400">Corrective Action:</strong>{' '}
                  <span className="text-slate-700 dark:text-slate-300">
                    {auditResult.maskFitAnalysis.correctiveAction}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Filter Condition Analysis Card (If scanning filter) */}
          {auditResult.filterConditionAnalysis && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/40 to-orange-500/10 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-amber-400" />
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Air Filter Saturation &amp; Pressure Drop Audit
                  </span>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                    auditResult.filterConditionAnalysis.replacementNeeded
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {auditResult.filterConditionAnalysis.saturationLevel.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-3 text-xs flex flex-wrap items-center justify-between gap-4">
                <span className="text-slate-700 dark:text-slate-300">
                  {auditResult.filterConditionAnalysis.replacementNeeded
                    ? '⚠️ Filter pleats are deeply loaded with soot/dust. Airflow resistance will degrade room CADR.'
                    : 'Filter condition is satisfactory.'}
                </span>
                <span className="font-bold text-amber-500">
                  Est. Remaining Service Life: {auditResult.filterConditionAnalysis.remainingLifeDays} Days
                </span>
              </div>
            </div>
          )}

          {/* Zero-Cost Immediate Actions */}
          {auditResult.zeroCostActions && auditResult.zeroCostActions.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold block mb-1">
                Zero-Cost Immediate Adjustments:
              </strong>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {auditResult.zeroCostActions.map((act) => (
                  <li key={`action-${act.slice(0, 20)}`}>{act}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Clinical Summary */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-700 dark:text-cyan-300 block mb-0.5 font-bold">
                Gemini Vision Diagnostic Assessment:
              </strong>
              <span>{auditResult.summary}</span>
            </div>
          </div>

          {/* Hazards & DIY Remedies 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detected Hazards */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>{t.hazardsFound}</span>
              </div>

              {auditResult.hazardsIdentified.map((hazard) => (
                <div
                  key={`hazard-${hazard.hazard}-${hazard.severity}`}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {hazard.hazard}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        hazard.severity === 'critical' || hazard.severity === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {hazard.severity} severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {hazard.description}
                  </p>
                  <div className="mt-2 text-[11px] font-semibold text-rose-500">
                    +~{hazard.estimatedPm25ContributionUg} µg/m³ PM2.5 contribution
                  </div>
                </div>
              ))}
            </div>

            {/* DIY Low-Cost Remedies */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <Wrench className="w-4 h-4 text-emerald-500" />
                <span>{t.diyRemedies}</span>
              </div>

              {auditResult.diyFixes.map((fix) => (
                <div
                  key={`fix-${fix.title}-${fix.costTier}`}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {fix.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Cost: {fix.costTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {fix.action}
                  </p>
                  <div className="mt-2 text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Expected PM2.5 drop: ~{fix.expectedPm25DropPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corsi-Rosenthal Box Sizing Card */}
          {auditResult.crBoxSizing && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 border border-emerald-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-400">
                    <Wind className="w-4 h-4" />
                    <span>{t.crBoxCardTitle}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {auditResult.crBoxSizing.recommendedUnits} x 4-Filter MERV-13 Box Fan Unit
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    Delivers {auditResult.crBoxSizing.requiredCadrCfm} CFM of certified particulate filtration. Cleans 90% of indoor smoke in {auditResult.crBoxSizing.timeTo90PctClearanceMinutes} minutes.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">DIY Cost vs Commercial</div>
                    <div className="text-lg font-black text-emerald-500">
                      ₹{auditResult.crBoxSizing.diyCostEstimateInr}{' '}
                      <span className="text-xs text-slate-400 line-through">
                        ₹{auditResult.crBoxSizing.commercialHepaCostInr}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-400">
                      Save {auditResult.crBoxSizing.savingsPct}%
                    </div>
                  </div>

                  <button
                    onClick={onOpenCrModal}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition"
                  >
                    Build Guide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Air-Purifying Plants */}
          {auditResult.plantsRecommended && auditResult.plantsRecommended.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white mb-3">
                <Flower2 className="w-4 h-4 text-emerald-500" />
                <span>{t.airPlantsTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {auditResult.plantsRecommended.map((plant) => (
                  <div
                    key={`plant-${plant.name}-${plant.targetPollutant}`}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {plant.name}
                      </div>
                      <div className="text-xs font-semibold text-emerald-500 mt-0.5">
                        Targets: {plant.targetPollutant}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {plant.airBenefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
