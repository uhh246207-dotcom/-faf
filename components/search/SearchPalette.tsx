'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react';
import { uiStore, useUi } from '@/lib/ui-store';
import { cn } from '@/lib/utils';
import {
  products,
  getFeaturedProducts,
} from '@/content/products';
import {
  GAME_BRANDS,
  GameBadge,
} from '@/components/brand-logos';
import type {
  GameKey,
  Product,
} from '@/content/types';
import { getSiteContent } from '@/content';

const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const panel = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.97 },
};

/* Strip diacritics for accent-insensitive search.
 *   "Liên Quân" → "lien quan"
 * Useful for Vietnamese: typing "lien" matches "Liên".
 */
function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

interface Hit {
  product: Product;
  /** Lower = better match. Used to rank results. */
  score: number;
}

function search(query: string, locale: string): Hit[] {
  const site = getSiteContent(locale);
  const q = normalize(query.trim());

  if (!q) {
    /* Default surface = popular packs */
    return getFeaturedProducts(8).map((product) => ({ product, score: 0 }));
  }

  const tokens = q.split(/\s+/).filter(Boolean);

  const hits: Hit[] = [];
  for (const product of products) {
    const haystack = normalize(
      [
        product.name,
        product.tagline,
        product.description,
        product.brand ?? '',
        product.service ?? '',
        product.category === 'games'
          ? site.store.categoryGames
          : site.store.categoryDesign,
      ].join(' ')
    );

    let score = 0;
    let matched = true;
    for (const tok of tokens) {
      const idx = haystack.indexOf(tok);
      if (idx < 0) {
        matched = false;
        break;
      }
      // Earlier match = stronger signal; reward whole-word matches.
      score += idx;
      if (haystack === tok || haystack.startsWith(tok)) score -= 50;
    }
    if (!matched) continue;

    // Boost popular / new entries slightly so a tie favours useful packs.
    if (product.badges.includes('popular')) score -= 8;
    if (product.badges.includes('new')) score -= 4;

    hits.push({ product, score });
  }
  return hits.sort((a, b) => a.score - b.score).slice(0, 12);
}

export function SearchPalette() {
  const { searchOpen } = useUi();
  const t = useTranslations('Shop');
  const locale = useLocale();
  const router = useRouter();

  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const hits = useMemo(() => search(q, locale), [q, locale]);

  /* Reset state on close */
  useEffect(() => {
    if (!searchOpen) {
      setQ('');
      setActive(0);
    }
  }, [searchOpen]);

  /* Focus input on open + lock body scroll */
  useEffect(() => {
    if (!searchOpen) return;
    const tmr = window.setTimeout(() => inputRef.current?.focus(), 30);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(tmr);
      document.body.style.overflow = prevOverflow;
    };
  }, [searchOpen]);

  /* Clamp active to current results */
  useEffect(() => {
    if (active >= hits.length) setActive(Math.max(0, hits.length - 1));
  }, [hits.length, active]);

  const navigateTo = (product: Product) => {
    const prefix = locale === 'zh' ? '' : `/${locale}`;
    uiStore.closeSearch();
    router.push(`${prefix}/store/${product.slug}`);
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      uiStore.closeSearch();
      return;
    }
    if (hits.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + hits.length) % hits.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = hits[active];
      if (hit) navigateTo(hit.product);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(hits.length - 1);
    }
  };

  /* Scroll active option into view */
  useEffect(() => {
    if (!searchOpen) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${active}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, searchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <div
          key="search-palette"
          role="dialog"
          aria-modal="true"
          aria-label={t('search')}
          className="fixed inset-0 z-[75] grid place-items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]"
          onKeyDown={onKey}
        >
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.18, ease: 'linear' }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => uiStore.closeSearch()}
          />

          <motion.div
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl glass-strong shadow-card-hover rounded-2xl overflow-hidden flex flex-col max-h-[78vh]"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/70">
              <Search
                className="h-4 w-4 text-fg-muted shrink-0"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                placeholder={t('searchPlaceholder')}
                className="flex-1 bg-transparent text-[15px] text-fg placeholder:text-fg-muted outline-none"
                aria-label={t('search')}
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-activedescendant={
                  hits[active]
                    ? `search-opt-${hits[active].product.slug}`
                    : undefined
                }
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ('');
                    inputRef.current?.focus();
                  }}
                  aria-label={t('close')}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-muted hover:bg-bg-soft hover:text-fg transition-colors"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => uiStore.closeSearch()}
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border/70 bg-bg-soft px-2 h-6 text-[11px] font-semibold text-fg-muted tracking-wide"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            {hits.length > 0 ? (
              <ul
                ref={listRef}
                id="search-results"
                role="listbox"
                aria-label={t('search')}
                className="overflow-y-auto py-2"
              >
                {!q && (
                  <li
                    aria-hidden="true"
                    className="px-4 pt-1 pb-1.5 text-[11px] uppercase tracking-eyebrow text-fg-muted"
                  >
                    {t('searchRecent')}
                  </li>
                )}
                {hits.map((hit, i) => (
                  <SearchResultRow
                    key={hit.product.slug}
                    idx={i}
                    product={hit.product}
                    active={i === active}
                    locale={locale}
                    onHover={() => setActive(i)}
                    onSelect={() => navigateTo(hit.product)}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <Search
                  className="h-8 w-8 text-fg-muted mb-3"
                  aria-hidden="true"
                />
                <p className="text-[14.5px] font-semibold text-fg">
                  {t('searchEmpty')}
                </p>
                <p className="mt-1 text-[13px] text-fg-muted">{q}</p>
              </div>
            )}

            {/* Footer hints */}
            <div className="border-t border-border/70 px-4 py-2.5 flex items-center justify-between text-[11.5px] text-fg-muted">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Kbd>
                    <CornerDownLeft className="h-2.5 w-2.5" />
                  </Kbd>
                </span>
              </div>
              <span className="tabular-nums">
                {hits.length}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded border border-border/70 bg-white/60 px-1 h-5 min-w-[20px] text-[10.5px] font-semibold text-fg-body">
      {children}
    </kbd>
  );
}

