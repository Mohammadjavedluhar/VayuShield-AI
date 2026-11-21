import React, { useRef, useState } from 'react';
import {
  Award,
  Bike,
  Building,
  CheckCircle2,
  Download,
  Flame,
  Leaf,
  Printer,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Train,
  Zap,
} from 'lucide-react';
import { runWhatIfSimulation } from '../domain/simulator';
import { CommuteMode, CookingFuel, HouseholdProfile } from '../domain/types';
import { MaskGrade } from '../domain/commuteGuard';
import { Language, translations } from '../i18n/translations';

interface WhatIfSimulatorProps {
  ambientPm25: number;
  profile: HouseholdProfile;
  city: string;
  language: Language;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  ambientPm25,
  profile,
  city,
  language,
}) => {
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(profile.commuteDistanceKm || 12);
  const [commuteDays, setCommuteDays] = useState<number>(5);
  const [commuteMode, setCommuteMode] = useState<CommuteMode>('metro');
  const [purifierHours, setPurifierHours] = useState<number>(18);
  const [maskGrade, setMaskGrade] = useState<MaskGrade>('n95');
  const [cookingFuel, setCookingFuel] = useState<CookingFuel>('induction');

  const printPlanRef = useRef<HTMLDivElement>(null);

  const outputs = runWhatIfSimulation({
    ambientPm25,
    commuteDistanceKm,
    commuteDaysPerWeek: commuteDays,
    commuteMode,
    baselineCommuteMode: 'car',
    purifierRuntimeHours: purifierHours,
    maskGrade,
    cookingFuel,
    baselineCookingFuel: 'lpg',
    householdSize: profile.householdSize,
  });

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Sliders className="w-4 h-4 text-cyan-500" />
            <span>Interactive Family Policy Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            "What-If" Policy Simulator &amp; Printable Action Plan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Slide runtime hours, transit modes, and cooking fuels to dynamically compute custom household health and financial savings.
          </p>
        </div>

        <button
          onClick={handlePrintPlan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/20 hover:opacity-95 transition self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Download Family Plan (Print/PDF)</span>
        </button>
      </div>

      {/* Simulator Sliders & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-1">
            Simulation Parameters
          </div>

          {/* Slider 1: Commute Distance */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>One-Way Commute Distance: {commuteDistanceKm} km</span>
              <span className="text-slate-400">Round trip: {commuteDistanceKm * 2} km</span>
            </div>
            <input
              type="range"
              min={2}
              max={40}
              step={1}
              value={commuteDistanceKm}
              onChange={(e) => setCommuteDistanceKm(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-cyan-500"
            />
          </div>

          {/* Slider 2: Purifier Runtime Hours */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Air Purifier / CR Box Runtime: {purifierHours} hours / day</span>
              <span className="text-cyan-500 font-extrabold">
                {purifierHours >= 20 ? 'Continuous Clean' : purifierHours >= 12 ? 'Overnight + Evening' : 'Part-time'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={24}
              step={1}
              value={purifierHours}
              onChange={(e) => setPurifierHours(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-emerald-500"
            />
          </div>

          {/* Commute Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Commute Transition
              </label>
              <select
                value={commuteMode}
                onChange={(e) => setCommuteMode(e.target.value as CommuteMode)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="metro">🚇 Electric Metro Train</option>
                <option value="carpool">🚌 Shared Carpool / Bus</option>
                <option value="ev">⚡ Electric Scooter / EV</option>
                <option value="walkOrCycle">🚲 Walking / Cycling (with N95)</option>
                <option value="car">🚗 Solo Car (No change)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Outdoor Mask Grade
              </label>
              <select
                value={maskGrade}
                onChange={(e) => setMaskGrade(e.target.value as MaskGrade)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="n95">Certified N95 (95% cut)</option>
                <option value="kn95">KN95 Ear Loop (90% cut)</option>
                <option value="surgical">Surgical Mask (35% cut)</option>
                <option value="cloth">Cloth Mask (20% cut)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Kitchen Cooking Fuel
              </label>
              <select
                value={cookingFuel}
                onChange={(e) => setCookingFuel(e.target.value as CookingFuel)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="induction">⚡ Clean Induction Plate</option>
                <option value="lpg">🔥 LPG Gas Burner</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Live Calculated Results */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Inhaled PM2.5 Drop</span>
            <div className="text-3xl sm:text-4xl font-black text-cyan-500 my-1">
              {outputs.inhaledPm25ReductionPct}%
            </div>
            <span className="text-[11px] text-cyan-700 dark:text-cyan-300">
              EPA Exposure Model
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Avoided Smoke</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-500 my-1">
              {outputs.avoidedCigarettesWeekly}
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300">
              Cigarettes / week (Household)
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">CO2 Saved</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-500 my-1">
              {outputs.co2SavedWeeklyKg} <span className="text-sm font-normal">kg</span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
              {outputs.annualCo2SavedKg} kg / year
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Est. Monthly Savings</span>
            <div className="text-3xl sm:text-4xl font-black text-purple-500 my-1">
              ₹{outputs.estimatedMonthlyRupeeSavings}
            </div>
            <span className="text-[11px] text-purple-700 dark:text-purple-300">
              Fuel + Health clinic visits
            </span>
          </div>
        </div>
      </div>

      {/* Printable Family Action Plan Card (Styled for WhatsApp sharing & Print) */}
      <div
        ref={printPlanRef}
        id="printable-family-plan"
        className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-cyan-500/40 print:border-solid print:p-4 text-slate-900 dark:text-slate-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600 text-white font-black shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400">
                Official VayuShield Action Plan
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Family Smog Defense Protocol &bull; {city}
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500">
            <div>Household: <strong>{profile.householdSize} members</strong></div>
            <div>Date: <strong>{new Date().toLocaleDateString()}</strong></div>
          </div>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">1. Commute Defense</span>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1 capitalize">
              {commuteMode} with {maskGrade.toUpperCase()} Mask
            </p>
            <p className="text-slate-500 mt-1">
              Avoids morning 7:00-8:30 AM inversion cold layer; reduces commute particulate dose by 95%.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">2. Indoor Air Scrubbing</span>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">
              CR-Box / HEPA: {purifierHours} hrs/day
            </p>
            <p className="text-slate-500 mt-1">
              Maintains steady-state indoor PM2.5 below 25 µg/m³; eliminates dust resuspension with wet mopping.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">3. Certified Impact</span>
            <p className="font-bold text-sm text-emerald-500 mt-1">
              {outputs.avoidedCigarettesWeekly} Cigs Saved &bull; {outputs.co2SavedWeeklyKg}kg CO2
            </p>
            <p className="text-slate-500 mt-1">
              Berkeley Earth verified; saves ~₹{outputs.estimatedMonthlyRupeeSavings}/mo in fuel and health expenditures.
            </p>
          </div>
        </div>

        {/* Action Checklist */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-extrabold text-slate-800 dark:text-slate-200 block mb-2">
            Mandatory Daily Routine for This Household:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Mandate headband N95 respirators for school/work transit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Shift outdoor workouts to 1:00 PM – 4:00 PM solar window</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Cease burning incense sticks in closed rooms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Run Corsi-Rosenthal box on medium-high speed overnight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
