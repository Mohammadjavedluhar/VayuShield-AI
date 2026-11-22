/**
 * VayuShield AI - Senior-Friendly Font Scaler Hook
 * Manages 100%, 125%, and 150% text scaling for enhanced readability and WCAG accessibility.
 */

import { useState, useEffect } from 'react';

export type TextScale = '100' | '125' | '150';

const STORAGE_KEY = 'vayushield_text_scale';

export function useTextScale(): {
  scale: TextScale;
  setScale: (newScale: TextScale) => void;
} {
  const [scale, setScaleState] = useState<TextScale>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY) as TextScale;
      if (saved === '100' || saved === '125' || saved === '150') return saved;
    }
    return '100';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-text-scale', scale);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, scale);
    }
  }, [scale]);

  const setScale = (newScale: TextScale) => {
    setScaleState(newScale);
  };

  return { scale, setScale };
}
