import React from 'react';
import { Bot, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: string[];
  isGrounded?: boolean;
  tier?: string;
}

interface ChatMessageItemProps {
  msg: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ msg }) => {
  const isUser = msg.sender === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-cyan-500'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
          isUser
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
            {msg.recommendations.map((rec) => (
              <div key={`${msg.id}-rec-${rec.slice(0, 15)}`} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}

        {!isUser && (
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
  );
};
