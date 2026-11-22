import React from 'react';
import { AlertCircle, Baby, HeartPulse, Users } from 'lucide-react';
import { HouseholdProfile } from '../../domain/types';

interface MedicalFlagsCardProps {
  profile: HouseholdProfile;
  medicalFlagsText: string;
}

export const MedicalFlagsCard: React.FC<MedicalFlagsCardProps> = ({ profile, medicalFlagsText }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
      <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
        {medicalFlagsText}
      </div>
      <div className={`flex items-center justify-between text-xs p-2 rounded-xl border ${profile.hasAsthma ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30' : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'}`}>
        <span className="flex items-center gap-1.5 font-semibold"><AlertCircle className="w-3.5 h-3.5" /> Asthma Patient</span>
        <span>{profile.hasAsthma ? 'Detected (+35)' : 'No'}</span>
      </div>
      <div className={`flex items-center justify-between text-xs p-2 rounded-xl border ${profile.hasCopdOrCardiac ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30' : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'}`}>
        <span className="flex items-center gap-1.5 font-semibold"><HeartPulse className="w-3.5 h-3.5" /> COPD / Cardiac</span>
        <span>{profile.hasCopdOrCardiac ? 'Detected (+40)' : 'No'}</span>
      </div>
      <div className={`flex items-center justify-between text-xs p-2 rounded-xl border ${profile.hasElderly ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30' : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'}`}>
        <span className="flex items-center gap-1.5 font-semibold"><Users className="w-3.5 h-3.5" /> Elderly Family</span>
        <span>{profile.hasElderly ? 'Detected (+20)' : 'No'}</span>
      </div>
      <div className={`flex items-center justify-between text-xs p-2 rounded-xl border ${profile.hasChildren ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30' : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-400 border-transparent'}`}>
        <span className="flex items-center gap-1.5 font-semibold"><Baby className="w-3.5 h-3.5" /> School Kids</span>
        <span>{profile.hasChildren ? 'Detected (+20)' : 'No'}</span>
      </div>
    </div>
  );
};
