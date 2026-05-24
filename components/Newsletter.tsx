'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from '@/lib/toast';
import { fadeUp, staggerParent } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { NewsletterContent } from '@/content/types';

interface Props {
  data: NewsletterContent;
}

const STORAGE_KEY = 'xfein:newsletter:subscribed';
/** Pragmatic email pattern — matches the vast majority of valid
 *  addresses without trying to be RFC-perfect. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter({ data }: Props) {
  const t = useTranslations('Shop');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!EMAIL_RE.test(email.trim())) {
      setError(data.invalid);
      return;
    }

    /* If the user already subscribed in this browser, surface a
     * gentler message. The endpoint would also be idempotent, but
     * client feedback is nicer with this hint. */
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem(STORAGE_KEY) === email.trim().toLowerCase()
    ) {
      toast.show(t('newsletterAlready'));
      return;
    }

    /* In production this would POST to a /api/subscribe endpoint.
     * Keeping it client-side for the demo so the UI is fully
     * functional without a backend. */
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
    }

    setError(null);
    setSubmitted(true);
    toast.success(data.successTitle, { description: data.successDesc });
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-[28px] glass-strong shadow-card-hover px-6 md:px-12 py-12 md:py-16 relative overflow-hidden"
        >
          {/* Decorative orbs */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent-grad blur-3xl opacity-25"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <motion.p
                variants={fadeUp}
                className="text-[13px] font-semibold uppercase tracking-eyebrow text-accent-1 mb-3"
              >
                {data.eyebrow}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold tracking-tightish text-fg leading-tight"
              >
                {data.heading}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 text-fg-body leading-7 max-w-prose60"
              >
                {data.sub}
              </motion.p>
            </div>

            <motion.form
              variants={fadeUp}
              onSubmit={onSubmit}
              noValidate
              className="space-y-3"
            >
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full bg-white border px-2 py-1 transition-colors',
                  error
                    ? 'border-rose-300 ring-2 ring-rose-200'
                    : submitted
                      ? 'border-emerald-300 ring-2 ring-emerald-200'
                      : 'border-border focus-within:border-accent-1 focus-within:ring-2 focus-within:ring-accent-1/20'
                )}
              >
                <span className="pl-2.5">
                  {submitted ? (
                    <CheckCircle2
                      className="h-4 w-4 text-emerald-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <Mail
                      className="h-4 w-4 text-fg-muted"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  disabled={submitted}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={data.placeholder}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  className="flex-1 bg-transparent px-1 h-11 text-[15px] text-fg placeholder:text-fg-muted outline-none disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={submitted}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-accent-grad text-white h-11 px-5 text-[14px] font-medium shadow-pill hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {submitted ? data.successTitle : data.cta}
                  {!submitted && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </div>

              {error && (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="text-[12.5px] text-rose-600"
                >
                  {error}
                </p>
              )}
              {!error && (
                <p className="text-[12px] text-fg-muted">{data.privacy}</p>
              )}
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
