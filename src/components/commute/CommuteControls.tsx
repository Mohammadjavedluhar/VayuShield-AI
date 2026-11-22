import React from 'react';
import type { CommuterType, MaskGrade, TravelMode } from '../../domain/commuteGuard';

interface CommuteControlsProps {
  commuterType: CommuterType;
  departureTime: string;
  travelMode: TravelMode;
  currentMask: MaskGrade;
  onCommuterTypeChange: (val: CommuterType) => void;
  onDepartureTimeChange: (val: string) => void;
  onTravelModeChange: (val: TravelMode) => void;
  onCurrentMaskChange: (val: MaskGrade) => void;
}

export const CommuteControls: React.FC<CommuteControlsProps> = ({
  commuterType,
  departureTime,
  travelMode,
  currentMask,
  onCommuterTypeChange,
  onDepartureTimeChange,
  onTravelModeChange,
  onCurrentMaskChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <div>
        <label htmlFor="commute-commuter-type" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
          Commuter Vulnerability
        </label>
        <select
          id="commute-commuter-type"
          value={commuterType}
          onChange={(e) => onCommuterTypeChange(e.target.value as CommuterType)}
          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
        >
          <option value="child">🎒 School Child (Higher ventilation / kg)</option>
          <option value="elderly">👴 Elderly Family Member</option>
          <option value="asthma_patient">🫁 Asthma / COPD Patient</option>
          <option value="adult">👤 Standard Adult</option>
        </select>
      </div>

      <div>
        <label htmlFor="commute-departure-time" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
          Departure Time
        </label>
        <select
          id="commute-departure-time"
          value={departureTime}
          onChange={(e) => onDepartureTimeChange(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
        >
          <option value="06:45">6:45 AM (Severe compressed smog)</option>
          <option value="07:15">7:15 AM (Morning school bell)</option>
          <option value="07:45">7:45 AM (Office rush peak)</option>
          <option value="08:15">8:15 AM (Sun rising)</option>
          <option value="08:45">8:45 AM (Solar dispersion begins)</option>
          <option value="09:15">9:15 AM (Inversion breaking)</option>
        </select>
      </div>

      <div>
        <label htmlFor="commute-transit-mode" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
          Transit Mode
        </label>
        <select
          id="commute-transit-mode"
          value={travelMode}
          onChange={(e) => onTravelModeChange(e.target.value as TravelMode)}
          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
        >
          <option value="bus">🚌 School / Public Bus</option>
          <option value="two_wheeler">🛵 Two-Wheeler / Motorcycle</option>
          <option value="auto_rickshaw">🛺 Auto Rickshaw</option>
          <option value="closed_car">🚗 Car (AC Recirculate)</option>
          <option value="metro">🚇 Metro Train (Filtered)</option>
          <option value="open_walk_cycle">🚶 Walking / Cycling</option>
        </select>
      </div>

      <div>
        <label htmlFor="commute-current-mask" className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
          Current Mask Worn
        </label>
        <select
          id="commute-current-mask"
          value={currentMask}
          onChange={(e) => onCurrentMaskChange(e.target.value as MaskGrade)}
          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
        >
          <option value="cloth">Cloth Mask (~20% filtration)</option>
          <option value="none">No Mask (Bare Breathing 0%)</option>
          <option value="surgical">Surgical Mask (~35% filtration)</option>
          <option value="kn95">KN95 Ear Loop (~90% filtration)</option>
          <option value="n95">Certified N95 / FFP2 (~95% tight seal)</option>
        </select>
      </div>
    </div>
  );
};
