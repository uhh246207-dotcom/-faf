'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, BadgeCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fadeUp, staggerParent } from '@/lib/animations';

interface Props {
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineGradient: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
    stats: { value: string; label: string }[];
  };
}

const BADGE_ICONS: LucideIcon[] = [BadgeCheck, Zap, Sparkles];

export function Hero({ hero }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Drifting aurora orbs (deepest layer) */}
      <div className="aurora" aria-hidden="true">
        <span className="aurora-blob" />
      </div>

      {/* Pastel mesh background (above aurora, below content) */}
      <div className="hero-mesh" aria-hidden="true">
        <div className="hero-mesh-bottom" />
      </div>

      <div className="mx-auto max-w-content px-6 pt-36 md:pt-44 pb-20 md:pb-28 text-center">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-7 md:gap-9"
        >
          {/* Eyebrow pill — glass with live dot */}
          <motion.div
            variants={fadeUp}
            className="glass inline-flex items-center gap-2 rounded-full px-4 h-9 text-[12.5px] font-medium tracking-eyebrow uppercase text-accent-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent-1 opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-1" />
            </span>
            {hero.eyebrow}
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-bold tracking-tightish text-fg leading-[1.05] text-[clamp(40px,7vw,92px)]"
          >
            <span className="block">{hero.headlineLine1}</span>
            <span className="block text-grad-shimmer">
              {hero.headlineGradient}
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="max-w-prose60 text-[15px] md:text-base leading-7 md:leading-8 text-fg-body"
          >
            {hero.sub}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <Link
              href="/store"
              className="shimmer-btn group inline-flex items-center justify-center gap-2 rounded-full bg-accent-grad text-white h-12 px-6 text-[15px] font-medium shadow-pill hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(124,58,237,0.32)] transition-all duration-200"
            >
              {hero.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/orders"
              className="group inline-flex items-center justify-center gap-2 rounded-full glass-strong text-fg h-12 px-6 text-[15px] font-medium hover:text-accent-1 transition-colors"
            >
              {hero.secondaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Trust badges — glass row */}
          <motion.ul
            variants={fadeUp}
            className="mt-2 flex flex-wrap justify-center gap-2.5"
          >
            {hero.badges.map((label, i) => {
              const Icon = BADGE_ICONS[i % BADGE_ICONS.length];
              return (
                <li
                  key={label}
                  className="glass inline-flex items-center gap-2 rounded-full px-3.5 h-8 text-[13px] font-medium text-fg-body"
                >
                  <Icon className="h-3.5 w-3.5 text-accent-1" aria-hidden="true" />
                  {label}
                </li>
              );
            })}
          </motion.ul>

          {/* Stats strip */}
          <motion.dl
            variants={fadeUp}
            className="mt-6 md:mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl glass-strong shadow-card max-w-md w-full divide-x divide-border/60"
          >
            {hero.stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center px-3 py-4">
                <dt className="text-[11px] uppercase tracking-eyebrow text-fg-muted order-2 mt-1">
                  {s.label}
                </dt>
                <dd className="order-1 text-grad font-bold text-2xl md:text-[28px] tabular-nums tracking-tightish">
                  {s.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
