/**
 * VayuShield AI - Tier 4 Deterministic Fallbacks
 * Guaranteed zero-crash fallback engine when Gemini API keys are absent,
 * invalid, or quota-exhausted. Uses domain heuristics & impactEngine calculations.
 */

export { fallbackIntake } from './fallbacks/intakeFallback';
export { fallbackVisionAudit } from './fallbacks/visionFallback';
export { fallbackAsk } from './fallbacks/askFallback';
