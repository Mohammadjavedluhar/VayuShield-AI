/**
 * VayuShield AI - Multi-Tier Model Invocation Helpers
 * Implements Tier 2 (Flash) and Tier 3 (Flash-Lite) execution with backoff retry.
 */

import { getGeminiClient } from './geminiClient';
import type { CascadeOptions } from './cascadeTypes';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function assembleGeminiContents<T>(
  options: CascadeOptions<T>
): Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> {
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

export async function requestModelGeneration<T>(
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

export async function tryTier2Primary<T>(
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

export async function tryTier3Fallback<T>(
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
