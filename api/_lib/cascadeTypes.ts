/**
 * VayuShield AI - Multi-Tier Cascade Types
 * Common contracts and interfaces for 4-Tier Resilience AI Cascade.
 */

import type { ZodSchema } from 'zod';

export type CascadeTier =
  | 'tier1_cache'
  | 'tier2_flash'
  | 'tier3_flash_lite'
  | 'tier4_fallback';

export interface InlineImageData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface CascadeOptions<T> {
  task: string;
  prompt: string;
  systemInstruction?: string;
  imagePart?: InlineImageData;
  zodSchema: ZodSchema<T>;
  fallbackFn: () => T;
  temperature?: number;
}

export interface CascadeResult<T> {
  data: T;
  tier: CascadeTier;
  modelUsed?: string;
  latencyMs: number;
}
