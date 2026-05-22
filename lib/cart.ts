'use client';

import { useSyncExternalStore } from 'react';

/* ============================================================
   Cart store — minimal, persisted in localStorage.
   No external deps; uses useSyncExternalStore so any client
   component can subscribe with `useCart()` / `useCartCount()`.
   ============================================================ */

export interface CartLine {
  /** Stable composite identity */
  productSlug: string;
  variantId: string;

  /** Snapshot of the product/variant when added (so the cart
   *  is robust if catalogue prices later shift). */
  name: string;
  variantLabel: string;
  price: number;
  currency: string;
  category: 'games' | 'design';
  brand?: string;
  service?: string;

  qty: number;
}

const STORAGE_KEY = 'xfein:cart:v1';

let lines: CartLine[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* quota / private mode — ignore */
  }
}

/** Read once from localStorage. Safe to call repeatedly — no-op
 *  after the first run. */
export function hydrateCart() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        lines = parsed.filter(
          (x): x is CartLine =>
            x &&
            typeof x.productSlug === 'string' &&
            typeof x.variantId === 'string' &&
            typeof x.qty === 'number'
        );
      }
    }
  } catch {
    /* corrupt — start fresh */
  }
  // Cross-tab sync: re-hydrate when another tab updates cart
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      lines = e.newValue ? JSON.parse(e.newValue) : [];
    } catch {
      lines = [];
    }
    emit();
  });
  emit();
}

const SERVER_SNAPSHOT: CartLine[] = [];

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): CartLine[] {
    return lines;
  },
  getServerSnapshot(): CartLine[] {
    return SERVER_SNAPSHOT;
  },

  add(line: Omit<CartLine, 'qty'>, qty = 1) {
    const idx = lines.findIndex(
      (l) =>
        l.productSlug === line.productSlug && l.variantId === line.variantId
    );
    if (idx >= 0) {
      lines = lines.map((l, i) =>
        i === idx ? { ...l, qty: l.qty + qty } : l
      );
    } else {
      lines = [...lines, { ...line, qty }];
    }
    persist();
    emit();
  },

  remove(productSlug: string, variantId: string) {
    lines = lines.filter(
      (l) => !(l.productSlug === productSlug && l.variantId === variantId)
    );
    persist();
    emit();
  },

  setQty(productSlug: string, variantId: string, qty: number) {
    if (qty <= 0) {
      cartStore.remove(productSlug, variantId);
      return;
    }
    lines = lines.map((l) =>
      l.productSlug === productSlug && l.variantId === variantId
        ? { ...l, qty }
        : l
    );
    persist();
    emit();
  },

  clear() {
    if (lines.length === 0) return;
    lines = [];
    persist();
    emit();
  },
};

/* -------------------- Hooks -------------------- */

export function useCart(): CartLine[] {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
}

export function useCartCount(): number {
  const c = useCart();
  let total = 0;
  for (const l of c) total += l.qty;
  return total;
}

export function useCartTotal(): number {
  const c = useCart();
  let total = 0;
  for (const l of c) total += l.qty * l.price;
  return total;
}
