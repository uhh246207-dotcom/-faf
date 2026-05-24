'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toastStore, useToasts, type ToastVariant } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const VARIANT_ICON: Record<ToastVariant, LucideIcon> = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
};

const VARIANT_ICON_CLASS: Record<ToastVariant, string> = {
  default: 'text-accent-1',
  success: 'text-emerald-500',
  error: 'text-rose-500',
};

export function Toaster() {
  const toasts = useToasts();
  const t = useTranslations('Shop');

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed top-4 right-4 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
    >
      <AnimatePresence initial={false}>
        {toasts.map((tt) => {
          const Icon = VARIANT_ICON[tt.variant];
          return (
            <motion.div
              key={tt.id}
              role="status"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto glass-strong shadow-card-hover rounded-2xl px-4 py-3 flex items-start gap-3"
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 mt-0.5',
                  VARIANT_ICON_CLASS[tt.variant]
                )}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-fg leading-tight">
                  {tt.message}
                </p>
                {tt.description && (
                  <p className="mt-0.5 text-[13px] text-fg-body leading-snug">
                    {tt.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => toastStore.dismiss(tt.id)}
                aria-label={t('close')}
                className="shrink-0 -mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-muted hover:bg-white/60 hover:text-fg transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
