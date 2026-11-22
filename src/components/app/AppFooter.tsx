import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-500" />
          <span>
            <strong>VayuShield AI</strong> &bull; Hack2Skill Urban Air Quality &amp; Winter Smog Assistant
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Berkeley Earth Muller Formula</span>
          <span>US EPA 2024 Breakpoints</span>
          <span>Open-Meteo Air Quality</span>
        </div>
      </div>
    </footer>
  );
};
