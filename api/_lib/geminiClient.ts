import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

export function hasGeminiKey(): boolean {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 10);
}
