'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cartStore, type CartLine } from '@/lib/cart';
import { uiStore } from '@/lib/ui-store';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface Props {
  line: Omit<CartLine, 'qty'>;
  /** Quantity to add per click. Default: 1. */
  qty?: number;
  /** Override the visible label. Defaults to t('addToCart'). */
  label?: string;
  /** Open the cart drawer after adding. Default: false. */
  openOnAdd?: boolean;
  /** Visual variant. */
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function AddToCartButton({
  line,
  qty = 1,
  label,
  openOnAdd = false,
  variant = 'primary',
  className,
}: Props) {
  const t = useTranslations('Shop');

  const onClick = () => {
    cartStore.add(line, qty);
    toast.success(t('addedToCart'), {
      description: `${line.name} · ${line.variantLabel}`,
    });
    if (openOnAdd) uiStore.openCart();
  };

  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full h-12 px-5 text-[15px] font-medium transition-all duration-200';

  const styles =
    variant === 'primary'
      ? 'bg-accent-grad text-white shadow-pill hover:-translate-y-0.5'
      : 'bg-white border border-border text-fg hover:border-accent-1 hover:text-accent-1';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, styles, className)}
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      {label ?? t('addToCart')}
    </button>
  );
}
