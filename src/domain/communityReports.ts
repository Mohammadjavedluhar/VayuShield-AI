/**
 * VayuShield AI - Community Smog & Neighborhood Incident Layer
 *
 * Enables citizen reporting of hyperlocal pollution hotspots (waste burning,
 * construction dust, idling diesel chokepoints) and computes collective society impact.
 */

export type IncidentType =
  | 'waste_burning'
  | 'crop_residue'
  | 'construction_dust'
  | 'traffic_gridlock'
  | 'diesel_generator';

export type IncidentSeverity = 'critical' | 'high' | 'moderate';

export interface CommunityReport {
  id: string;
  city: string;
  neighborhood: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  description: string;
  reportedAt: string;
  upvotes: number;
  status: 'active' | 'investigating' | 'mitigated';
  reporterName?: string;
}

export const PRESEEDED_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-delhi-1',
    city: 'Delhi',
    neighborhood: 'Anand Vihar ISBT & Railway Colony',
    incidentType: 'waste_burning',
    severity: 'critical',
    description: 'Open municipal plastic and leaf burning reported near railway tracks, creating dense toxic plume toward residential colonies.',
    reportedAt: '15 mins ago',
    upvotes: 42,
    status: 'active',
    reporterName: 'Resident RWAs',
  },
  {
    id: 'rep-noida-2',
    city: 'Noida',
    neighborhood: 'Sector 62 Institutional Greenbelt',
    incidentType: 'construction_dust',
    severity: 'high',
    description: 'Uncovered sand transport and unpaved shoulder soil resuspension during morning peak traffic.',
    reportedAt: '1 hour ago',
    upvotes: 28,
    status: 'investigating',
    reporterName: 'Aarav M.',
  },
  {
    id: 'rep-gurugram-3',
    city: 'Gurugram',
    neighborhood: 'Golf Course Extension Road',
    incidentType: 'traffic_gridlock',
    severity: 'high',
    description: 'Heavy construction vehicles and diesel trucks idling in bottleneck for over 45 minutes.',
    reportedAt: '2 hours ago',
    upvotes: 35,
    status: 'active',
    reporterName: 'Pooja K.',
  },
  {
    id: 'rep-jaipur-4',
    city: 'Jaipur',
    neighborhood: 'Mansarovar Metro Corridor',
    incidentType: 'waste_burning',
    severity: 'critical',
    description: 'Commercial packaging materials burned behind local wholesale market in early morning inversion.',
    reportedAt: '3 hours ago',
    upvotes: 19,
    status: 'active',
    reporterName: 'Deepak S.',
  },
  {
    id: 'rep-lucknow-5',
    city: 'Lucknow',
    neighborhood: 'Gomti Nagar Extension',
    incidentType: 'crop_residue',
    severity: 'high',
    description: 'Peri-urban crop residue smoke drifting with westerly winds into apartment complexes.',
    reportedAt: '4 hours ago',
    upvotes: 24,
    status: 'investigating',
    reporterName: 'Alok V.',
  },
];

const LOCAL_STORAGE_KEY = 'vayushield_community_reports';

const DISALLOWED_STORAGE_CHARS = /[^a-zA-Z0-9\s.,!?'"()#@/_-]/g;

const VALID_INCIDENT_TYPES: readonly IncidentType[] = [
  'waste_burning',
  'crop_residue',
  'construction_dust',
  'traffic_gridlock',
  'diesel_generator',
];

const VALID_SEVERITIES: readonly IncidentSeverity[] = ['critical', 'high', 'moderate'];

const VALID_STATUSES = ['active', 'investigating', 'mitigated'] as const;

/**
 * Sanitizes an arbitrary string value against a strict character allowlist and length limit.
 * Defends against Browser Storage Poisoning and XSS injection vectors.
 */
function sanitizeStorageString(val: unknown, maxLength: number, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  const stripped = val.replace(DISALLOWED_STORAGE_CHARS, '').trim();
  const clamped = stripped.slice(0, maxLength);
  return clamped || fallback;
}

/**
 * Validates and sanitizes a single report object before storing into or loading from localStorage.
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

export function getStoredReports(): CommunityReport[] {
  if (typeof window === 'undefined' || !window.localStorage) return PRESEEDED_COMMUNITY_REPORTS;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(PRESEEDED_COMMUNITY_REPORTS));
      return PRESEEDED_COMMUNITY_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return PRESEEDED_COMMUNITY_REPORTS;
    const sanitized = parsed.map((item) => sanitizeReportItem(item));
    return sanitized.length > 0 ? sanitized : PRESEEDED_COMMUNITY_REPORTS;
  } catch {
    return PRESEEDED_COMMUNITY_REPORTS;
  }
}

export function saveStoredReports(reports: CommunityReport[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (!Array.isArray(reports)) return;
    const sanitized: CommunityReport[] = reports.slice(0, 50).map((r) => sanitizeReportItem(r));
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('Failed to save community reports:', err);
  }
}

/**
 * Calculates collective society impact when multiple families adopt clean air pledges
 */
export function calculateCollectiveSocietyImpact(participatingFamiliesCount: number): {
  participatingFamilies: number;
  weeklyAvoidedPm25Kg: number;
  weeklySavedCo2Kg: number;
  weeklyAvoidedCigarettes: number;
  annualCommunityHealthSavingsInr: number;
} {
  const families = Math.max(1, participatingFamiliesCount);

  // Per family weekly metrics:
  // - 1.4 kg PM2.5 emissions prevented (no waste burning + clean commute)
  // - 18.5 kg CO2 saved from carpool / transit
  // - 32 cigarettes-equivalent smoke avoided inside homes
  // - ₹2,400 INR medical consultation/medication cost avoided per family/month
  const weeklyAvoidedPm25Kg = Number((families * 1.4).toFixed(1));
  const weeklySavedCo2Kg = Number((families * 18.5).toFixed(1));
  const weeklyAvoidedCigarettes = Math.round(families * 32);
  const annualCommunityHealthSavingsInr = families * 2400 * 12;

  return {
    participatingFamilies: families,
    weeklyAvoidedPm25Kg,
    weeklySavedCo2Kg,
    weeklyAvoidedCigarettes,
    annualCommunityHealthSavingsInr,
  };
}
