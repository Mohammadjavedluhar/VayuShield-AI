import React, { useState } from 'react';
import { Camera, Wrench } from 'lucide-react';
import { VisionAuditResult } from '../domain/types';
import { Language, translations } from '../i18n/translations';
import { CardSectionHeader } from './common/CardSectionHeader';
import { SAMPLE_PHOTOS, SamplePhoto } from './vision/samplePhotos';
import { VisionSamplePicker } from './vision/VisionSamplePicker';
import { VisionDropzone } from './vision/VisionDropzone';
import { VisionAuditResults } from './vision/VisionAuditResults';

interface VisionAuditProps {
  onRunVisionApi: (imageBase64: string, mimeType: string, roomContext?: string) => Promise<void>;
  auditResult: VisionAuditResult | null;
  isLoading: boolean;
  language: Language;
  onOpenCrModal: () => void;
}

/**
 * VisionAudit - Gemini 2.5 Flash Multimodal Vision Auditor for room hazards, masks, and filters.
 */
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
    const base64 = btoa(sample.svgPreview);
    onRunVisionApi(base64, 'image/svg+xml', sample.context);
  };

  const handleScanClick = () => {
    if (selectedPreview) {
      const b64 = selectedPreview.includes('base64,')
        ? selectedPreview.split('base64,')[1]
        : btoa(selectedPreview);
      onRunVisionApi(b64, 'image/jpeg', roomContext);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <CardSectionHeader
        icon={<Camera className="w-4 h-4 text-cyan-500" />}
        badgeText="Gemini 2.5 Flash Multimodal Vision"
        title={t.scannerTitle}
        subtitle={t.scannerSubtitle}
        rightAction={
          <button
            onClick={onOpenCrModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition self-start sm:self-auto min-h-[44px]"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>DIY Box Calculator</span>
          </button>
        }
      />

      {/* Upload Zone & Preloaded Samples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-6">
          <VisionDropzone
            selectedPreview={selectedPreview}
            roomContext={roomContext}
            setRoomContext={setRoomContext}
            onFileUpload={handleFileUpload}
            onScanClick={handleScanClick}
            isLoading={isLoading}
            dragDropText={t.dragDropText}
            roomContextLabel={t.roomContextLabel}
            roomContextPlaceholder={t.roomContextPlaceholder}
            scanPhotoBtn={t.scanPhotoBtn}
            scanningLoading={t.scanningLoading}
          />
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between">
          <VisionSamplePicker
            onSelectSample={handleSelectSample}
            title={t.quickSamplePhotos}
          />
        </div>
      </div>

      {auditResult && (
        <VisionAuditResults
          auditResult={auditResult}
          onOpenCrModal={onOpenCrModal}
          hazardsFoundText={t.hazardsFound}
          diyRemediesText={t.diyRemedies}
          crBoxCardTitleText={t.crBoxCardTitle}
          airPlantsTitleText={t.airPlantsTitle}
        />
      )}
    </div>
  );
};
