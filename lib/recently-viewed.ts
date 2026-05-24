'use client';

import { useSyncExternalStore } from 'react';

/* ============================================================
   Recently-viewed product slugs. The store keeps a most-recent-
   first deduped list capped at MAX_ITEMS. Persisted to local
   storage so it survives reloads.
   ============================================================ */

const STORAGE_KEY = 'xfein:recent:v1';
const MAX_ITEMS = 12;

let slugs: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    /* quota — ignore */
  }
}

export function hydrateRecent() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        slugs = parsed.filter((x): x is string => typeof x === 'string');
      }
    }
  } catch {
    /* corrupt — start fresh */
  }
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      slugs = e.newValue ? JSON.parse(e.newValue) : [];
    } catch {
      slugs = [];
    }
    emit();
  });
  emit();
}

const SERVER_SNAPSHOT: string[] = [];

export const recentStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  getSnapshot(): string[] {
    return slugs;
  },
  getServerSnapshot(): string[] {
    return SERVER_SNAPSHOT;
  },

  /** Move (or insert) `slug` to the front. */
  push(slug: string) {
    const next = [slug, ...slugs.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
    if (next.length === slugs.length && next.every((s, i) => s === slugs[i])) {
      return; // no change
    }
    slugs = next;
    persist();
    emit();
  },

  remove(slug: string) {
    if (!slugs.includes(slug)) return;
    slugs = slugs.filter((s) => s !== slug);
    persist();
    emit();
  },

  clear() {
    if (slugs.length === 0) return;
    slugs = [];
    persist();
    emit();
  },
};

export function useRecent(): string[] {
  return useSyncExternalStore(
    recentStore.subscribe,
    recentStore.getSnapshot,
    recentStore.getServerSnapshot
  );
}
