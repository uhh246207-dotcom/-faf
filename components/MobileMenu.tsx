'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Store,
  Search,
  Heart,
  X,
  ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { uiStore, useUi } from '@/lib/ui-store';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { XfeinMark } from '@/components/brand-logos';
import { cn } from '@/lib/utils';

interface Props {
  brand: string;
  nav: { home: string; store: string };
}

export function MobileMenu({ brand, nav }: Props) {
  const { menuOpen } = useUi();
  const pathname = usePathname();
  const t = useTranslations('Shop');

  /* Esc to close + lock body scroll while open */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') uiStore.closeMenu();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  /* Close menu on route change */
  useEffect(() => {
    uiStore.closeMenu();
    // intentionally only on pathname change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isStore = pathname?.includes('/store');

  return (
    <AnimatePresence>
      {menuOpen && (
        <div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={brand}
          className="fixed inset-0 z-[70] md:hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'linear' }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => uiStore.closeMenu()}
          />

          <motion.aside
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 inset-x-0 bg-white shadow-card-hover rounded-b-3xl flex flex-col"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-border">
              <Link
                href="/"
                onClick={() => uiStore.closeMenu()}
                className="flex items-center gap-2"
                aria-label={`${brand} home`}
              >
                <XfeinMark className="h-7 w-7" />
                <span className="text-base font-bold text-fg tracking-tightish">
                  {brand}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => uiStore.closeMenu()}
                aria-label={t('menuClose')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-body hover:bg-bg-soft hover:text-fg transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <nav
              aria-label="Mobile primary"
              className="flex flex-col gap-1.5 px-3 py-4"
            >
              <MobileLink
                href="/"
                icon={Home}
                label={nav.home}
                active={!isStore}
              />
              <MobileLink
                href="/store"
                icon={Store}
                label={nav.store}
                active={!!isStore}
              />

              <button
                type="button"
                onClick={() => {
                  uiStore.closeMenu();
                  uiStore.openSearch();
                }}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-fg-body hover:bg-bg-soft hover:text-fg transition-colors"
              >
                <Search className="h-5 w-5 text-accent-1" aria-hidden="true" />
                <span className="flex-1 text-left text-[15px] font-medium">
                  {t('search')}
                </span>
                <kbd className="rounded-full bg-bg-soft border border-border/70 px-2 h-6 inline-flex items-center text-[10.5px] font-semibold text-fg-muted">
                  {t('searchKbdHint')}
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => {
                  uiStore.closeMenu();
                  uiStore.openWishlist();
                }}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-fg-body hover:bg-bg-soft hover:text-fg transition-colors"
              >
                <Heart className="h-5 w-5 text-rose-500" aria-hidden="true" />
                <span className="flex-1 text-left text-[15px] font-medium">
                  {t('wishlist')}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-fg-muted"
                  aria-hidden="true"
                />
              </button>
            </nav>

            <div className="border-t border-border px-5 py-4 flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-eyebrow text-fg-muted">
                {t('language')}
              </span>
              <LocaleSwitcher compact={false} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function MobileLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: typeof Home;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={() => uiStore.closeMenu()}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors',
        active
          ? 'bg-accent-grad text-white shadow-pill'
          : 'text-fg-body hover:bg-bg-soft hover:text-fg'
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5',
          active ? 'text-white' : 'text-accent-1'
        )}
        aria-hidden="true"
      />
      <span className="flex-1 text-[15px] font-semibold">{label}</span>
      <ArrowRight
        className={cn(
          'h-4 w-4 transition-transform',
          active ? 'text-white/80 translate-x-0' : 'text-fg-muted group-hover:translate-x-0.5'
        )}
        aria-hidden="true"
      />
    </Link>
  );
}
