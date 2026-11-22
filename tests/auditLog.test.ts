import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { recordAuditEvent, getAuditLog, clearAuditLog } from '../src/domain/auditLog';

describe('Immutable Action Audit Log - auditLog.ts', () => {
  beforeEach(() => {
    clearAuditLog();
  });

  afterEach(() => {
    clearAuditLog();
    vi.restoreAllMocks();
  });

  it('records audit events and retrieves them in reverse chronological order', () => {
    const e1 = recordAuditEvent('plan_generated', 'Generated clean hour plan for Delhi', { aqi: 280 });
    const e2 = recordAuditEvent('pledge_signed', 'Pledged clean air action for family', { name: 'Verma Family' });

    expect(e1.id).toBeDefined();
    expect(e1.verifiedDeterministic).toBe(true);
    expect(e1.eventType).toBe('plan_generated');

    const logs = getAuditLog();
    expect(logs.length).toBe(2);
    expect(logs[0].id).toBe(e2.id);
    expect(logs[1].id).toBe(e1.id);
  });

  it('handles simulated window.localStorage environment and storage errors', () => {
    const mockStorage: Record<string, string> = {};
    const fakeWindow = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => {
          mockStorage[k] = v;
        },
        removeItem: (k: string) => {
          delete mockStorage[k];
        },
      },
    };

    vi.stubGlobal('window', fakeWindow);

    const evt = recordAuditEvent('vision_scanned', 'Mask inspection performed');
    expect(evt.id).toBeDefined();
    expect(getAuditLog().length).toBe(1);

    // Corrupted JSON in localStorage returns empty list
    mockStorage['vayushield_audit_log_v1'] = 'corrupted-json{{';
    expect(getAuditLog()).toEqual([]);

    // Storage setItem throws warning but does not throw exception
    fakeWindow.localStorage.setItem = () => {
      throw new Error('Disk full');
    };
    expect(() => recordAuditEvent('intake_completed', 'Family profile extracted')).not.toThrow();

    vi.unstubAllGlobals();
  });

  it('clears audit logs cleanly', () => {
    recordAuditEvent('report_submitted', 'Hotspot reported');
    expect(getAuditLog().length).toBe(1);
    clearAuditLog();
    expect(getAuditLog().length).toBe(0);
  });
});
