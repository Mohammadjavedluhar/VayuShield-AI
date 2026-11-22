import { describe, expect, it, vi } from 'vitest';
import { executeAiCascade, getFromCache, setToCache } from '../api/_lib/aiCascade';
import * as geminiClientModule from '../api/_lib/geminiClient';
import { z } from 'zod';

const SampleSchema = z.object({
  status: z.string(),
  val: z.number(),
});

function setupMockGeminiClient(mockGenerateContent: any) {
  const mockClient = {
    models: {
      generateContent: mockGenerateContent,
    },
  };
  vi.spyOn(geminiClientModule, 'hasGeminiKey').mockReturnValue(true);
  vi.spyOn(geminiClientModule, 'getGeminiClient').mockReturnValue(mockClient as any);
  return mockClient;
}

describe('AI Cascade Full Resilience Coverage - tests/aiCascadeFullCoverage.test.ts', () => {
  it('covers MAX_CACHE_ENTRIES eviction in setToCache', () => {
    // Fill cache with over 500 items to trigger oldestKey eviction
    for (let i = 0; i < 505; i++) {
      setToCache(`flood_key_${i}`, { data: i }, 'tier1_cache', 100000);
    }
    // Verify latest keys are accessible
    expect(getFromCache('flood_key_504')).toEqual({ data: 504 });
  });

  it('covers imagePart cache key generation and Tier 1 cache hit', async () => {
    const options = {
      task: 'test_vision_cache',
      prompt: 'Describe image',
      imagePart: {
        inlineData: {
          data: 'base64sampleimagestringdata',
          mimeType: 'image/jpeg',
        },
      },
      zodSchema: SampleSchema,
      fallbackFn: () => ({ status: 'ok', val: 1 }),
    };

    const firstRun = await executeAiCascade(options);
    expect(firstRun.tier).toBe('tier4_fallback');

    // Second run should immediately hit Tier 1 cache
    const secondRun = await executeAiCascade(options);
    expect(secondRun.tier).toBe('tier1_cache');
    expect(secondRun.data).toEqual({ status: 'ok', val: 1 });
  });

  it('covers Tier 2 primary model success when client generates content', async () => {
    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: JSON.stringify({ status: 'gemini_flash_success', val: 99 }),
    });
    setupMockGeminiClient(mockGenerateContent);

    const result = await executeAiCascade({
      task: 'primary_tier2_test',
      prompt: 'Evaluate',
      systemInstruction: 'Act as air doctor',
      imagePart: { inlineData: { data: 'imgdata', mimeType: 'image/png' } },
      zodSchema: SampleSchema,
      fallbackFn: () => ({ status: 'fallback', val: 0 }),
    });

    expect(result.tier).toBe('tier2_flash');
    expect(result.data.status).toBe('gemini_flash_success');
    expect(result.data.val).toBe(99);
    expect(result.modelUsed).toBe('gemini-2.5-flash');

    vi.restoreAllMocks();
  });

  it('covers Tier 2 attempt 1 error followed by attempt 2 retry success', async () => {
    const mockGenerateContent = vi
      .fn()
      .mockRejectedValueOnce(new Error('Transient 503 Service Unavailable'))
      .mockResolvedValueOnce({
        text: JSON.stringify({ status: 'retry_success', val: 42 }),
      });
    setupMockGeminiClient(mockGenerateContent);

    const result = await executeAiCascade({
      task: 'tier2_retry_test',
      prompt: 'Retry query',
      zodSchema: SampleSchema,
      fallbackFn: () => ({ status: 'fallback', val: 0 }),
    });

    expect(result.tier).toBe('tier2_flash');
    expect(result.data.status).toBe('retry_success');
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);

    vi.restoreAllMocks();
  });

  it('covers Tier 3 fallback to flash-lite when Tier 2 fails both attempts', async () => {
    const mockGenerateContent = vi
      .fn()
      .mockRejectedValueOnce(new Error('Rate limit 429'))
      .mockRejectedValueOnce(new Error('Rate limit 429'))
      .mockResolvedValueOnce({
        text: JSON.stringify({ status: 'flash_lite_success', val: 88 }),
      });
    setupMockGeminiClient(mockGenerateContent);

    const result = await executeAiCascade({
      task: 'tier3_fallback_test',
      prompt: 'Cascading query',
      systemInstruction: 'Act as air quality guardian',
      imagePart: { inlineData: { data: 'imgdata3', mimeType: 'image/png' } },
      zodSchema: SampleSchema,
      fallbackFn: () => ({ status: 'fallback', val: 0 }),
    });

    expect(result.tier).toBe('tier3_flash_lite');
    expect(result.data.status).toBe('flash_lite_success');
    expect(result.modelUsed).toBe('gemini-2.5-flash-lite');

    vi.restoreAllMocks();
  });

  it('covers Tier 4 fallback when all Gemini tiers fail with exceptions', async () => {
    const mockGenerateContent = vi
      .fn()
      .mockRejectedValue(new Error('Network offline or quota exceeded'));
    setupMockGeminiClient(mockGenerateContent);

    const result = await executeAiCascade({
      task: 'all_fail_test',
      prompt: 'Unreachable query',
      zodSchema: SampleSchema,
      fallbackFn: () => ({ status: 'guaranteed_tier4', val: 777 }),
    });

    expect(result.tier).toBe('tier4_fallback');
    expect(result.data.status).toBe('guaranteed_tier4');

    vi.restoreAllMocks();
  });

  it('handles getGeminiClient returning null even if hasGeminiKey is true', async () => {
    vi.spyOn(geminiClientModule, 'hasGeminiKey').mockReturnValue(true);
    vi.spyOn(geminiClientModule, 'getGeminiClient').mockReturnValue(null);

    const result = await executeAiCascade({
      task: 'null_client_test',
      prompt: 'Null query',
      zodSchema: SampleSchema,
      fallbackFn: () => ({ status: 'null_fallback', val: 123 }),
    });

    expect(result.tier).toBe('tier4_fallback');
    expect(result.data.status).toBe('null_fallback');

    vi.restoreAllMocks();
  });
});
