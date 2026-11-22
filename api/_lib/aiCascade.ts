/**
 * VayuShield AI - 4-Tier Resilience Cascade
 *
 * Guaranteed 100% uptime architecture for Gemini AI calls:
 * Tier 1: In-memory TTL / LRU Cache
 * Tier 2: Call primary model (gemini-2.5-flash) with exponential backoff retry
 * Tier 3: Automatic fallback to lightweight model (gemini-2.5-flash-lite) on 429/5xx/quota limits
 * Tier 4: Deterministic rule-based template fallback using impactEngine formulas
 */

import { ZodSchema } from 'zod';
import { getGeminiClient, hasGeminiKey } from './geminiClient';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  tier: string;
}

// In-memory cache for serverless invocation / node process
const IN_MEMORY_CACHE = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_CACHE_ENTRIES = 500;

function generateCacheKey(task: string, inputString: string): string {
  // Simple fast hash string
  let hash = 0;
  const str = `${task}::${inputString}`;
  for (let i = 0; i < str.length; i++) {
    hash = Math.trunc((hash << 5) - hash + str.charCodeAt(i));
  }
  return `vayushield_${task}_${Math.abs(hash)}`;
}

export function getFromCache<T>(key: string): T | null {
  const entry = IN_MEMORY_CACHE.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    IN_MEMORY_CACHE.delete(key);
    return null;
  }
  return entry.data;
}

export function setToCache<T>(key: string, data: T, tier: string, ttlMs = DEFAULT_TTL_MS): void {
  if (IN_MEMORY_CACHE.size > MAX_CACHE_ENTRIES) {
    const oldestKey = IN_MEMORY_CACHE.keys().next().value;
    if (oldestKey) IN_MEMORY_CACHE.delete(oldestKey);
  }
  IN_MEMORY_CACHE.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
    tier,
  });
}

export interface CascadeOptions<T> {
  task: string;
  prompt: string;
  systemInstruction?: string;
  imagePart?: {
    inlineData: {
      data: string;
      mimeType: string;
    };
  };
  zodSchema: ZodSchema<T>;
  fallbackFn: () => T;
  temperature?: number;
}

export interface CascadeResult<T> {
  data: T;
  tier: 'tier1_cache' | 'tier2_flash' | 'tier3_flash_lite' | 'tier4_fallback';
  modelUsed?: string;
  latencyMs: number;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assembleGeminiContents<T>(options: CascadeOptions<T>): Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> {
  const contents: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];
  if (options.systemInstruction) {
    contents.push({ text: `System Instructions: ${options.systemInstruction}` });
  }
  if (options.imagePart) {
    contents.push(options.imagePart);
  }
  contents.push({ text: options.prompt });
  return contents;
}

async function requestModelGeneration<T>(
  client: NonNullable<ReturnType<typeof getGeminiClient>>,
  model: string,
  contents: unknown,
  options: CascadeOptions<T>
): Promise<T | null> {
  const response = await client.models.generateContent({
    model,
    contents: contents as Parameters<typeof client.models.generateContent>[0]['contents'],
    config: {
      temperature: options.temperature ?? 0.2,
      responseMimeType: 'application/json',
    },
  });

  const responseText = response.text;
  if (!responseText) return null;
  const parsedJson = JSON.parse(responseText);
  return options.zodSchema.parse(parsedJson);
}

async function tryTier2Primary<T>(
  client: NonNullable<ReturnType<typeof getGeminiClient>>,
  contents: unknown,
  options: CascadeOptions<T>
): Promise<T | null> {
  const primaryModel = 'gemini-2.5-flash';
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await requestModelGeneration(client, primaryModel, contents, options);
      if (result) return result;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[VayuShield AI Cascade] Attempt ${attempt} failed on ${primaryModel}:`, errMsg);
      if (attempt === 1) {
        await sleep(600);
      }
    }
  }
  return null;
}

async function tryTier3Fallback<T>(
  client: NonNullable<ReturnType<typeof getGeminiClient>>,
  contents: unknown,
  options: CascadeOptions<T>
): Promise<T | null> {
  const fallbackModel = 'gemini-2.5-flash-lite';
  try {
    console.info(`[VayuShield AI Cascade] Cascading to Tier 3 fallback model: ${fallbackModel}`);
    return await requestModelGeneration(client, fallbackModel, contents, options);
  } catch (tier3Err: unknown) {
    const errMsg = tier3Err instanceof Error ? tier3Err.message : String(tier3Err);
    console.warn(`[VayuShield AI Cascade] Tier 3 (${fallbackModel}) failed:`, errMsg);
    return null;
  }
}

/**
 * Executes the 4-Tier Resilience Cascade with guaranteed non-crashing output
 */
export async function executeAiCascade<T>(
  options: CascadeOptions<T>
): Promise<CascadeResult<T>> {
  const startTime = Date.now();
  const cacheKey = generateCacheKey(
    options.task,
    options.prompt + (options.imagePart ? options.imagePart.inlineData.data.slice(0, 100) : '')
  );

  // --- TIER 1: In-Memory / KV Cache ---
  const cached = getFromCache<T>(cacheKey);
  if (cached) {
    return {
      data: cached,
      tier: 'tier1_cache',
      latencyMs: Date.now() - startTime,
    };
  }

  // If no API key configured, jump directly to Tier 4 gracefully
  if (!hasGeminiKey()) {
    console.warn(`[VayuShield AI Cascade] No Gemini API key provided. Gracefully serving Tier 4 Deterministic Template.`);
    const fallbackData = options.fallbackFn();
    setToCache(cacheKey, fallbackData, 'tier4_fallback');
    return {
      data: fallbackData,
      tier: 'tier4_fallback',
      latencyMs: Date.now() - startTime,
    };
  }

  const client = getGeminiClient();
  if (!client) {
    const fallbackData = options.fallbackFn();
    return {
      data: fallbackData,
      tier: 'tier4_fallback',
      latencyMs: Date.now() - startTime,
    };
  }

  const contents = assembleGeminiContents(options);

  // --- TIER 2: Primary Call to gemini-2.5-flash with Retry ---
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

  // --- TIER 3: Fallback to gemini-2.5-flash-lite on 429/5xx/Rate Limit ---
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

  // --- TIER 4: Deterministic Rule-Based Template Fallback ---
  console.info(`[VayuShield AI Cascade] Executing Tier 4 Deterministic Template Fallback.`);
  const fallbackData = options.fallbackFn();
  setToCache(cacheKey, fallbackData, 'tier4_fallback');

  return {
    data: fallbackData,
    tier: 'tier4_fallback',
    latencyMs: Date.now() - startTime,
  };
}
