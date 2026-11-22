import React from 'react';
import { Info, Sun } from 'lucide-react';
import type { MorningCommuteVerdict } from '../../domain/commuteGuard';

interface CommuteVerdictBannerProps {
  verdict: MorningCommuteVerdict;
  city: string;
}

export const CommuteVerdictBanner: React.FC<CommuteVerdictBannerProps> = ({ verdict, city }) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950 text-white border border-rose-500/30 my-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-rose-400">
            <span>Ground Inversion Impact Verdict</span>
            <span>&bull;</span>
            <span>{city}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {verdict.maskVerdict}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {verdict.maskRecommendation}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[120px]">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">WHO Dose Ratio</span>
            <span className="text-3xl font-black text-rose-400">
              {verdict.whoSafeLimitMultiplier}x
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">above safe limit</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[120px]">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Effective PM2.5</span>
            <span className="text-3xl font-black text-white">
              {verdict.effectiveAmbientPm25}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">µg/m³ ground smog</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-amber-300">
              {verdict.delayedDepartureSavingsPct > 15
                ? `Delaying departure by 45 mins cuts inhale dose by ${verdict.delayedDepartureSavingsPct}%!`
                : 'Commute Schedule Optimal for current window'}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {verdict.departureShiftAdvice}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Optimal Window</span>
          <span className="text-lg font-black text-emerald-400">{verdict.suggestedDepartureTime} AM</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-300 flex items-center gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span><strong>Route Advice:</strong> {verdict.routeModeAdvice}</span>
      </div>
    </div>
  );
};
