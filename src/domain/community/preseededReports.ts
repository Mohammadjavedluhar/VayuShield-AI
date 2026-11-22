/**
 * VayuShield AI - Preseeded Community Incident Reports
 * Initial baseline reports for major Indian metropolitan air corridors.
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
