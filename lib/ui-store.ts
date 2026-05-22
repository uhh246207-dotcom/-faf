'use client';

import { useSyncExternalStore } from 'react';

/* ============================================================
   Tiny UI store for global overlays (cart drawer, search
   palette, mobile menu). Each piece of state is a flat boolean.
   Components subscribe via `useUi()`.
   ============================================================ */

export interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
}

const SERVER_STATE: UiState = {
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
};

let state: UiState = { ...SERVER_STATE };
const listeners = new Set<() => void>();

function commit(next: UiState) {
  state = next;
  listeners.forEach((l) => l());
}

export const uiStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  getSnapshot(): UiState {
    return state;
  },
  getServerSnapshot(): UiState {
    return SERVER_STATE;
  },

  openCart() {
    if (state.cartOpen) return;
    commit({ ...state, cartOpen: true, searchOpen: false, menuOpen: false });
  },
  closeCart() {
    if (!state.cartOpen) return;
    commit({ ...state, cartOpen: false });
  },
  openSearch() {
    if (state.searchOpen) return;
    commit({ ...state, searchOpen: true, cartOpen: false, menuOpen: false });
  },
  closeSearch() {
    if (!state.searchOpen) return;
    commit({ ...state, searchOpen: false });
  },
  toggleSearch() {
    commit({
      ...state,
      searchOpen: !state.searchOpen,
      cartOpen: false,
      menuOpen: false,
    });
  },
  openMenu() {
    if (state.menuOpen) return;
    commit({ ...state, menuOpen: true, cartOpen: false, searchOpen: false });
  },
  closeMenu() {
    if (!state.menuOpen) return;
    commit({ ...state, menuOpen: false });
  },
  closeAll() {
    if (!state.cartOpen && !state.searchOpen && !state.menuOpen) return;
    commit({ cartOpen: false, searchOpen: false, menuOpen: false });
  },
};

export function useUi(): UiState {
  return useSyncExternalStore(
    uiStore.subscribe,
    uiStore.getSnapshot,
    uiStore.getServerSnapshot
  );
}
