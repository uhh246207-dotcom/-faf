'use client';

import { useSyncExternalStore } from 'react';

/* ============================================================
   Tiny toast queue. Items expire after `duration` ms.
   ============================================================ */

export type ToastVariant = 'default' | 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  description?: string;
  variant: ToastVariant;
  /** Milliseconds from creation. */
  duration: number;
  createdAt: number;
}

const SERVER_TOASTS: Toast[] = [];

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: Toast[]) {
  toasts = next;
  emit();
}

export const toastStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  getSnapshot(): Toast[] {
    return toasts;
  },
  getServerSnapshot(): Toast[] {
    return SERVER_TOASTS;
  },

  push(input: {
    message: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }): number {
    const id = nextId++;
    const toast: Toast = {
      id,
      message: input.message,
      description: input.description,
      variant: input.variant ?? 'default',
      duration: input.duration ?? 2800,
      createdAt: Date.now(),
    };
    commit([...toasts, toast]);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => toastStore.dismiss(id), toast.duration);
    }
    return id;
  },

  dismiss(id: number) {
    if (!toasts.some((t) => t.id === id)) return;
    commit(toasts.filter((t) => t.id !== id));
  },

  clear() {
    if (toasts.length === 0) return;
    commit([]);
  },
};

/** Convenience helpers. */
export const toast = {
  show: (message: string, options?: Partial<Omit<Toast, 'id' | 'createdAt' | 'message'>>) =>
    toastStore.push({ message, ...options }),
  success: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'createdAt' | 'message' | 'variant'>>
  ) => toastStore.push({ message, ...options, variant: 'success' }),
  error: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'createdAt' | 'message' | 'variant'>>
  ) => toastStore.push({ message, ...options, variant: 'error' }),
};

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot
  );
}
