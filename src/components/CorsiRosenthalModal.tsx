import React, { useState } from 'react';
import { Wrench, X } from 'lucide-react';
import { calculateCorsiRosenthalSizing } from '../domain/impactEngine';
import { Language, translations } from '../i18n/translations';
import { CrStatsGrid } from './cr/CrStatsGrid';
import { CrBuildGuide } from './cr/CrBuildGuide';

interface CorsiRosenthalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const CorsiRosenthalModal: React.FC<CorsiRosenthalModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [roomArea, setRoomArea] = useState<number>(220);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [targetAch, setTargetAch] = useState<number>(5);

  if (!isOpen) return null;

  const sizing = calculateCorsiRosenthalSizing(roomArea, ceilingHeight, targetAch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Wrench className="w-4 h-4 text-emerald-500" />
          <span>Scientifically Validated Open-Source Filtration</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          {t.crModalTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.crModalSubtitle}
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <label htmlFor="cr-room-area">{t.roomArea}: {roomArea} sq. ft.</label>
              <span className="text-slate-400">~{Math.round(roomArea * 0.0929)} m²</span>
            </div>
            <input
              id="cr-room-area"
              type="range"
              min={60}
              max={1000}
              step={10}
              value={roomArea}
              onChange={(e) => setRoomArea(Number.parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cr-ceiling-height" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.ceilingHeight}: {ceilingHeight} ft
              </label>
              <input
                id="cr-ceiling-height"
                type="number"
                min={7}
                max={18}
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(Math.max(7, Number.parseInt(e.target.value, 10) || 9))}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label htmlFor="cr-target-ach" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.targetAch}: {targetAch} ACH
              </label>
              <select
                id="cr-target-ach"
                value={targetAch}
                onChange={(e) => setTargetAch(Number.parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value={3}>3 ACH (Moderate air)</option>
                <option value={5}>5 ACH (Severe Smog / Wildfire Standard)</option>
                <option value={6}>6 ACH (Clinical / Vulnerable Asthma)</option>
              </select>
            </div>
          </div>
        </div>

        <CrStatsGrid sizing={sizing} />
        <CrBuildGuide howToBuildTitle={t.howToBuild} />

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
