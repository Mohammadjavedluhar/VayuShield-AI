import React, { useState } from 'react';
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  HelpCircle,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { AirQualityData, HouseholdProfile, ImpactLedgerMetrics } from '../domain/types';
import { Language, translations } from '../i18n/translations';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: string[];
  isGrounded?: boolean;
  tier?: string;
}

interface AskAssistantProps {
  airQuality: AirQualityData;
  profile: HouseholdProfile;
  ledger: ImpactLedgerMetrics;
  onAskApi: (question: string) => Promise<{
    answer: string;
    recommendations: string[];
    isGrounded: boolean;
    tier: string;
  }>;
  language: Language;
}

export const AskAssistant: React.FC<AskAssistantProps> = ({
  airQuality,
  onAskApi,
  language,
}) => {
  const t = translations[language];
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am VayuShield AI, your clinical and environmental smog assistant for ${airQuality.city}. Current AQI is ${airQuality.currentAqi} (PM2.5: ${airQuality.pm25} µg/m³). Ask me about safe exercise hours, DIY Corsi-Rosenthal box filtration, school commute precautions, or N95 mask fitting.`,
      recommendations: [
        'Ask about school travel safety during morning smog peaks',
        'Ask how to build a ₹2,800 Corsi-Rosenthal box',
        'Ask why cloth masks do not protect against fine PM2.5',
      ],
      isGrounded: true,
    },
  ]);

  const quickQuestions = [
    'Should kids go to school or exercise outdoors at current AQI?',
    'How do I build a ₹2,800 Corsi-Rosenthal box and does it work?',
    'Why are cloth masks ineffective against PM2.5 winter smog?',
    'What does the Berkeley Earth cigarette equivalence formula mean?',
  ];

  const handleSend = async (qText?: string) => {
    const textToSend = qText || question;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!qText) setQuestion('');
    setIsLoading(true);

    try {
      const result = await onAskApi(textToSend);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        recommendations: result.recommendations,
        isGrounded: result.isGrounded,
        tier: result.tier,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: `In ${airQuality.city} at current AQI ${airQuality.currentAqi}, medical guidelines advise keeping windows closed, wearing certified N95 respirators outdoors, and running active indoor filtration.`,
          isGrounded: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col h-[700px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Bot className="w-4 h-4 text-cyan-500" />
            <span>Clinical &amp; Evidence-Based AI Assistant</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.askTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.askSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.groundedNotice}</span>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-cyan-500'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Key Recommendations:
                  </div>
                  {msg.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}

              {msg.sender === 'assistant' && (
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>EPA &amp; Berkeley Earth Grounded</span>
                  </span>
                  {msg.tier && <span>{msg.tier.replace('tier2_', '').replace('tier4_', '')}</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing live air indices &amp; clinical guidelines...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="py-2 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-left text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition whitespace-nowrap flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-cyan-500" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.askPlaceholder}
            className="w-full pl-4 pr-12 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute right-2.5 top-2 p-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md hover:opacity-95 disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
