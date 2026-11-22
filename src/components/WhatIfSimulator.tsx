import React, { useRef, useState } from 'react';
import { Printer, Sliders } from 'lucide-react';
import { runWhatIfSimulation } from '../domain/simulator';
import { CommuteMode, CookingFuel, HouseholdProfile } from '../domain/types';
import { MaskGrade } from '../domain/commuteGuard';
import { Language } from '../i18n/translations';
import { SimulatorControls } from './whatif/SimulatorControls';
import { SimulatorMetricsStrip } from './whatif/SimulatorMetricsStrip';
import { PrintableFamilyPlan } from './whatif/PrintableFamilyPlan';

interface WhatIfSimulatorProps {
  ambientPm25: number;
  profile: HouseholdProfile;
  city: string;
  language?: Language;
}

/**
 * WhatIfSimulator - Interactive Family Policy Sandbox with dynamic savings calculations.
 */
export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  ambientPm25,
  profile,
  city,
}) => {
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(profile.commuteDistanceKm || 12);
  const [commuteMode, setCommuteMode] = useState<CommuteMode>('metro');
  const [purifierHours, setPurifierHours] = useState<number>(18);
  const [maskGrade, setMaskGrade] = useState<MaskGrade>('n95');
  const [cookingFuel, setCookingFuel] = useState<CookingFuel>('induction');
  const [todayDate] = useState(() => 'Winter 2025-2026');

  const printPlanRef = useRef<HTMLDivElement>(null);

  const outputs = runWhatIfSimulation({
    ambientPm25,
    commuteDistanceKm,
    commuteDaysPerWeek: 5,
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
          type="button"
          onClick={handlePrintPlan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/20 hover:opacity-95 transition self-start sm:self-auto min-h-[44px]"
        >
          <Printer className="w-4 h-4" />
          <span>Download Family Plan (Print/PDF)</span>
        </button>
      </div>

      {/* Simulator Sliders & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <SimulatorControls
          commuteDistanceKm={commuteDistanceKm}
          setCommuteDistanceKm={setCommuteDistanceKm}
          purifierHours={purifierHours}
          setPurifierHours={setPurifierHours}
          commuteMode={commuteMode}
          setCommuteMode={setCommuteMode}
          maskGrade={maskGrade}
          setMaskGrade={setMaskGrade}
          cookingFuel={cookingFuel}
          setCookingFuel={setCookingFuel}
        />
        <SimulatorMetricsStrip outputs={outputs} />
      </div>

      <PrintableFamilyPlan
        ref={printPlanRef}
        city={city}
        householdSize={profile.householdSize}
        todayDate={todayDate}
        commuteMode={commuteMode}
        maskGrade={maskGrade}
        purifierHours={purifierHours}
        outputs={outputs}
      />
    </div>
  );
};