function SearchResultRow({
  idx,
  product,
  active,
  locale,
  onHover,
  onSelect,
}: {
  idx: number;
  product: Product;
  active: boolean;
  locale: string;
  onHover: () => void;
  onSelect: () => void;
}) {
  const site = getSiteContent(locale);
  const isGame = product.category === 'games';
  const game =
    isGame && product.brand ? GAME_BRANDS[product.brand as GameKey] : null;
  const categoryLabel = isGame
    ? site.store.categoryGames
    : site.store.categoryDesign;

  return (
    <li
      data-idx={idx}
      role="option"
      id={`search-opt-${product.slug}`}
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={cn(
        'mx-2 rounded-xl px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-colors',
        active ? 'bg-white shadow-card text-fg' : 'text-fg-body hover:bg-white/60'
      )}
    >
      {/* Visual */}
      <span className="shrink-0">
        {game ? (
          <GameBadge brand={product.brand as GameKey} size={36} rounded="lg" />
        ) : (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-grad text-white text-[12px] font-bold">
            {product.name.charAt(0)}
          </span>
        )}
      </span>

      {/* Text */}
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-[14px] font-semibold leading-tight truncate">
            {product.name}
          </span>
          <span className="shrink-0 inline-flex items-center rounded-full bg-bg-soft px-1.5 h-4 text-[10px] uppercase tracking-eyebrow text-fg-muted">
            {categoryLabel}
          </span>
        </span>
        <span className="block text-[12.5px] text-fg-muted truncate">
          {product.tagline}
        </span>
      </span>

      {/* Price + arrow */}
      <span className="shrink-0 flex items-center gap-2">
        <span className="text-[12.5px] font-semibold text-fg tabular-nums">
          {product.currency}
          {product.fromPrice.toLocaleString('en-US')}
        </span>
        <ArrowRight
          className={cn(
            'h-3.5 w-3.5 transition-all',
            active
              ? 'text-accent-1 translate-x-0 opacity-100'
              : 'text-fg-muted -translate-x-1 opacity-0'
          )}
          aria-hidden="true"
        />
      </span>
    </li>
  );
}
