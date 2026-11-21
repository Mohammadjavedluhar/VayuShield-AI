import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Check,
  CheckCircle2,
  Copy,
  Flame,
  Leaf,
  Share2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { HouseholdProfile, ImpactLedgerMetrics } from '../domain/types';
import { Language, translations } from '../i18n/translations';

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

  const handleSignPledge = () => {
    setIsSigned(true);
    // Trigger confetti celebration
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Hack2Skill Winter Smog Hackathon Movement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.pledgeTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.pledgeSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 self-start sm:self-auto">
          <Sparkles className="w-4 h-4" />
          <span>Community Impact Verified</span>
        </div>
      </div>

      {/* Input row */}
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
            onClick={handleSignPledge}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSigned ? 'Pledge Signed!' : t.signPledgeBtn}</span>
          </button>
        </div>
      </div>

      {/* Shareable Certified Impact Card Preview */}
      <div className="relative mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white border-2 border-emerald-500/40 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                Official Clean Air Certificate
              </span>
              <h3 className="text-2xl font-black text-white mt-0.5">
                {t.badgeTitle}
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs font-semibold text-slate-400">Issued To</div>
            <div className="text-xl font-black text-emerald-300">
              {pledgeName || 'Community Champion'}
            </div>
            <div className="text-xs text-slate-400">{profile.city} • Winter Smog Initiative</div>
          </div>
        </div>

        {/* Certified Metrics Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Smoke Avoided</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400 mt-2">
              {metrics.avoidedCigarettesPerWeek}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Cigarettes-equivalent / week
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>CO2 Avoided</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-2">
              {metrics.co2SavedKgPerWeek} <span className="text-base font-normal">kg</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Weekly transport &amp; fuel emissions
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>PM2.5 Inhalation Drop</span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-400 mt-2">
              {metrics.inhaledPm25ReductionPct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Verified EPA dose reduction
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-emerald-500/20 text-xs text-slate-400">
          <div>
            Verified by <strong>VayuShield AI</strong> &bull; Berkeley Earth Muller Formula &bull; US EPA 2024 Standard
          </div>
          <div className="font-mono text-[11px] text-emerald-400">
            ID: VS-{Date.now().toString(36).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Share Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition"
        >
          <Share2 className="w-4 h-4" />
          <span>{t.shareOnWhatsApp}</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t.copiedAlert : t.copyShareText}</span>
        </button>
      </div>
    </div>
  );
};
