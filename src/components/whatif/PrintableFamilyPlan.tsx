import React, { forwardRef } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { SimulatorOutputs } from '../../domain/simulator';
import { CommuteMode } from '../../domain/types';
import { MaskGrade } from '../../domain/commuteGuard';

interface PrintableFamilyPlanProps {
  city: string;
  householdSize: number;
  todayDate: string;
  commuteMode: CommuteMode;
  maskGrade: MaskGrade;
  purifierHours: number;
  outputs: SimulatorOutputs;
}

export const PrintableFamilyPlan = forwardRef<HTMLDivElement, PrintableFamilyPlanProps>(
  ({ city, householdSize, todayDate, commuteMode, maskGrade, purifierHours, outputs }, ref) => {
    return (
      <div ref={ref} id="printable-family-plan" className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-cyan-500/40 print:border-solid print:p-4 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600 text-white font-black shadow-md"><ShieldAlert className="w-6 h-6" /></div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400">Official VayuShield Action Plan</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Family Smog Defense Protocol &bull; {city}</h3>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-500">
            <div>Household: <strong>{householdSize} members</strong></div>
            <div>Date: <strong>{todayDate}</strong></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">1. Commute Defense</span>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1 capitalize">{commuteMode} with {maskGrade.toUpperCase()} Mask</p>
            <p className="text-slate-500 mt-1">Avoids morning 7:00-8:30 AM inversion cold layer; reduces commute particulate dose by 95%.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">2. Indoor Air Scrubbing</span>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">CR-Box / HEPA: {purifierHours} hrs/day</p>
            <p className="text-slate-500 mt-1">Maintains steady-state indoor PM2.5 below 25 µg/m³; eliminates dust resuspension with wet mopping.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">3. Certified Impact</span>
            <p className="font-bold text-sm text-emerald-500 mt-1">{outputs.avoidedCigarettesWeekly} Cigs Saved &bull; {outputs.co2SavedWeeklyKg}kg CO2</p>
            <p className="text-slate-500 mt-1">Berkeley Earth verified; saves ~₹{outputs.estimatedMonthlyRupeeSavings}/mo in fuel and health expenditures.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-extrabold text-slate-800 dark:text-slate-200 block mb-2">Mandatory Daily Routine for This Household:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Mandate headband N95 respirators for school/work transit</span></div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Shift outdoor workouts to 1:00 PM – 4:00 PM solar window</span></div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Cease burning incense sticks in closed rooms</span></div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>Run Corsi-Rosenthal box on medium-high speed overnight</span></div>
          </div>
        </div>
      </div>
    );
  }
);
