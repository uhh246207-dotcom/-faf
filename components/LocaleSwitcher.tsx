'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname, routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const LANG_LABELS: Record<(typeof routing.locales)[number], { native: string; short: string }> = {
  zh: { native: '中文', short: 'ZH' },
  en: { native: 'English', short: 'EN' },
  vi: { native: 'Tiếng Việt', short: 'VI' },
};

interface Props {
  /** Render only the icon trigger (used inside the navbar pill). */
  compact?: boolean;
}

export function LocaleSwitcher({ compact = true }: Props) {
  const locale = useLocale() as (typeof routing.locales)[number];
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Shop');

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click + Escape */
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onSelect = (next: (typeof routing.locales)[number]) => {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  const current = LANG_LABELS[locale];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t('language')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full text-fg hover:text-accent-1 transition-colors',
          compact
            ? 'h-9 w-9 justify-center hover:bg-white/40'
            : 'h-9 px-3 hover:bg-white/40 text-[13px] font-medium'
        )}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        {!compact && (
          <span className="text-[13px] font-semibold tracking-wide">
            {current.short}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] min-w-[180px] rounded-2xl glass-strong shadow-card-hover p-1.5 z-50"
          >
            <p className="px-3 pt-1.5 pb-1 text-[11px] uppercase tracking-eyebrow text-fg-muted">
              {t('language')}
            </p>
            {routing.locales.map((l) => {
              const meta = LANG_LABELS[l];
              const active = l === locale;
              return (
                <button
                  key={l}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => onSelect(l)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[14px] transition-colors',
                    active
                      ? 'bg-white shadow-card text-fg'
                      : 'text-fg-body hover:bg-white/60 hover:text-fg'
                  )}
                >
                  <span className="flex flex-col">
                    <span className="font-semibold leading-tight">
                      {meta.native}
                    </span>
                    <span className="text-[11px] text-fg-muted tracking-wide">
                      {meta.short}
                    </span>
                  </span>
                  {active && (
                    <Check
                      className="h-4 w-4 text-accent-1"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
