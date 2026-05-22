'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Home, Store, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { XfeinMark } from '@/components/brand-logos';
import { CartButton } from '@/components/cart/CartButton';
import { SearchButton } from '@/components/search/SearchButton';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { uiStore } from '@/lib/ui-store';
import { navSpringIn } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface Props {
  brand: string;
  nav: { home: string; store: string };
  /** "/" for the home link respecting the current locale prefix */
  homeHref?: string;
  storeHref?: string;
}

export function Navbar({
  brand,
  nav,
  homeHref = '/',
  storeHref = '/store',
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isStore = pathname?.includes('/store');
  const t = useTranslations('Shop');

  /* Smooth scroll-progress indicator anchored to the very top */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 22,
    mass: 0.4,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Page-level scroll progress bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-accent-grad"
      />

      <header className="fixed inset-x-0 top-4 md:top-5 z-50 flex justify-center px-4 pointer-events-none">
        {/* ============================================================
            DESKTOP — single floating glass pill with brand + nav +
            search + locale + cart
           ============================================================ */}
        <motion.nav
          variants={navSpringIn}
          initial="hidden"
          animate="show"
          aria-label="Primary"
          className={cn(
            'pointer-events-auto hidden md:flex items-center gap-1.5 rounded-full p-1.5 transition-all duration-300',
            scrolled
              ? 'glass-strong shadow-card-hover scale-[0.97]'
              : 'glass shadow-card'
          )}
        >
          <Link
            href={homeHref}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/40 transition-colors"
            aria-label={`${brand} home`}
          >
            <XfeinMark className="h-6 w-6" />
            <span className="text-[15px] font-bold tracking-tightish text-fg">
              {brand}
            </span>
          </Link>

          <Link
            href={homeHref}
            className={cn(
              'flex items-center gap-1.5 rounded-full text-[14px] font-medium px-4 h-9 transition-all',
              !isStore
                ? 'bg-accent-grad text-white shadow-pill'
                : 'text-fg hover:bg-white/40'
            )}
            aria-current={!isStore ? 'page' : undefined}
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            {nav.home}
          </Link>

          <Link
            href={storeHref}
            className={cn(
              'flex items-center gap-1.5 rounded-full text-[14px] font-medium px-4 h-9 transition-all',
              isStore
                ? 'bg-accent-grad text-white shadow-pill'
                : 'text-fg hover:bg-white/40'
            )}
            aria-current={isStore ? 'page' : undefined}
          >
            <Store className="h-4 w-4" aria-hidden="true" />
            {nav.store}
          </Link>

          {/* Divider */}
          <span
            aria-hidden="true"
            className="mx-0.5 h-6 w-px bg-border/70"
          />

          {/* Right cluster: search · locale · cart */}
          <div className="flex items-center gap-0.5">
            <SearchButton compact />
            <LocaleSwitcher compact />
            <CartButton compact />
          </div>
        </motion.nav>

        {/* ============================================================
            MOBILE — compact pill with brand + search + cart + menu
           ============================================================ */}
        <motion.nav
          variants={navSpringIn}
          initial="hidden"
          animate="show"
          aria-label="Primary"
          className={cn(
            'pointer-events-auto md:hidden flex items-center gap-1 rounded-full p-1.5 w-full max-w-md transition-all duration-300',
            scrolled
              ? 'glass-strong shadow-card-hover'
              : 'glass shadow-card'
          )}
        >
          <Link
            href={homeHref}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/40 transition-colors flex-1"
            aria-label={`${brand} home`}
          >
            <XfeinMark className="h-6 w-6 shrink-0" />
            <span className="text-[15px] font-bold tracking-tightish text-fg truncate">
              {brand}
            </span>
          </Link>

          <SearchButton compact />
          <CartButton compact />

          <button
            type="button"
            onClick={() => uiStore.openMenu()}
            aria-label={t('menuOpen')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg hover:bg-white/40 hover:text-accent-1 transition-colors"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.nav>
      </header>
    </>
  );
}
