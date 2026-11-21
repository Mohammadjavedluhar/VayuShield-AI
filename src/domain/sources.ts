/**
 * VayuShield AI - Scientific Sources, Benchmark Standards & Constants
 * Canonical citations from US EPA, WHO, Berkeley Earth, and academic literature.
 */

export interface ScientificCitation {
  id: string;
  shortName: string;
  fullTitle: string;
  authors: string;
  year: number;
  organization: string;
  doiOrUrl?: string;
  keyFormulaOrStandard: string;
}

export const SCIENTIFIC_CITATIONS: Record<string, ScientificCitation> = {
  berkeleyEarth: {
    id: 'berkeleyEarth',
    shortName: 'Berkeley Earth Cigarette Equivalence',
    fullTitle: 'Air Pollution and Cigarette Equivalence',
    authors: 'Richard A. Muller, Elizabeth A. Muller, Robert Rohde',
    year: 2016,
    organization: 'Berkeley Earth',
    doiOrUrl: 'https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/',
    keyFormulaOrStandard: '1 cigarette per day ≈ 22 µg/m³ of PM2.5 sustained over 24 hours (528 µg·h/m³)',
  },
  whoAqg2021: {
    id: 'whoAqg2021',
    shortName: 'WHO Global Air Quality Guidelines 2021',
    fullTitle: 'WHO Global Air Quality Guidelines: Particulate matter (PM2.5 and PM10), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide',
    authors: 'World Health Organization Expert Panel',
    year: 2021,
    organization: 'World Health Organization (Geneva)',
    doiOrUrl: 'https://www.who.int/publications/i/item/9789240034228',
    keyFormulaOrStandard: '24-hour safe exposure threshold: 15 µg/m³; Annual guideline: 5 µg/m³',
  },
  epaEfh2011: {
    id: 'epaEfh2011',
    shortName: 'US EPA Exposure Factors Handbook',
    fullTitle: 'Exposure Factors Handbook: 2011 Edition (Chapter 6: Inhalation Rates)',
    authors: 'National Center for Environmental Assessment, Office of Research and Development',
    year: 2011,
    organization: 'United States Environmental Protection Agency',
    doiOrUrl: 'https://www.epa.gov/expobox/about-exposure-factors-handbook',
    keyFormulaOrStandard: 'Mean daily adult inhalation: 14.4 m³/day (0.60 m³/h); Child (6-11y): 8.9 m³/day (higher rate per kg body mass)',
  },
  epaIndoorModel: {
    id: 'epaIndoorModel',
    shortName: 'EPA Indoor Air Quality Mass-Balance Model',
    fullTitle: 'Indoor Air Quality Mass Balance Model for Particulate Matter',
    authors: 'US EPA Office of Research and Development',
    year: 2004,
    organization: 'EPA Report EPA/600/R-04/007',
    doiOrUrl: 'https://cfpub.epa.gov/si/si_public_record_report.cfm?dirEntryId=65691',
    keyFormulaOrStandard: 'Cin = (P · a · Cout + S/V) / (a + k + CADR/V)',
  },
  corsiRosenthal: {
    id: 'corsiRosenthal',
    shortName: 'Corsi-Rosenthal Box Foundation',
    fullTitle: 'A Low-Cost DIY Solution to Reduce Respiratory Particle Inhalation Indoors',
    authors: 'Richard Corsi, Jim Rosenthal',
    year: 2020,
    organization: 'UC Davis College of Engineering / Tex-Air Filters',
    doiOrUrl: 'https://engineering.ucdavis.edu/news/science-behind-corsi-rosenthal-box',
    keyFormulaOrStandard: 'Target: 5 ACH for wildfire/smog; 20" box fan + 4 MERV-13 filters delivers ~350-400 CFM clean air at 80% lower cost than commercial HEPA',
  },
  defraGhg2023: {
    id: 'defraGhg2023',
    shortName: 'UK DEFRA & US EPA Transport GHG Factors',
    fullTitle: 'Greenhouse Gas Reporting: Conversion Factors 2023',
    authors: 'Department for Environment, Food & Rural Affairs (UK) & US EPA',
    year: 2023,
    organization: 'DEFRA / EPA',
    doiOrUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023',
    keyFormulaOrStandard: 'Car: 0.170 kg CO2/km; Carpool: 0.085 kg CO2/km; Metro: 0.035 kg CO2/km; LPG cooking: 1.50 kg CO2/day; Induction: 0.45 kg CO2/day',
  },
};

// WHO 2021 24-hour PM2.5 threshold (µg/m³)
export const WHO_24H_PM25_THRESHOLD_UG_M3 = 15;

// Berkeley Earth constant
export const BERKELEY_EARTH_UG_HOURS_PER_CIGARETTE = 528;

// Child vs Adult daily inhalation volumes (m³/day)
export const INHALATION_VOLUMES = {
  adultRest: 12.0,
  adultAverage: 14.4,
  adultActive: 18.0,
  child6to11: 8.9,
  childToddler: 6.5,
  elderlyAverage: 13.0,
};
