'use client';

import { useSyncExternalStore } from 'react';

/* ============================================================
   Wishlist store — same shape and persistence pattern as cart.
   Stored as { slug, savedAt } so we can render a "saved 3 days
   ago" hint later if we want.
   ============================================================ */

export interface WishlistEntry {
  slug: string;
  /** Epoch ms when the user saved this product. */
  savedAt: number;
}

const STORAGE_KEY = 'xfein:wishlist:v1';
/** Cap on items kept — avoids unbounded growth in localStorage. */
const MAX_ENTRIES = 60;

let entries: WishlistEntry[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota / private mode — ignore */
  }
}

/** Read once from localStorage. Safe to call repeatedly. */
export function hydrateWishlist() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        entries = parsed.filter(
          (x): x is WishlistEntry =>
            x && typeof x.slug === 'string' && typeof x.savedAt === 'number'
        );
      }
    }
  } catch {
    /* corrupt — start fresh */
  }
  // Cross-tab sync.
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      entries = e.newValue ? JSON.parse(e.newValue) : [];
    } catch {
      entries = [];
    }
    emit();
  });
  emit();
}

const SERVER_SNAPSHOT: WishlistEntry[] = [];

export const wishlistStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  getSnapshot(): WishlistEntry[] {
    return entries;
  },
  getServerSnapshot(): WishlistEntry[] {
    return SERVER_SNAPSHOT;
  },

  has(slug: string): boolean {
    return entries.some((e) => e.slug === slug);
  },

  add(slug: string) {
    if (entries.some((e) => e.slug === slug)) return;
    entries = [{ slug, savedAt: Date.now() }, ...entries].slice(0, MAX_ENTRIES);
    persist();
    emit();
  },

  remove(slug: string) {
    if (!entries.some((e) => e.slug === slug)) return;
    entries = entries.filter((e) => e.slug !== slug);
    persist();
    emit();
  },

  toggle(slug: string): boolean {
    const has = entries.some((e) => e.slug === slug);
    if (has) wishlistStore.remove(slug);
    else wishlistStore.add(slug);
    return !has;
  },

  clear() {
    if (entries.length === 0) return;
    entries = [];
    persist();
    emit();
  },
};

/* -------------------- Hooks -------------------- */

export function useWishlist(): WishlistEntry[] {
  return useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot
  );
}

export function useWishlistCount(): number {
  return useWishlist().length;
}

export function useIsSaved(slug: string): boolean {
  const list = useWishlist();
  return list.some((e) => e.slug === slug);
}
