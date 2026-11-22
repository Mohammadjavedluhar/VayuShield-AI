import React from 'react';
import { Activity, Car, CheckCircle2, Flame, Home, Users } from 'lucide-react';
import { HouseholdProfile } from '../../domain/types';
import { MedicalFlagsCard } from './MedicalFlagsCard';

interface FamilyProfileDisplayProps {
  profile: HouseholdProfile;
  vulnerabilityIndexText: string;
  medicalFlagsText: string;
  membersCountText: string;
}

function getVulnColor(level: string): string {
  switch (level) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  }
}

export const FamilyProfileDisplay: React.FC<FamilyProfileDisplayProps> = ({
  profile,
  vulnerabilityIndexText,
  medicalFlagsText,
  membersCountText,
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-500" />
        <span>Extracted Household Sensitivity Profile</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">{vulnerabilityIndexText}</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{profile.vulnerabilityScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase border ${getVulnColor(profile.vulnerabilityLevel)}`}>
              {profile.vulnerabilityLevel} Risk
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Derived from medical vulnerability, commute exposure, and fuel source.</p>
          </div>
        </div>

        <MedicalFlagsCard profile={profile} medicalFlagsText={medicalFlagsText} />

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">Household Parameters</div>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-500" /> {membersCountText}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{profile.householdSize} members ({profile.city})</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-cyan-500" /> Commute</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{profile.commuteMode} ({profile.commuteDistanceKm} km)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-500" /> Cooking</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{profile.cookingFuel}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-cyan-500" /> Purifier</span>
            <span className={`font-bold ${profile.hasAirPurifier ? 'text-emerald-500' : 'text-slate-400'}`}>{profile.hasAirPurifier ? 'Installed' : 'None'}</span>
          </div>
        </div>
      </div>

      {profile.rawInput && (
        <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-700 dark:text-cyan-300 font-bold block mb-0.5">AI Clinical Intake Extraction:</strong>
            <span>Personalized profile synthesized for {profile.householdSize} residents in {profile.city}. Tailored air filtration calculations calibrated to these constraints.</span>
          </div>
        </div>
      )}
    </div>
  );
};
