'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Headphones } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  fadeUp,
  staggerParent,
  inViewOnce,
} from '@/lib/animations';
import type { CommitmentItem, IconKey } from '@/content/types';

interface Props {
  data: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: CommitmentItem[];
  };
}

const ICONS: Record<IconKey, LucideIcon> = {
  'shield-check': ShieldCheck,
  activity: Activity,
  headphones: Headphones,
};

export function ServiceCommitment({ data }: Props) {
  return (
    <section className="relative bg-bg-soft/60 overflow-hidden">
      {/* Subtle ambient aurora behind the cards */}
      <div className="aurora opacity-50" aria-hidden="true">
        <span className="aurora-blob" />
      </div>

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

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="grid gap-5 md:gap-6 md:grid-cols-3"
        >
          {data.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="gradient-ring group relative rounded-2xl bg-white border border-border p-7 md:p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                {/* Icon — gradient bg + soft glow ring */}
                <div className="relative mb-6 inline-flex">
                  <div className="absolute inset-0 -z-10 rounded-xl bg-accent-grad blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-accent-grad text-white shadow-[0_10px_28px_-10px_rgba(124,58,237,0.55)] ring-1 ring-white/30">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-fg mb-2 tracking-tightish">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-7 text-fg-body">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
