/**
 * VayuShield AI - Action Checklist Generator
 * Returns baseline action items grounded in calculated impact metrics.
 */

import type { ActionItem, ImpactLedgerMetrics } from '../types';

/**
 * Returns baseline action items grounded in calculated impact metrics.
 * @param ledger - Master calculated impact metrics
 * @returns Prioritized action items
 */
export function getDefaultActionChecklist(ledger: ImpactLedgerMetrics): ActionItem[] {
  return [
    {
      id: 'task-1',
      task: 'Equip all family members with certified N95 respirators',
      category: 'immediate',
      urgency: 'high',
      rationale: 'Filters over 95% of inhaled fine particulates during outdoor exposure.',
    },
    {
      id: 'task-2',
      task: 'Deploy Corsi-Rosenthal Box or HEPA cleaner continuously',
      category: 'equipment',
      urgency: 'high',
      rationale: `Yields ${ledger.inhaledPm25ReductionPct}% particulate reduction and saves ${ledger.avoidedCigarettesPerWeek} cigarette-equivalents weekly.`,
    },
    {
      id: 'task-3',
      task: 'Execute daily damp microfiber wet mopping',
      category: 'daily',
      urgency: 'medium',
      rationale: 'Eliminates settled dust resuspension without kicking particles into the air.',
    },
    {
      id: 'task-4',
      task: 'Seal leaky window drafts with silicone tape',
      category: 'immediate',
      urgency: 'medium',
      rationale: 'Reduces passive ambient smog penetration into living quarters.',
    },
  ];
}
