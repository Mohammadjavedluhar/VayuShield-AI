import React, { useState } from 'react';
import {
  CheckCircle2,
  DollarSign,
  Info,
  ShieldCheck,
  Wind,
  Wrench,
  X,
} from 'lucide-react';
import { calculateCorsiRosenthalSizing } from '../domain/impactEngine';
import { Language, translations } from '../i18n/translations';

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
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

        {/* Input Sliders */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>{t.roomArea}: {roomArea} sq. ft.</span>
              <span className="text-slate-400">~{Math.round(roomArea * 0.0929)} m²</span>
            </div>
            <input
              type="range"
              min={60}
              max={1000}
              step={10}
              value={roomArea}
              onChange={(e) => setRoomArea(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.ceilingHeight}: {ceilingHeight} ft
              </label>
              <input
                type="number"
                min={7}
                max={18}
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(Math.max(7, parseInt(e.target.value, 10) || 9))}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.targetAch}: {targetAch} ACH
              </label>
              <select
                value={targetAch}
                onChange={(e) => setTargetAch(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value={3}>3 ACH (Moderate air)</option>
                <option value={5}>5 ACH (Severe Smog / Wildfire Standard)</option>
                <option value={6}>6 ACH (Clinical / Vulnerable Asthma)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Math Output Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">Required CADR</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {sizing.requiredCadrCfm}
            </div>
            <span className="text-[10px] text-slate-500">CFM clean air</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">Recommended Units</span>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
              {sizing.recommendedUnits}
            </div>
            <span className="text-[10px] text-slate-500">20" Box Fan Units</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">90% Clearance</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {sizing.timeTo90PctClearanceMinutes} <span className="text-sm font-normal">min</span>
            </div>
            <span className="text-[10px] text-slate-500">Fast room scrub</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">Estimated Savings</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {sizing.savingsPct}%
            </div>
            <span className="text-[10px] text-slate-500">vs commercial HEPA</span>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 block">DIY Cost (Box fan + 4 MERV-13 filters + tape):</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
              ₹{sizing.diyCostEstimateInr} INR
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Commercial HEPA Equivalent ({sizing.requiredCadrCfm} CFM):</span>
            <span className="font-extrabold text-slate-400 line-through text-base">
              ₹{sizing.commercialHepaCostInr} INR
            </span>
          </div>
        </div>

        {/* Step-by-Step 4-Step Build Guide */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            {t.howToBuild}
          </h4>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white">Form the Cube:</strong> Tape four 20"x20"x1" or 2" MERV-13 furnace filters into a 4-sided cube. Ensure the airflow arrows on all four filters point <em>inward toward the center</em>.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white">Seal the Bottom:</strong> Cut a 20"x20" square piece of corrugated cardboard and seal it firmly to the bottom of the filter cube using duct tape or painter's tape.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white">Mount the Box Fan:</strong> Place a standard 20-inch box fan on top of the cube facing <em>upwards</em> so air blows upward into the room. Tape the fan edges completely airtight to the filter tops.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                4
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white">Add the Cardboard Donut Shroud:</strong> Cut a 14-inch circular opening in a cardboard square and tape it over the fan face. This stops corner vortex recirculation and boosts airflow pressure by ~40%!
              </div>
            </div>
          </div>
        </div>

        {/* Modal Close Button */}
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
