/**
 * VayuShield AI - API Client HTTP Transport
 * Shared JSON POST helper with network error suppression for offline resilience.
 */

export async function postJson<T>(endpoint: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    console.warn(`[ApiClient] ${endpoint} offline, falling back to client-side engine:`, err);
  }
  return null;
}
