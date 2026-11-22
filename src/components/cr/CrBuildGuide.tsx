import React from 'react';

interface CrBuildGuideProps {
  howToBuildTitle: string;
}

export const CrBuildGuide: React.FC<CrBuildGuideProps> = ({ howToBuildTitle }) => {
  return (
    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
        {howToBuildTitle}
      </h4>

      <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
            1
          </span>
          <div>
            <strong className="text-slate-900 dark:text-white">Form the Cube:</strong> Tape four 20"x20"x1" or 2" MERV-13 furnace filters into a 4-sided cube. Ensure the airflow arrows point <em>inward toward the center</em>.
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
            2
          </span>
          <div>
            <strong className="text-slate-900 dark:text-white">Seal the Bottom:</strong> Cut a 20"x20" square piece of corrugated cardboard and seal it firmly to the bottom of the filter cube using tape.
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
            3
          </span>
          <div>
            <strong className="text-slate-900 dark:text-white">Mount the Box Fan:</strong> Place a 20-inch box fan on top facing <em>upwards</em> so air blows upward. Tape the fan edges completely airtight.
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
            4
          </span>
          <div>
            <strong className="text-slate-900 dark:text-white">Add Cardboard Shroud:</strong> Cut a 14-inch circular opening in a cardboard square and tape it over the fan face to eliminate vortex recirculation.
          </div>
        </div>
      </div>
    </div>
  );
};
