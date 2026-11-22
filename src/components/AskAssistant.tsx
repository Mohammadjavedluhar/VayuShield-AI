import React, { useState } from 'react';
import { Bot, MessageSquare, Send } from 'lucide-react';
import { AirQualityData, HouseholdProfile, ImpactLedgerMetrics } from '../domain/types';
import { Language, translations } from '../i18n/translations';
import { ChatMessageItem } from './ask/ChatMessageItem';
import { QuickQuestionsBar } from './ask/QuickQuestionsBar';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AskAssistantProps {
  onAskQuestion: (question: string) => Promise<string>;
  airQuality: AirQualityData | null;
  profile: HouseholdProfile;
  metrics: ImpactLedgerMetrics;
  language: Language;
}

const QUICK_QUESTIONS = [
  'Is it safe for my kids to play outside right now?',
  'Should an asthma patient commute by 2-wheeler today?',
  'How do I build a DIY Corsi-Rosenthal box under ₹2,500?',
  'What is thermal inversion and why is AQI worse at 7 AM?',
];

export const AskAssistant: React.FC<AskAssistantProps> = ({
  onAskQuestion,
  language,
}) => {
  const t = translations[language];
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am VayuShield AI, your clinical and particulate defense assistant. How can I help protect your household from winter smog today?',
      timestamp: 'Just now',
    },
  ]);

  const handleSend = async (customText?: string) => {
    const query = (customText || question).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setQuestion('');
    setIsLoading(true);

    try {
      const reply = await onAskQuestion(query);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach the assistant at this moment. Deterministic guidance is always available in the tabs.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col h-[600px]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{t.tabAsk}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Grounded clinical guidance with zero-hallucination guardrails</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} msg={msg} />
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

      <QuickQuestionsBar questions={QUICK_QUESTIONS} onSelectQuestion={handleSend} />

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); void handleSend(); }} className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about masks, clean hours, or indoor filtration..."
            className="w-full pl-4 pr-12 py-3 min-h-[44px] text-sm rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute right-2.5 top-2 p-2 min-h-[44px] min-w-[44px] rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md hover:opacity-95 disabled:opacity-40 transition flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
