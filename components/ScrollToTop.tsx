'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ScrollToTop() {
  const [show, setShow] = useState(false);
  const t = useTranslations('Shop');
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="scroll-to-top"
          type="button"
          onClick={onClick}
          aria-label={t('scrollToTop')}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-[55] inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-grad text-white shadow-pill ring-1 ring-white/30 hover:-translate-y-0.5 transition-transform"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
