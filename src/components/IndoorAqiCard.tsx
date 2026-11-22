import React, { useState } from 'react';
import { Cpu, Wrench } from 'lucide-react';
import {
  AirPurifierType,
  estimateIndoorAirQuality,
  IncenseType,
  IndoorCookingType,
  VentilationRateType,
  WindowSealType,
} from '../domain/indoorModel';
import { getAqiColorTheme } from '../domain/airQuality';
import { Language } from '../i18n/translations';
import { IndoorGauges } from './indoor/IndoorGauges';
import { IndoorControls } from './indoor/IndoorControls';
import { IndoorPhysicsBreakdown } from './indoor/IndoorPhysicsBreakdown';

interface IndoorAqiCardProps {
  outdoorPm25: number;
  city: string;
  language?: Language;
  onOpenCrModal: () => void;
}

export const IndoorAqiCard: React.FC<IndoorAqiCardProps> = ({
  outdoorPm25,
  city,
  onOpenCrModal,
}) => {
  const [windowSeal, setWindowSeal] = useState<WindowSealType>('standard_closed');
  const [cookingFuel, setCookingFuel] = useState<IndoorCookingType>('lpg_unvented');
  const [incenseUsage, setIncenseUsage] = useState<IncenseType>('single_stick');
  const ventilationRate: VentilationRateType = 'moderate_natural';
  const [airPurifier, setAirPurifier] = useState<AirPurifierType>('diy_corsi_rosenthal');
  const roomAreaSqFt = 220;

  const result = estimateIndoorAirQuality({
    outdoorPm25,
    windowSeal,
    cookingFuel,
    incenseUsage,
    ventilationRate,
    airPurifier,
    roomAreaSqFt,
  });

  const outdoorTheme = getAqiColorTheme(
    result.outdoorAqi > 300
      ? 'hazardous'
      : result.outdoorAqi > 200
      ? 'veryUnhealthy'
      : result.outdoorAqi > 150
      ? 'unhealthy'
      : 'moderate'
  );

  const indoorTheme = getAqiColorTheme(result.indoorCategory);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>EPA Mass-Balance Physics Simulation (No Hardware Needed)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Real-Time Indoor AQI Estimator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Simulates indoor particulate steady-state using ambient Open-Meteo readings, building penetration factor (P), and internal generation sources.
          </p>
        </div>

        <button
          onClick={onOpenCrModal}
          className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition self-start sm:self-auto"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>DIY Purifier CADR</span>
        </button>
      </div>

      <IndoorGauges
        city={city}
        result={result}
        outdoorTheme={outdoorTheme}
        indoorTheme={indoorTheme}
      />

      <IndoorControls
        windowSeal={windowSeal}
        cookingFuel={cookingFuel}
        incenseUsage={incenseUsage}
        airPurifier={airPurifier}
        onWindowSealChange={setWindowSeal}
        onCookingFuelChange={setCookingFuel}
        onIncenseUsageChange={setIncenseUsage}
        onAirPurifierChange={setAirPurifier}
      />

      <IndoorPhysicsBreakdown result={result} />
    </div>
  );
};
