import { describe, expect, it } from 'vitest';
import { executeAiCascade, getFromCache, setToCache } from '../../api/_lib/aiCascade';
import { z } from 'zod';

const TestSchema = z.object({
  message: z.string(),
  score: z.number(),
});

describe('4-Tier Resilience AI Cascade - aiCascade.ts', () => {
  it('stores and retrieves items from in-memory cache', () => {
    const key = 'test_cache_key';
    const val = { message: 'hello', score: 100 };
    setToCache(key, val, 'tier1_cache', 5000);

    const retrieved = getFromCache(key);
    expect(retrieved).toEqual(val);
  });

  it('evicts expired items from cache', async () => {
    const key = 'test_expired_key';
    const val = { message: 'expires_fast', score: 10 };
    setToCache(key, val, 'tier1_cache', 10); // 10ms TTL

    await new Promise((r) => setTimeout(r, 20));
    const retrieved = getFromCache(key);
    expect(retrieved).toBeNull();
  });

  it('falls back seamlessly to Tier 4 deterministic template when no Gemini key is provided', async () => {
    const result = await executeAiCascade({
      task: 'unit_test_cascade',
      prompt: 'Test query',
      zodSchema: TestSchema,
      fallbackFn: () => ({
        message: 'Guaranteed deterministic response',
        score: 42,
      }),
    });

    expect(result.data.message).toBe('Guaranteed deterministic response');
    expect(result.data.score).toBe(42);
    expect(result.tier).toBe('tier4_fallback');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
