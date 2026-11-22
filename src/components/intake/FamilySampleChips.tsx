import React from 'react';
import { Sparkles } from 'lucide-react';

interface FamilySampleChipsProps {
  samples: string[];
  onSelectSample: (sample: string) => void;
  title: string;
}

/**
 * FamilySampleChips - Displays preloaded sample scenario prompts.
 */
export const FamilySampleChips: React.FC<FamilySampleChipsProps> = ({
  samples,
  onSelectSample,
  title,
}) => {
  return (
    <div className="mt-3">
      <span className="text-xs font-semibold text-slate-400 block mb-1.5">{title}</span>
      <div className="flex flex-wrap gap-2">
        {samples.map((sample) => (
          <button
            key={`sample-prompt-${sample.slice(0, 25)}`}
            type="button"
            onClick={() => onSelectSample(sample)}
            className="text-left text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition flex items-center gap-1.5 min-h-[36px]"
          >
            <Sparkles className="w-3 h-3 text-cyan-500 shrink-0" />
            <span className="truncate max-w-xs">{sample}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
