'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp, staggerParent, inViewOnce } from '@/lib/animations';

interface Props {
  data: { heading: string; sub: string; cta: string };
}

/* Sparkle positions across the banner — fixed pseudo-random spread.
   Each renders with a slightly different size + animation delay to
   avoid synchronized twinkling. */
const SPARKLES = [
  { top: '12%', left: '8%', size: 14, delay: 0 },
  { top: '20%', left: '88%', size: 18, delay: 0.7 },
  { top: '70%', left: '6%', size: 16, delay: 1.4 },
  { top: '78%', left: '92%', size: 12, delay: 0.3 },
  { top: '38%', left: '78%', size: 10, delay: 2.1 },
  { top: '60%', left: '14%', size: 12, delay: 1.0 },
  { top: '32%', left: '20%', size: 10, delay: 1.6 },
  { top: '48%', left: '60%', size: 14, delay: 2.4 },
];

export function CTABanner({ data }: Props) {
  return (
    <section className="px-6 pb-24 md:pb-32">
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}
        className="noise relative isolate overflow-hidden mx-auto max-w-content rounded-3xl bg-accent-grad text-white px-6 py-16 md:px-16 md:py-24 text-center shadow-pill ring-1 ring-white/15"
      >
        {/* Animated radial mesh — drifting orbs in white tones */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl animate-[aurora-float_18s_ease-in-out_infinite]" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-[aurora-float_22s_ease-in-out_infinite_-7s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[140%] w-[60%] rounded-[60%] bg-white/5 blur-3xl" />
        </div>

        {/* Twinkling sparkles */}
        {SPARKLES.map((s, i) => (
          <Sparkles
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute text-white/85 animate-twinkle"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        <motion.h2
          variants={fadeUp}
          className="font-bold tracking-tightish text-[clamp(28px,4vw,48px)] leading-[1.15]"
        >
          {data.heading}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-white/85 text-base md:text-lg max-w-prose60 mx-auto leading-7 md:leading-8"
        >
          {data.sub}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-9">
          <a
            href="/store"
            className="shimmer-btn group inline-flex items-center justify-center gap-2 rounded-full bg-white text-accent-1 h-12 px-6 text-[15px] font-semibold hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(0,0,0,0.22)] transition-all duration-200"
          >
            {data.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
