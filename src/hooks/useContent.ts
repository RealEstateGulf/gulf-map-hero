'use client';
import { useState, useEffect, useCallback } from 'react';

type ContentMap = Record<string, { ar: string; en: string }>;

// Module-level dedup: prevents multiple simultaneous fetches for the same key
// but does NOT skip re-fetching on subsequent mounts (so admin changes always reflect)
const pending: Record<string, Promise<ContentMap>> = {};

function readCache(pageKey: string): ContentMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(`content:${pageKey}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(pageKey: string, data: ContentMap) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`content:${pageKey}`, JSON.stringify(data));
  } catch {}
}

function fetchContent(pageKey: string): Promise<ContentMap> {
  if (pageKey in pending) return pending[pageKey];
  pending[pageKey] = fetch(`/api/content/${pageKey}`, { cache: 'no-store' })
    .then(r => r.json())
    .then((json: ContentMap) => {
      delete pending[pageKey];
      writeCache(pageKey, json);
      return json;
    })
    .catch(() => {
      delete pending[pageKey];
      return {} as ContentMap;
    });
  return pending[pageKey];
}

export function useContent(pageKey: string) {
  // Seed from the last-known-good server response (cached in localStorage) so
  // the very first paint shows the real value instead of flashing a hardcoded
  // fallback (e.g. the old logo) while the fresh fetch below is in flight.
  const [data, setData] = useState<ContentMap>(() => readCache(pageKey));

  useEffect(() => {
    // Always fetch fresh data from the server — never rely solely on the cache.
    // This ensures admin changes immediately reflect on the site.
    fetchContent(pageKey).then(setData);
  }, [pageKey]);

  /** Get a text value — returns DB value if set, otherwise fallback */
  const get = useCallback(
    (key: string, isAr: boolean, fallback = ''): string => {
      const entry = data[key];
      if (!entry) return fallback;
      const val = isAr ? (entry.ar ?? '') : (entry.en ?? '');
      return val.trim() ? val : fallback;
    },
    [data]
  );

  /** Get an image URL — images are language-agnostic, stored in ar field */
  const getImg = useCallback(
    (key: string, fallback = ''): string => {
      const entry = data[key];
      const val = (entry?.ar ?? entry?.en ?? '').trim();
      return val || fallback;
    },
    [data]
  );

  return { get, getImg, data };
}
