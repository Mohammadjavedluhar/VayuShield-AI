import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickQuestionsBarProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export const QuickQuestionsBar: React.FC<QuickQuestionsBarProps> = ({
  questions,
  onSelectQuestion,
}) => {
  return (
    <div className="py-2 shrink-0">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {questions.map((q) => (
          <button
            key={`quick-q-${q.slice(0, 20)}`}
            type="button"
            onClick={() => onSelectQuestion(q)}
            className="text-left text-xs px-2.5 py-1 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition whitespace-nowrap flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-cyan-500" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
