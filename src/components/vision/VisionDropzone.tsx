import React, { useState } from 'react';
import { Eye, Image as ImageIcon, Upload } from 'lucide-react';

interface VisionDropzoneProps {
  selectedPreview: string;
  roomContext: string;
  setRoomContext: (ctx: string) => void;
  onFileUpload: (file: File) => void;
  onScanClick: () => void;
  isLoading: boolean;
  dragDropText: string;
  roomContextLabel: string;
  roomContextPlaceholder: string;
  scanPhotoBtn: string;
  scanningLoading: string;
}

/**
 * VisionDropzone - Interactive drag and drop file upload with camera capture and context input.
 */
export const VisionDropzone: React.FC<VisionDropzoneProps> = ({
  selectedPreview,
  roomContext,
  setRoomContext,
  onFileUpload,
  onScanClick,
  isLoading,
  dragDropText,
  roomContextLabel,
  roomContextPlaceholder,
  scanPhotoBtn,
  scanningLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="flex flex-col">
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
            onFileUpload(e.dataTransfer.files[0]);
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
              onFileUpload(e.target.files[0]);
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
                {dragDropText}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports JPG, PNG, WEBP, or live camera capture
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
          {roomContextLabel}
        </label>
        <input
          type="text"
          value={roomContext}
          onChange={(e) => setRoomContext(e.target.value)}
          placeholder={roomContextPlaceholder}
          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[44px]"
        />
      </div>

      <button
        onClick={onScanClick}
        disabled={isLoading}
        className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30 hover:opacity-95 disabled:opacity-40 transition flex items-center justify-center gap-2 min-h-[44px]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{scanningLoading}</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span>{scanPhotoBtn}</span>
          </>
        )}
      </button>
    </div>
  );
};
