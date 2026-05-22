'use client';

import { motion } from 'framer-motion';
import { MousePointerClick, CreditCard, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fadeUp, staggerParent, inViewOnce } from '@/lib/animations';
import type { HowStep } from '@/content/types';

interface Props {
  data: {
    eyebrow: string;
    heading: string;
    sub: string;
    steps: HowStep[];
  };
}

/* Pair each step (in order) with a small accent icon. */
const STEP_ICONS: LucideIcon[] = [MousePointerClick, CreditCard, Sparkles];

export function HowItWorks({ data }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="text-center mb-14 md:mb-20"
        >
          <motion.p
            variants={fadeUp}
            className="text-[13px] font-semibold uppercase tracking-eyebrow text-accent-1 mb-4"
          >
            {data.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-bold text-fg tracking-tightish text-[clamp(32px,4vw,56px)] leading-[1.1]"
          >
            {data.heading}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-prose60 mx-auto text-fg-body leading-7"
          >
            {data.sub}
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Animated dotted connector line — desktop only */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={inViewOnce}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="hidden md:block absolute left-[16%] right-[16%] top-12 h-0.5 dotted-connector origin-left"
          />

          <motion.ol
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}
            className="relative grid gap-12 md:gap-8 md:grid-cols-3"
          >
            {data.steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <motion.li
                  key={step.num}
                  variants={fadeUp}
                  className="relative flex flex-col items-center text-center md:px-4"
                >
                  {/* Number badge — gradient fill + glow halo */}
                  <div className="glow-halo relative mb-6 grid h-24 w-24 place-items-center rounded-full bg-accent-grad text-white shadow-[0_18px_44px_-12px_rgba(124,58,237,0.55)] ring-1 ring-white/40">
                    <span className="font-bold text-3xl tracking-tightish drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                      {step.num}
                    </span>

                    {/* Floating accent icon — top-right of the badge */}
                    <span className="absolute -top-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-accent-1 shadow-card border border-border/70">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-fg mb-2">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-[15px] leading-7 text-fg-body">
                    {step.desc}
                  </p>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
