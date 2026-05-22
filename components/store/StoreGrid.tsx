'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import {
  fadeUp,
  staggerParent,
  inViewOnce,
} from '@/lib/animations';
import { cn } from '@/lib/utils';
import type {
  Product,
  ProductCategory,
  SiteContent,
} from '@/content/types';

type SortKey = 'newest' | 'popular' | 'price-asc' | 'price-desc';

type Filter = 'all' | ProductCategory;

interface Props {
  products: Product[];
  strings: SiteContent['store'];
}

export function StoreGrid({ products, strings }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCat = (searchParams?.get('cat') as Filter) || 'all';

  const [filter, setFilter] = useState<Filter>(initialCat);
  const [sort, setSort] = useState<SortKey>('popular');

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: strings.categoryAll },
    { key: 'games', label: strings.categoryGames },
    { key: 'design', label: strings.categoryDesign },
  ];

  const filtered = useMemo(() => {
    const base =
      filter === 'all' ? products : products.filter((p) => p.category === filter);

    const popularRank = (p: Product) =>
      (p.badges.includes('popular') ? 0 : 1) +
      (p.badges.includes('new') ? 0 : 0.1);

    switch (sort) {
      case 'newest':
        return [...base].sort(
          (a, b) =>
            (a.badges.includes('new') ? 0 : 1) -
            (b.badges.includes('new') ? 0 : 1)
        );
      case 'price-asc':
        return [...base].sort((a, b) => a.fromPrice - b.fromPrice);
      case 'price-desc':
        return [...base].sort((a, b) => b.fromPrice - a.fromPrice);
      case 'popular':
      default:
        return [...base].sort((a, b) => popularRank(a) - popularRank(b));
    }
  }, [filter, sort, products]);

  const onTab = (key: Filter) => {
    setFilter(key);
    const params = new URLSearchParams(searchParams?.toString());
    if (key === 'all') params.delete('cat');
    else params.set('cat', key);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-content px-6 pb-24 md:pb-32">
        {/* Filter + sort toolbar */}
        <div className="sticky top-24 z-30 mb-8 -mx-2 px-2 py-3 rounded-2xl glass-strong shadow-card">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div role="tablist" className="flex flex-wrap gap-1.5">
              {tabs.map((t) => {
                const active = filter === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => onTab(t.key)}
                    className={cn(
                      'h-9 px-4 rounded-full text-[14px] font-medium transition-all',
                      active
                        ? 'bg-accent-grad text-white shadow-pill'
                        : 'text-fg hover:bg-white/60'
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 text-[13px] text-fg-body">
              <span className="uppercase tracking-eyebrow text-fg-muted">
                {strings.sortLabel}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 px-3 rounded-full bg-white border border-border text-fg text-[13px] focus:outline-none focus:border-accent-1"
              >
                <option value="popular">{strings.sortPopular}</option>
                <option value="newest">{strings.sortNewest}</option>
                <option value="price-asc">{strings.sortPriceAsc}</option>
                <option value="price-desc">{strings.sortPriceDesc}</option>
              </select>
            </label>
          </div>
        </div>

        <motion.div
          key={`${filter}-${sort}`}
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((product) => (
            <motion.div key={product.slug} variants={fadeUp}>
              <ProductCard product={product} strings={strings} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
