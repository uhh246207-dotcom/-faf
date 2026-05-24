'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  cartStore,
  hydrateCart,
  useAppliedCoupon,
  useCart,
  useCartCount,
  useCartTotal,
  type CartLine,
} from '@/lib/cart';
import {
  discountFor,
  findCoupon,
  validateCoupon,
} from '@/lib/coupons';
import { uiStore, useUi } from '@/lib/ui-store';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const panel = {
  hidden: { x: '100%' },
  show: { x: 0 },
  exit: { x: '100%' },
};

export function CartDrawer() {
  const { cartOpen } = useUi();
  const t = useTranslations('Shop');
  const lines = useCart();
  const count = useCartCount();
  const subtotal = useCartTotal();
  const couponCode = useAppliedCoupon();
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const discount = discountFor(coupon, subtotal);
  const total = Math.max(0, subtotal - discount);
  const currency = lines[0]?.currency ?? '\u20ab';

  /* Hydrate localStorage on first mount */
  useEffect(() => {
    hydrateCart();
  }, []);

  /* Esc to close + lock body scroll while open */
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') uiStore.closeCart();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [cartOpen]);

  const onCheckout = () => {
    toast.success(t('cartCheckout'), {
      description: t('cartCheckoutHint'),
    });
    uiStore.closeCart();
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <div
          key="cart-drawer"
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={t('cartTitle')}
        >
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.22, ease: 'linear' }}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            onClick={() => uiStore.closeCart()}
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
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-grad text-white shadow-pill">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-fg leading-tight">
                    {t('cartTitle')}
                  </h2>
                  <p className="text-[12px] text-fg-muted leading-tight">
                    {t('items', { count })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => uiStore.closeCart()}
                aria-label={t('closeCart')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-body hover:bg-bg-soft hover:text-fg transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            {/* Body */}
            {lines.length === 0 ? (
              <EmptyState
                title={t('cartEmpty')}
                hint={t('cartEmptyHint')}
                cta={t('cartContinueShopping')}
              />
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {lines.map((line) => (
                    <CartLineRow key={`${line.productSlug}:${line.variantId}`} line={line} t={t} />
                  ))}
                </ul>

                {/* Footer */}
                <footer className="border-t border-border bg-bg-soft/60 px-5 py-4 space-y-4">
                  <CouponInput
                    code={couponCode}
                    subtotal={subtotal}
                    currency={currency}
                  />

                  {/* Order summary */}
                  <dl className="space-y-1.5 text-[13.5px]">
                    <div className="flex items-center justify-between">
                      <dt className="text-fg-muted">{t('cartSubtotal')}</dt>
                      <dd className="text-fg tabular-nums">
                        {currency}
                        {subtotal.toLocaleString('en-US')}
                      </dd>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <dt>
                          {t('couponDiscount')}
                          <span className="ml-1 inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-1.5 h-4 text-[10.5px] font-semibold tracking-tight">
                            {coupon?.code}
                          </span>
                        </dt>
                        <dd className="tabular-nums">
                          {'\u2212 '}
                          {currency}
                          {discount.toLocaleString('en-US')}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-end justify-between pt-1.5">
                      <dt className="text-[12px] uppercase tracking-eyebrow text-fg-muted">
                        {t('cartTotal')}
                      </dt>
                      <dd>
                        <span className="text-2xl font-bold tracking-tightish text-fg tabular-nums">
                          {currency}
                          {total.toLocaleString('en-US')}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => cartStore.clear()}
                      className="inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('cartClear')}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onCheckout}
                    className="shimmer-btn group w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent-grad text-white h-12 px-5 text-[15px] font-medium shadow-pill hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {t('cartCheckout')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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

/* -------------------- Subcomponents -------------------- */

function EmptyState({
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
        <div className="absolute inset-0 -z-10 rounded-full bg-accent-grad blur-2xl opacity-30" />
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-soft text-accent-1 ring-1 ring-border">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
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
        onClick={() => uiStore.closeCart()}
        className="group inline-flex items-center gap-2 rounded-full bg-accent-grad text-white h-11 px-5 text-[14px] font-medium shadow-pill hover:-translate-y-0.5 transition-all"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function CartLineRow({
  line,
  t,
}: {
  line: CartLine;
  /* Pass the translator down rather than re-calling useTranslations
   * for every row — a tiny perf win. */
  t: (key: string) => string;
}) {
  const lineTotal = line.qty * line.price;
  return (
    <li className="flex gap-3 rounded-2xl border border-border bg-white p-3.5 shadow-card">
      <div className="shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-grad text-white">
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-semibold text-fg leading-tight truncate">
          {line.name}
        </p>
        <p className="mt-0.5 text-[12.5px] text-fg-muted truncate">
          {line.variantLabel}
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-border bg-bg-soft">
            <button
              type="button"
              onClick={() =>
                cartStore.setQty(line.productSlug, line.variantId, line.qty - 1)
              }
              aria-label={t('cartRemoveItem')}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-body hover:text-accent-1 transition-colors"
            >
              <Minus className="h-3 w-3" aria-hidden="true" />
            </button>
            <span className="px-1.5 text-[13px] font-semibold tabular-nums min-w-[1.5rem] text-center">
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() =>
                cartStore.setQty(line.productSlug, line.variantId, line.qty + 1)
              }
              aria-label={t('cartQty')}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-body hover:text-accent-1 transition-colors"
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
          <span className="text-[14px] font-semibold text-fg tabular-nums">
            {line.currency}
            {lineTotal.toLocaleString('en-US')}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => cartStore.remove(line.productSlug, line.variantId)}
        aria-label={t('cartRemoveItem')}
        className="shrink-0 -mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-muted hover:bg-bg-soft hover:text-rose-500 transition-colors"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </li>
  );
}


/* ============================================================
   CouponInput — collapsible coupon entry. When no coupon is
   applied, shows a "Coupon code" toggle that expands to a tiny
   form. When a coupon IS applied, shows it as a dismissible chip.
   ============================================================ */
function CouponInput({
  code,
  subtotal,
  currency,
}: {
  code: string | null;
  subtotal: number;
  currency: string;
}) {
  const t = useTranslations('Shop');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  /* When a coupon is already applied, render it as a chip. */
  if (code) {
    const coupon = findCoupon(code);
    return (
      <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
        <span className="flex items-center gap-2 min-w-0">
          <Check
            className="h-4 w-4 text-emerald-600 shrink-0"
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-emerald-700 leading-tight truncate">
              {coupon?.code ?? code}
            </span>
            <span className="block text-[11.5px] text-emerald-700/80 leading-tight">
              {t('couponApplied')}
            </span>
          </span>
        </span>
        <button
          type="button"
          onClick={() => {
            cartStore.setCoupon(null);
            setDraft('');
            setOpen(false);
          }}
          aria-label={t('couponRemove')}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-emerald-700/80 hover:bg-white hover:text-rose-500 transition-colors"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  /* Collapsed trigger. */
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-white/60 px-3 py-2.5 text-[13px] text-fg-body hover:border-accent-1 hover:text-accent-1 transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          {t('couponLabel')}
        </span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    );
  }

  /* Expanded form. */
  const onApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = validateCoupon(draft, subtotal);
    if (!result.ok) {
      if (result.reason === 'unknown') setError(t('couponInvalid'));
      else setError(t('couponMin'));
      return;
    }
    cartStore.setCoupon(result.coupon.code);
    setOpen(false);
    setDraft('');
    toast.success(t('couponApplied'), {
      description:
        result.coupon.kind === 'percent'
          ? `\u2212${result.coupon.value}%`
          : `\u2212 ${currency}${result.coupon.value.toLocaleString('en-US')}`,
    });
  };

  return (
    <form onSubmit={onApply} className="space-y-1.5" noValidate>
      <div
        className={cn(
          'flex items-stretch gap-1 rounded-xl border bg-white px-1 py-1 transition-colors',
          error
            ? 'border-rose-300 ring-2 ring-rose-200'
            : 'border-border focus-within:border-accent-1 focus-within:ring-2 focus-within:ring-accent-1/20'
        )}
      >
        <span className="inline-flex items-center pl-2">
          <Tag className="h-3.5 w-3.5 text-fg-muted" aria-hidden="true" />
        </span>
        <input
          autoFocus
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value.toUpperCase());
            if (error) setError(null);
          }}
          placeholder={t('couponPlaceholder')}
          aria-label={t('couponLabel')}
          aria-invalid={!!error}
          className="flex-1 min-w-0 bg-transparent px-1.5 h-8 text-[13.5px] uppercase tracking-wide text-fg placeholder:text-fg-muted outline-none"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="shrink-0 inline-flex items-center justify-center rounded-lg bg-accent-grad text-white h-8 px-3 text-[12.5px] font-semibold shadow-pill disabled:opacity-50 disabled:hover:translate-y-0 hover:-translate-y-0.5 transition-transform"
        >
          {t('couponApply')}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setDraft('');
            setError(null);
          }}
          aria-label={t('close')}
          className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-soft hover:text-fg transition-colors"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p role="alert" className="text-[12px] text-rose-600">
          {error}
        </p>
      )}
    </form>
  );
}
