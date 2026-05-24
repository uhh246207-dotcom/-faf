'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import {
  fadeUp,
  staggerParent,
  inViewOnce,
} from '@/lib/animations';
import type { Testimonial, SiteContent } from '@/content/types';
import { cn } from '@/lib/utils';

interface Props {
  data: SiteContent['testimonials'];
}

/** Deterministic colour pick per name so the avatar is stable across
 *  renders and locales. */
const AVATAR_PALETTE = [
  'from-violet-500 to-fuchsia-500',
  'from-rose-500 to-orange-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-pink-500',
];

function colourFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] ?? '').join('').toUpperCase();
}

export function Testimonials({ data }: Props) {
  return (
    <section className="relative isolate">
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="text-center max-w-prose60 mx-auto mb-12 md:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-[13px] font-semibold uppercase tracking-eyebrow text-accent-1"
          >
            {data.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl md:text-4xl font-bold tracking-tightish text-fg leading-tight"
          >
            {data.heading}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-fg-body leading-7"
          >
            {data.sub}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="grid gap-5 md:gap-6 md:grid-cols-3"
        >
          {data.items.map((it) => (
            <motion.article
              key={it.name + it.role}
              variants={fadeUp}
              className="relative flex flex-col rounded-3xl glass-strong p-6 md:p-7 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <Quote
                className="h-6 w-6 text-accent-1/40 mb-3"
                aria-hidden="true"
              />
              <Stars value={it.rating ?? 5} />
              <blockquote className="mt-4 flex-1 text-[15px] leading-7 text-fg-body">
                {it.quote}
              </blockquote>

              <footer className="mt-6 flex items-center gap-3">
                <span
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-full text-white text-[12.5px] font-bold tracking-tight bg-gradient-to-br shadow-pill',
                    colourFor(it.name)
                  )}
                  aria-hidden="true"
                >
                  {initials(it.name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-fg leading-tight truncate">
                    {it.name}
                  </span>
                  <span className="block text-[12.5px] text-fg-muted truncate">
                    {it.role}
                  </span>
                </span>
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex gap-0.5" aria-label={`${clamped} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < clamped ? 'text-amber-400 fill-current' : 'text-fg-muted/40'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
