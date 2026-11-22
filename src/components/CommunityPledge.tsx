import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Sparkles } from 'lucide-react';
import { HouseholdProfile, ImpactLedgerMetrics } from '../domain/types';
import { Language, translations } from '../i18n/translations';
import { CardSectionHeader } from './common/CardSectionHeader';
import { CertifiedBadgeCard } from './pledge/CertifiedBadgeCard';
import { PledgeShareActions } from './pledge/PledgeShareActions';

interface CommunityPledgeProps {
  profile: HouseholdProfile;
  metrics: ImpactLedgerMetrics;
  language: Language;
}

export const CommunityPledge: React.FC<CommunityPledgeProps> = ({
  profile,
  metrics,
  language,
}) => {
  const t = translations[language];
  const [pledgeName, setPledgeName] = useState('Verma Family');
  const [isSigned, setIsSigned] = useState(false);
  const [copied, setCopied] = useState(false);
  const [certificateId] = useState('VS-CERT-2025-VAYU');

  const handleSignPledge = () => {
    setIsSigned(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
  };

  const shareText = `🌿 I just pledged clean air action with VayuShield AI for ${profile.city}!
Our household is avoiding ${metrics.avoidedCigarettesPerWeek} cigarettes-equivalent of toxic winter smog per week and saving ${metrics.co2SavedKgPerWeek} kg of CO2 through N95 masking, Corsi-Rosenthal DIY air filtration, and sustainable commute swaps.
Join the Clean Air Movement & protect your family: https://vayushield-ai.vercel.app`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <CardSectionHeader
        icon={<Award className="w-4 h-4 text-emerald-500" />}
        badgeText="Hack2Skill Winter Smog Hackathon Movement"
        badgeColorClass="text-emerald-600 dark:text-emerald-400"
        title={t.pledgeTitle}
        subtitle={t.pledgeSubtitle}
        rightAction={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 self-start sm:self-auto">
            <Sparkles className="w-4 h-4" />
            <span>Community Impact Verified</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-6">
        <div className="sm:col-span-5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            {t.pledgeNameLabel}
          </label>
          <input
            type="text"
            value={pledgeName}
            onChange={(e) => setPledgeName(e.target.value)}
            placeholder="e.g. Sharma Family or Priya Gupta"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="sm:col-span-4">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            {t.pledgeCityLabel}
          </label>
          <input
            type="text"
            readOnly
            value={`${profile.city} (${profile.householdSize} members)`}
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-not-allowed"
          />
        </div>

        <div className="sm:col-span-3 flex items-end">
          <button
            type="button"
            onClick={handleSignPledge}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSigned ? 'Pledge Signed!' : t.signPledgeBtn}</span>
          </button>
        </div>
      </div>

      <CertifiedBadgeCard
        profile={profile}
        metrics={metrics}
        pledgeName={pledgeName}
        badgeTitle={t.badgeTitle}
        certificateId={certificateId}
      />

      <PledgeShareActions
        onWhatsApp={handleWhatsApp}
        onCopy={handleCopy}
        copied={copied}
        shareOnWhatsAppText={t.shareOnWhatsApp}
        copyShareText={t.copyShareText}
        copiedAlert={t.copiedAlert}
      />
    </div>
  );
};
