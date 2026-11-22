/**
 * VayuShield AI - Air Quality Health Advisories & Color Themes
 * Clinical guidance copy and UI styling tokens mapped to AQI categories.
 */

import type { AqiCategory } from '../types';

export const HEALTH_ADVISORY_MAP: Record<AqiCategory, string> = {
  good: 'Air quality is satisfactory. Outdoor activities are safe for all individuals.',
  moderate: 'Acceptable air quality. Unusually sensitive individuals should consider reducing prolonged outdoor exertion.',
  unhealthySensitive: 'Members of sensitive groups (asthma, COPD, cardiac, children, elderly) may experience health effects. Wear N95 outside.',
  unhealthy: 'Everyone may begin to experience health effects. Active children and adults should avoid prolonged outdoor exertion.',
  veryUnhealthy: 'Health alert: risk of health effects increased for everyone. Wear certified N95 respirators outdoors; run indoor filtration.',
  hazardous: 'Health warnings of emergency conditions. The entire population is likely to be affected. Keep windows closed.',
  severe: 'Severe public health crisis. Avoid all outdoor physical activity. Seal windows and deploy continuous indoor filtration.',
};

export const AQI_THEME_MAP: Record<
  AqiCategory,
  { badgeBg: string; badgeText: string; progressColor: string; border: string }
> = {
  good: {
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeText: 'text-emerald-400',
    progressColor: 'bg-emerald-500',
    border: 'border-emerald-500/30',
  },
  moderate: {
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: 'text-amber-400',
    progressColor: 'bg-amber-500',
    border: 'border-amber-500/30',
  },
  unhealthySensitive: {
    badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    badgeText: 'text-orange-400',
    progressColor: 'bg-orange-500',
    border: 'border-orange-500/30',
  },
  unhealthy: {
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeText: 'text-rose-400',
    progressColor: 'bg-rose-500',
    border: 'border-rose-500/30',
  },
  veryUnhealthy: {
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    badgeText: 'text-purple-400',
    progressColor: 'bg-purple-500',
    border: 'border-purple-500/30',
  },
  hazardous: {
    badgeBg: 'bg-red-700/20 text-red-300 border-red-600/40',
    badgeText: 'text-red-400',
    progressColor: 'bg-red-600',
    border: 'border-red-600/40',
  },
  severe: {
    badgeBg: 'bg-red-700/20 text-red-300 border-red-600/40',
    badgeText: 'text-red-400',
    progressColor: 'bg-red-600',
    border: 'border-red-600/40',
  },
};

/**
 * Returns evidence-based health guidance for each AQI tier.
 * @param category - AQI category classification
 * @returns Clinical advisory message
 */
export function getHealthAdvisory(category: AqiCategory): string {
  return HEALTH_ADVISORY_MAP[category] || HEALTH_ADVISORY_MAP.severe;
}

/**
 * Returns Tailwind color tokens for UI rendering.
 * @param category - AQI category classification
 * @returns Badge, text, and border styling classes
 */
export function getAqiColorTheme(category: AqiCategory): {
  badgeBg: string;
  badgeText: string;
  progressColor: string;
  border: string;
} {
  return AQI_THEME_MAP[category] || AQI_THEME_MAP.hazardous;
}
