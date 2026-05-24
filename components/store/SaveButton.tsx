'use client';

import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { hydrateWishlist, useIsSaved, wishlistStore } from '@/lib/wishlist';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface Props {
  slug: string;
  /** When the parent is itself a Link, set this to stop the click
   *  bubbling up so we don't navigate to the product page. */
  stopPropagation?: boolean;
  /** "icon" → small heart pill (used on cards / nav).
   *  "button" → wider button with label (used on detail page). */
  variant?: 'icon' | 'button';
  className?: string;
}

export function SaveButton({
  slug,
  stopPropagation = true,
  variant = 'icon',
  className,
}: Props) {
  const t = useTranslations('Shop');
  const saved = useIsSaved(slug);

  /* Make sure localStorage has been read at least once. */
  useEffect(() => {
    hydrateWishlist();
  }, []);

  const onClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = wishlistStore.toggle(slug);
    if (next) {
      toast.success(t('wishlistAdded'));
    } else {
      toast.show(t('wishlistRemoved'));
    }
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? t('removeFromWishlist') : t('save')}
        className={cn(
          'group inline-flex items-center justify-center gap-2 rounded-full h-12 px-4 text-[15px] font-medium border transition-all duration-200',
          saved
            ? 'bg-rose-50 border-rose-200 text-rose-600 hover:-translate-y-0.5'
            : 'bg-white border-border text-fg hover:border-rose-300 hover:text-rose-500',
          className
        )}
      >
        <motion.span
          aria-hidden="true"
          animate={saved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <Heart
            className={cn('h-4 w-4', saved && 'fill-current')}
            aria-hidden="true"
          />
        </motion.span>
        {saved ? t('saved') : t('save')}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? t('removeFromWishlist') : t('save')}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all',
        saved
          ? 'bg-rose-500 text-white shadow-pill ring-1 ring-white/30'
          : 'bg-white/85 text-fg hover:bg-white hover:text-rose-500 ring-1 ring-black/5',
        className
      )}
    >
      <motion.span
        aria-hidden="true"
        animate={saved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <Heart
          className={cn('h-4 w-4', saved && 'fill-current')}
          aria-hidden="true"
        />
      </motion.span>
    </button>
  );
}
