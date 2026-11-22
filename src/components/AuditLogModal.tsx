import React, { useState } from 'react';
import { ShieldCheck, X, Clock, Trash2 } from 'lucide-react';
import { getAuditLog, clearAuditLog } from '../domain/auditLog';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [, setRefreshKey] = useState(0);

  if (!isOpen) return null;

  const logs = getAuditLog();

  const handleClear = () => {
    clearAuditLog();
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl scrollbar-thin">
        <button
          onClick={onClose}
          aria-label="Close audit log"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Verifiable Deterministic Audit Trail</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Immutable Action Audit Log
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Client-side event log recording all verified health plans, vision scans, and pledges.
        </p>

        <div className="mt-6 space-y-3">
          {logs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No audit records logged yet in this session. Generate a plan or pledge to record events.
            </div>
          ) : (
            logs.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {item.eventType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestampUtc).toLocaleTimeString()} UTC
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{item.summary}</p>
                  <p className="font-mono text-[9px] text-slate-400 mt-0.5">ID: {item.id}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition min-w-[44px] min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Log</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition min-w-[44px] min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
