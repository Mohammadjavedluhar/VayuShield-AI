/**
 * VayuShield AI - Community Report Sanitizer
 * Defends against Browser Storage Poisoning and XSS injection vectors.
 */

import type { CommunityReport, IncidentSeverity, IncidentType } from './preseededReports';

export const DISALLOWED_STORAGE_CHARS = /[^a-zA-Z0-9\s.,!?'"()#@/_-]/g;

export const VALID_INCIDENT_TYPES: readonly IncidentType[] = [
  'waste_burning',
  'crop_residue',
  'construction_dust',
  'traffic_gridlock',
  'diesel_generator',
];

export const VALID_SEVERITIES: readonly IncidentSeverity[] = ['critical', 'high', 'moderate'];
export const VALID_STATUSES = ['active', 'investigating', 'mitigated'] as const;

export function sanitizeStorageString(val: unknown, maxLength: number, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  const stripped = val.replace(DISALLOWED_STORAGE_CHARS, '').trim();
  const clamped = stripped.slice(0, maxLength);
  return clamped || fallback;
}

/**
 * Validates and sanitizes a single report object before storage or hydration.
 * @param raw - Unverified report record
 * @returns Fully sanitized CommunityReport
 */
export function sanitizeReportItem(raw: unknown): CommunityReport {
  const r = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? (raw as Record<string, unknown>) : {};

  const id = String(r.id || '').replace(/[^\w-]/g, '').slice(0, 64);
  const rawIncidentType = String(r.incidentType || '');
  const incidentType: IncidentType = VALID_INCIDENT_TYPES.includes(rawIncidentType as IncidentType)
    ? (rawIncidentType as IncidentType)
    : 'waste_burning';

  const rawSeverity = String(r.severity || '');
  const severity: IncidentSeverity = VALID_SEVERITIES.includes(rawSeverity as IncidentSeverity)
    ? (rawSeverity as IncidentSeverity)
    : 'moderate';

  const rawStatus = String(r.status || '');
  const status = VALID_STATUSES.includes(rawStatus as 'active' | 'investigating' | 'mitigated')
    ? (rawStatus as 'active' | 'investigating' | 'mitigated')
    : 'active';

  return {
    id,
    neighborhood: sanitizeStorageString(r.neighborhood, 100),
    city: sanitizeStorageString(r.city, 100),
    incidentType,
    severity,
    description: sanitizeStorageString(r.description, 500),
    reportedAt: sanitizeStorageString(r.reportedAt, 50, 'Just now'),
    upvotes: typeof r.upvotes === 'number' && Number.isFinite(r.upvotes) ? Math.max(0, Math.floor(r.upvotes)) : 0,
    status,
    reporterName: sanitizeStorageString(r.reporterName, 100, 'Neighbor'),
  };
}
