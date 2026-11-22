import React from 'react';
import type { AirPurifierType, IncenseType, IndoorCookingType, WindowSealType } from '../../domain/indoorModel';

interface IndoorControlsProps {
  windowSeal: WindowSealType;
  cookingFuel: IndoorCookingType;
  incenseUsage: IncenseType;
  airPurifier: AirPurifierType;
  onWindowSealChange: (val: WindowSealType) => void;
  onCookingFuelChange: (val: IndoorCookingType) => void;
  onIncenseUsageChange: (val: IncenseType) => void;
  onAirPurifierChange: (val: AirPurifierType) => void;
}

export const IndoorControls: React.FC<IndoorControlsProps> = ({
  windowSeal,
  cookingFuel,
  incenseUsage,
  airPurifier,
  onWindowSealChange,
  onCookingFuelChange,
  onIncenseUsageChange,
  onAirPurifierChange,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
      <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
        Adjust Your Home Envelope &amp; Internal Sources
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="indoor-window-seal" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Window &amp; Balcony Seal (P)
          </label>
          <select
            id="indoor-window-seal"
            value={windowSeal}
            onChange={(e) => onWindowSealChange(e.target.value as WindowSealType)}
            className="w-full px-3 py-2.5 min-h-[44px] text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="weathersealed">Weathersealed Tape (P = 0.40)</option>
            <option value="standard_closed">Standard Closed (P = 0.65)</option>
            <option value="leaky_drafty">Leaky Single-Pane (P = 0.85)</option>
            <option value="open_windows">Open Windows (P = 1.00)</option>
          </select>
        </div>

        <div>
          <label htmlFor="indoor-cooking-fuel" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Kitchen Cooking Source
          </label>
          <select
            id="indoor-cooking-fuel"
            value={cookingFuel}
            onChange={(e) => onCookingFuelChange(e.target.value as IndoorCookingType)}
            className="w-full px-3 py-2.5 min-h-[44px] text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="induction">Clean Induction (0 µg/h)</option>
            <option value="lpg_with_exhaust">LPG with Chimney Exhaust</option>
            <option value="lpg_unvented">Unvented LPG Stove (+4,500 µg/h)</option>
            <option value="biomass_chulha">Biomass Chulha (+19,500 µg/h)</option>
          </select>
        </div>

        <div>
          <label htmlFor="indoor-incense-usage" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Puja Incense / Agarbatti
          </label>
          <select
            id="indoor-incense-usage"
            value={incenseUsage}
            onChange={(e) => onIncenseUsageChange(e.target.value as IncenseType)}
            className="w-full px-3 py-2.5 min-h-[44px] text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="none">None / Flameless LED (0 µg/h)</option>
            <option value="single_stick">1 Agarbatti Stick (+2,600 µg/h)</option>
            <option value="multiple_dhoop">Multiple Dhoop Cones (+7,200 µg/h)</option>
          </select>
        </div>

        <div>
          <label htmlFor="indoor-air-purifier" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Active Air Purifier
          </label>
          <select
            id="indoor-air-purifier"
            value={airPurifier}
            onChange={(e) => onAirPurifierChange(e.target.value as AirPurifierType)}
            className="w-full px-3 py-2.5 min-h-[44px] text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="diy_corsi_rosenthal">Corsi-Rosenthal Box (350 CFM)</option>
            <option value="none">No Purifier Running (0 CFM)</option>
            <option value="hepa_h13">Commercial HEPA (220 CFM)</option>
            <option value="dual_purifiers">Dual Purifiers (550 CFM)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
