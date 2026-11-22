import React from 'react';
import { SAMPLE_PHOTOS, SamplePhoto } from './samplePhotos';

interface VisionSamplePickerProps {
  onSelectSample: (sample: SamplePhoto) => void;
  title: string;
}

/**
 * VisionSamplePicker - Grid of lightweight SVG indoor and respirator test scenes.
 */
export const VisionSamplePicker: React.FC<VisionSamplePickerProps> = ({
  onSelectSample,
  title,
}) => {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SAMPLE_PHOTOS.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelectSample(sample)}
            className="text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 hover:bg-cyan-500/5 transition group flex flex-col justify-between min-h-[44px]"
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
  );
};
