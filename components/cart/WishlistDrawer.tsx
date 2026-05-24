'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  hydrateWishlist,
  useWishlist,
  wishlistStore,
} from '@/lib/wishlist';
import { uiStore, useUi } from '@/lib/ui-store';
import { products as catalogue } from '@/content/products';
import {
  GameBadge,
  GAME_BRANDS,
} from '@/components/brand-logos';
import type { GameKey, Product } from '@/content/types';

const overlay = { hidden: { opacity: 0 }, show: { opacity: 1 } };
const panel = {
  hidden: { x: '100%' },
  show: { x: 0 },
  exit: { x: '100%' },
};

export function WishlistDrawer() {
  const { wishlistOpen } = useUi();
  const t = useTranslations('Shop');
  const list = useWishlist();

  /* Hydrate once. */
  useEffect(() => {
    hydrateWishlist();
  }, []);

  /* Esc to close + body scroll lock while open. */
  useEffect(() => {
    if (!wishlistOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') uiStore.closeWishlist();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [wishlistOpen]);

  /* Resolve persisted slugs against the current catalogue. Slugs
   * that no longer exist (e.g. discontinued items) are skipped. */
  const resolved = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of catalogue) map.set(p.slug, p);
    return list.flatMap((entry) => {
      const product = map.get(entry.slug);
      return product ? [product] : [];
    });
  }, [list]);

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <div
          key="wishlist-drawer"
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={t('wishlistTitle')}
        >
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.22, ease: 'linear' }}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            onClick={() => uiStore.closeWishlist()}
          />

          <motion.aside
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md flex flex-col bg-white shadow-card-hover"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-pill">
                  <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-fg leading-tight">
                    {t('wishlistTitle')}
                  </h2>
                  <p className="text-[12px] text-fg-muted leading-tight">
                    {t('items', { count: resolved.length })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => uiStore.closeWishlist()}
                aria-label={t('close')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-body hover:bg-bg-soft hover:text-fg transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            {/* Body */}
            {resolved.length === 0 ? (
              <Empty
                title={t('wishlistEmpty')}
                hint={t('wishlistEmptyHint')}
                cta={t('cartContinueShopping')}
              />
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {resolved.map((product) => (
                    <WishlistRow key={product.slug} product={product} t={t} />
                  ))}
                </ul>
                <footer className="border-t border-border bg-bg-soft/60 px-5 py-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => wishlistStore.clear()}
                    className="inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('wishlistClear')}
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Empty({
  title,
  hint,
  cta,
}: {
  title: string;
  hint: string;
  cta: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 rounded-full bg-rose-300/40 blur-2xl" />
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-soft text-rose-500 ring-1 ring-border">
          <Heart className="h-7 w-7" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-fg mb-1.5 tracking-tightish">
        {title}
      </h3>
      <p className="text-[14px] text-fg-body leading-6 mb-6 max-w-[260px]">
        {hint}
      </p>
      <Link
        href="/store"
        onClick={() => uiStore.closeWishlist()}
        className="group inline-flex items-center gap-2 rounded-full bg-accent-grad text-white h-11 px-5 text-[14px] font-medium shadow-pill hover:-translate-y-0.5 transition-all"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function WishlistRow({
  product,
  t,
}: {
  product: Product;
  t: (key: string) => string;
}) {
  const game =
    product.category === 'games' && product.brand
      ? GAME_BRANDS[product.brand as GameKey]
      : null;

  const heroBg = game
    ? `linear-gradient(135deg, ${game.from} 0%, ${game.to} 100%)`
    : 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)';

  return (
    <li className="flex gap-3 rounded-2xl border border-border bg-white p-3.5 shadow-card">
      <Link
        href={`/store/${product.slug}`}
        onClick={() => uiStore.closeWishlist()}
        className="shrink-0 relative h-14 w-14 rounded-xl overflow-hidden"
        style={{ backgroundImage: heroBg }}
        aria-label={product.name}
      >
        {game?.image ? (
          <Image
            src={game.image}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
            aria-hidden="true"
          />
        ) : game ? (
          <span className="absolute inset-0 grid place-items-center">
            <GameBadge brand={product.brand as GameKey} size={28} />
          </span>
        ) : (
          <span className="absolute inset-0 grid place-items-center text-white text-[12px] font-bold">
            {product.name.charAt(0)}
          </span>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/store/${product.slug}`}
          onClick={() => uiStore.closeWishlist()}
          className="block text-[14.5px] font-semibold text-fg leading-tight truncate hover:text-accent-1 transition-colors"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-[12.5px] text-fg-muted truncate">
          {product.tagline}
        </p>
        <p className="mt-1.5 text-[13.5px] font-semibold text-fg tabular-nums">
          {product.currency}
          {product.fromPrice.toLocaleString('en-US')}
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={() => wishlistStore.remove(product.slug)}
          aria-label={t('removeFromWishlist')}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-muted hover:bg-bg-soft hover:text-rose-500 transition-colors"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <Link
          href={`/store/${product.slug}`}
          onClick={() => uiStore.closeWishlist()}
          aria-label={product.name}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-grad text-white shadow-pill"
        >
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
