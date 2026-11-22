/**
 * VayuShield AI - 4-Tier Resilience Cascade
 * Guaranteed 100% uptime architecture for Gemini AI calls:
 * Tier 1: In-memory TTL / LRU Cache
 * Tier 2: Primary model (gemini-2.5-flash) with retry
 * Tier 3: Lightweight model (gemini-2.5-flash-lite)
 * Tier 4: Deterministic rule-based template fallback
 */

import { getGeminiClient, hasGeminiKey } from './geminiClient';
import { generateCacheKey, getFromCache, setToCache } from './aiCache';
import { assembleGeminiContents, tryTier2Primary, tryTier3Fallback } from './aiCascadeTiers';
import type { CascadeOptions, CascadeResult } from './cascadeTypes';

export type { CascadeOptions, CascadeResult };
export { generateCacheKey, getFromCache, setToCache };

/**
 * Executes the 4-Tier Resilience Cascade with guaranteed non-crashing output.
 * @param options - Prompt, schema, task name, and deterministic fallback function
 * @returns Result data along with latency and resolution tier
 */
export async function executeAiCascade<T>(
  options: CascadeOptions<T>
): Promise<CascadeResult<T>> {
  const startTime = Date.now();
  const cacheKey = generateCacheKey(
    options.task,
    options.prompt + (options.imagePart ? options.imagePart.inlineData.data.slice(0, 100) : '')
  );

  // TIER 1: In-Memory / KV Cache
  const cached = getFromCache<T>(cacheKey);
  if (cached) {
    return { data: cached, tier: 'tier1_cache', latencyMs: Date.now() - startTime };
  }

  // If no API key configured, jump directly to Tier 4 gracefully
  if (!hasGeminiKey()) {
    console.warn(`[VayuShield AI Cascade] No Gemini API key provided. Gracefully serving Tier 4 Deterministic Template.`);
    const fallbackData = options.fallbackFn();
    setToCache(cacheKey, fallbackData, 'tier4_fallback');
    return { data: fallbackData, tier: 'tier4_fallback', latencyMs: Date.now() - startTime };
  }

  const client = getGeminiClient();
  if (!client) {
    const fallbackData = options.fallbackFn();
    return { data: fallbackData, tier: 'tier4_fallback', latencyMs: Date.now() - startTime };
  }

  const contents = assembleGeminiContents(options);

  // TIER 2: Primary Call to gemini-2.5-flash with Retry
  const tier2Data = await tryTier2Primary(client, contents, options);
  if (tier2Data) {
    setToCache(cacheKey, tier2Data, 'tier2_flash');
    return {
      data: tier2Data,
      tier: 'tier2_flash',
      modelUsed: 'gemini-2.5-flash',
      latencyMs: Date.now() - startTime,
    };
  }

  // TIER 3: Fallback to gemini-2.5-flash-lite on 429/5xx/Rate Limit
  const tier3Data = await tryTier3Fallback(client, contents, options);
  if (tier3Data) {
    setToCache(cacheKey, tier3Data, 'tier3_flash_lite');
    return {
      data: tier3Data,
      tier: 'tier3_flash_lite',
      modelUsed: 'gemini-2.5-flash-lite',
      latencyMs: Date.now() - startTime,
    };
  }

  // TIER 4: Deterministic Rule-Based Template Fallback
  console.info(`[VayuShield AI Cascade] Executing Tier 4 Deterministic Template Fallback.`);
  const fallbackData = options.fallbackFn();
  setToCache(cacheKey, fallbackData, 'tier4_fallback');

  return { data: fallbackData, tier: 'tier4_fallback', latencyMs: Date.now() - startTime };
}
