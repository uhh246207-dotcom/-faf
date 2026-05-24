'use client';

import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { hydrateWishlist, useWishlistCount } from '@/lib/wishlist';
import { uiStore } from '@/lib/ui-store';
import { cn } from '@/lib/utils';

interface Props {
  /** Compact = icon only (navbar pill). Non-compact = label + icon. */
  compact?: boolean;
}

export function WishlistButton({ compact = true }: Props) {
  const count = useWishlistCount();
  const t = useTranslations('Shop');

  useEffect(() => {
    hydrateWishlist();
  }, []);

  return (
    <button
      type="button"
      onClick={() => uiStore.openWishlist()}
      aria-label={t('openWishlist')}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-full text-fg hover:text-rose-500 transition-colors',
        compact
          ? 'h-9 w-9 justify-center hover:bg-white/40'
          : 'h-9 px-3 hover:bg-white/40 text-[13px] font-medium'
      )}
    >
      <Heart className="h-4 w-4" aria-hidden="true" />
      {!compact && <span>{t('wishlist')}</span>}

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
            className={cn(
              'absolute inline-flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold tabular-nums leading-none ring-2 ring-white shadow-pill',
              compact
                ? '-top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1'
                : '-top-1 right-1 min-w-[16px] h-[16px] px-1'
            )}
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
