'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { hydrateRecent, recentStore, useRecent } from '@/lib/recently-viewed';
import { ProductCard } from './ProductCard';
import { products as catalogue } from '@/content/products';
import type { Product, SiteContent } from '@/content/types';
import { fadeUp, staggerParent, inViewOnce } from '@/lib/animations';

interface Props {
  strings: SiteContent['store'];
  /** Maximum cards to show. Default 4. */
  limit?: number;
}

export function RecentlyViewed({ strings, limit = 4 }: Props) {
  const t = useTranslations('Shop');
  const slugs = useRecent();

  /* Hydrate once on mount. The store will emit when localStorage
   * is read, which triggers a re-render of this component. */
  useEffect(() => {
    hydrateRecent();
  }, []);

  /* Resolve slugs against the live catalogue. Stale slugs are
   * silently dropped rather than crashing — the user may have
   * persisted a slug that's since been removed from the menu. */
  const resolved = useMemo<Product[]>(() => {
    const map = new Map<string, Product>();
    for (const p of catalogue) map.set(p.slug, p);
    return slugs
      .flatMap((slug) => {
        const p = map.get(slug);
        return p ? [p] : [];
      })
      .slice(0, limit);
  }, [slugs, limit]);

  if (resolved.length === 0) return null;

  return (
    <section className="mx-auto max-w-content px-6 pb-24 md:pb-32 -mt-12">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-soft text-accent-1 ring-1 ring-border">
            <Clock className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tightish text-fg">
            {t('recentHeading')}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => recentStore.clear()}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted hover:text-rose-500 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          {t('recentClear')}
        </button>
      </div>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}
        className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {resolved.map((product) => (
          <motion.div key={product.slug} variants={fadeUp}>
            <ProductCard product={product} strings={strings} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
