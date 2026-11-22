/**
 * VayuShield AI - In-Memory AI Response Cache
 * In-memory TTL cache to deliver Tier 1 sub-millisecond repeated responses.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  tier: string;
}

const IN_MEMORY_CACHE = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_CACHE_ENTRIES = 500;

/**
 * Generates deterministic cache hash key from task name and input string.
 * @param task - Identifier of the AI task
 * @param inputString - Input string / prompt to hash
 * @returns Unique cache key
 */
export function generateCacheKey(task: string, inputString: string): string {
  let hash = 0;
  const str = `${task}::${inputString}`;
  for (let i = 0; i < str.length; i++) {
    hash = Math.trunc((hash << 5) - hash + str.charCodeAt(i));
  }
  return `vayushield_${task}_${Math.abs(hash)}`;
}

/**
 * Retrieves valid unexpired data from in-memory cache.
 * @param key - Cache key
 * @returns Cached data or null
 */
export function getFromCache<T>(key: string): T | null {
  const entry = IN_MEMORY_CACHE.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    IN_MEMORY_CACHE.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Stores payload in in-memory cache with eviction when maximum capacity is exceeded.
 * @param key - Cache key
 * @param data - Payload to cache
 * @param tier - Source tier
 * @param ttlMs - Time to live in milliseconds
 */
export function setToCache<T>(key: string, data: T, tier: string, ttlMs: number = DEFAULT_TTL_MS): void {
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
