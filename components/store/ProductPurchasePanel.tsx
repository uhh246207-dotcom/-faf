'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { SaveButton } from '@/components/store/SaveButton';
import { cn } from '@/lib/utils';
import type { Product, SiteContent } from '@/content/types';

interface Props {
  product: Product;
  strings: SiteContent['store'];
}

export function ProductPurchasePanel({ product, strings }: Props) {
  const t = useTranslations('Shop');
  const [selectedId, setSelectedId] = useState<string>(
    product.variants[0]?.id ?? ''
  );

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  const cartLine = {
    productSlug: product.slug,
    variantId: selected.id,
    name: product.name,
    variantLabel: selected.label,
    price: selected.price,
    currency: product.currency,
    category: product.category,
    brand: product.brand,
    service: product.service,
  };

  return (
    <div>
      {/* Variants */}
      <fieldset>
        <legend className="text-[12px] font-semibold uppercase tracking-eyebrow text-fg-muted mb-3">
          {strings.pickPackage}
        </legend>
        <div className="grid gap-2">
          {product.variants.map((v) => {
            const active = v.id === selectedId;
            const onSale =
              v.originalPrice && v.originalPrice > v.price
                ? Math.round((1 - v.price / v.originalPrice) * 100)
                : null;
            return (
              <label
                key={v.id}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl border bg-white p-3.5 cursor-pointer transition-all',
                  active
                    ? 'border-accent-1 ring-2 ring-accent-1/20 shadow-pill'
                    : 'border-border hover:border-fg-muted'
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="variant"
                    value={v.id}
                    checked={active}
                    onChange={() => setSelectedId(v.id)}
                    className="h-4 w-4 accent-[#7C3AED]"
                  />
                  <span className="text-[14.5px] font-medium text-fg">
                    {v.label}
                  </span>
                  {onSale !== null && (
                    <span className="inline-flex items-center rounded-full bg-pink-50 text-pink-700 border border-pink-200 px-2 h-5 text-[10.5px] font-semibold tracking-tight">
                      −{onSale}%
                    </span>
                  )}
                </span>
                <span className="text-right">
                  {v.originalPrice && v.originalPrice > v.price && (
                    <span className="text-[12px] text-fg-muted line-through mr-2">
                      {product.currency}
                      {v.originalPrice.toLocaleString('en-US')}
                    </span>
                  )}
                  <span className="text-[14.5px] font-semibold text-fg">
                    {product.currency}
                    {v.price.toLocaleString('en-US')}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Summary */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-eyebrow text-fg-muted">
            {strings.total}
          </p>
          <p className="text-3xl font-bold tracking-tightish text-fg mt-0.5 tabular-nums">
            {product.currency}
            {selected.price.toLocaleString('en-US')}
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        {/* Primary — "Buy now" adds the line and opens the cart drawer */}
        <AddToCartButton
          line={cartLine}
          openOnAdd
          label={strings.primaryCta}
          variant="primary"
          className="flex-1 min-w-[160px]"
        />

        {/* Secondary — quiet add-to-cart, stays on the page */}
        <AddToCartButton
          line={cartLine}
          openOnAdd={false}
          label={t('addToCart')}
          variant="secondary"
          className="flex-1 min-w-[140px]"
        />

        {/* Save / wishlist — heart toggle */}
        <SaveButton
          slug={product.slug}
          variant="button"
          stopPropagation={false}
          className="sm:flex-none"
        />
      </div>

      {/* Reassurance */}
      <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted">
        <ShoppingBag className="h-3.5 w-3.5 text-accent-1" aria-hidden="true" />
        {strings.trustGameDelivery}
      </p>
    </div>
  );
}
