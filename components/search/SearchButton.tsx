'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { uiStore } from '@/lib/ui-store';
import { cn } from '@/lib/utils';

interface Props {
  /** Compact button = icon only (used inside the navbar pill).
   *  Non-compact shows label + Cmd+K hint. */
  compact?: boolean;
}

export function SearchButton({ compact = true }: Props) {
  const t = useTranslations('Shop');

  /* Global Cmd/Ctrl+K shortcut */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        uiStore.toggleSearch();
      } else if (e.key === '/' && !isTypingTarget(e.target)) {
        e.preventDefault();
        uiStore.openSearch();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => uiStore.openSearch()}
        aria-label={t('search')}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg hover:bg-white/40 hover:text-accent-1 transition-colors"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => uiStore.openSearch()}
      aria-label={t('search')}
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-white/60 hover:bg-white text-fg-body hover:text-fg h-9 pl-3 pr-1 transition-colors border border-border/70 min-w-[200px]'
      )}
    >
      <Search className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="text-[13px] flex-1 text-left text-fg-muted">
        {t('searchPlaceholder')}
      </span>
      <kbd className="inline-flex items-center gap-0.5 rounded-full bg-bg-soft border border-border/70 px-2 h-6 text-[10.5px] font-semibold text-fg-muted tabular-nums">
        {t('searchKbdHint')}
      </kbd>
    </button>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}
