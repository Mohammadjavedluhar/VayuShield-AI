import React from 'react';
import { Check, Copy, Share2 } from 'lucide-react';

interface PledgeShareActionsProps {
  onWhatsApp: () => void;
  onCopy: () => void;
  copied: boolean;
  shareOnWhatsAppText: string;
  copyShareText: string;
  copiedAlert: string;
}

export const PledgeShareActions: React.FC<PledgeShareActionsProps> = ({
  onWhatsApp,
  onCopy,
  copied,
  shareOnWhatsAppText,
  copyShareText,
  copiedAlert,
}) => {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onWhatsApp}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition"
      >
        <Share2 className="w-4 h-4" />
        <span>{shareOnWhatsAppText}</span>
      </button>

      <button
        type="button"
        onClick={onCopy}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? copiedAlert : copyShareText}</span>
      </button>
    </div>
  );
};
