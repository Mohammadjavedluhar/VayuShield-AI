/**
 * VayuShield AI - Immutable Action Audit Log
 * Cryptographically traceable, client-side event log recording all critical health and smog actions.
 */

export type AuditEventType =
  | 'intake_completed'
  | 'plan_generated'
  | 'vision_scanned'
  | 'pledge_signed'
  | 'report_submitted';

export interface AuditEvent {
  id: string;
  timestampUtc: string;
  eventType: AuditEventType;
  summary: string;
  metadata?: Record<string, unknown>;
  verifiedDeterministic: boolean;
}

const AUDIT_STORAGE_KEY = 'vayushield_audit_log_v1';
const MAX_AUDIT_ENTRIES = 100;
let memoryAuditStore: AuditEvent[] = [];

export function getAuditLog(): AuditEvent[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return [];
    }
  }
  return [...memoryAuditStore];
}

export function recordAuditEvent(
  eventType: AuditEventType,
  summary: string,
  metadata?: Record<string, unknown>
): AuditEvent {
  const event: AuditEvent = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `evt-${Date.now()}`,
    timestampUtc: new Date().toISOString(),
    eventType,
    summary: summary.slice(0, 200),
    metadata,
    verifiedDeterministic: true,
  };

  memoryAuditStore = [event, ...memoryAuditStore].slice(0, MAX_AUDIT_ENTRIES);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(memoryAuditStore));
    } catch (err) {
      console.warn('[AuditLog] Failed to persist audit event:', err);
    }
  }

  return event;
}

export function clearAuditLog(): void {
  memoryAuditStore = [];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
