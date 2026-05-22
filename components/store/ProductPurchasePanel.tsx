'use client';

import { useState } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/content/types';

interface Props {
  product: Product;
  primaryCta: string;
  detailsCta: string;
}

export function ProductPurchasePanel({
  product,
  primaryCta,
  detailsCta,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>(
    product.variants[0]?.id ?? ''
  );

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  return (
    <div>
      {/* Variants */}
      <fieldset>
        <legend className="text-[12px] font-semibold uppercase tracking-eyebrow text-fg-muted mb-3">
          Pick a package
        </legend>
        <div className="grid gap-2">
          {product.variants.map((v) => {
            const active = v.id === selectedId;
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
            Total
          </p>
          <p className="text-3xl font-bold tracking-tightish text-fg mt-0.5">
            {product.currency}
            {selected.price.toLocaleString('en-US')}
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-grad text-white h-12 px-5 text-[15px] font-medium shadow-pill hover:-translate-y-0.5 transition-all duration-200"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          {primaryCta}
        </button>
        <button
          type="button"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-white border border-border text-fg h-12 px-5 text-[15px] font-medium hover:border-accent-1 hover:text-accent-1 transition-colors"
        >
          {detailsCta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
