'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Gamepad2, Palette } from 'lucide-react';
import {
  fadeUp,
  staggerParent,
} from '@/lib/animations';
import type { SiteContent } from '@/content/types';

interface Props {
  data: SiteContent['store'];
  /** Total counts shown on the banner chips */
  gamesCount: number;
  designCount: number;
}

export function StoreBanner({ data, gamesCount, designCount }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-mesh" aria-hidden="true">
        <div className="hero-mesh-bottom" />
      </div>

      <div className="mx-auto max-w-content px-6 pt-36 md:pt-44 pb-12 md:pb-16">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center gap-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-[13px] font-semibold uppercase tracking-eyebrow text-accent-1"
          >
            {data.bannerEyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-bold tracking-tightish text-fg leading-[1.05] text-[clamp(36px,6vw,76px)]"
          >
            {data.bannerHeading}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-prose60 text-[15px] md:text-base leading-7 md:leading-8 text-fg-body"
          >
            {data.bannerSub}
          </motion.p>

          {/* Quick category chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mt-2">
            <Link
              href="/store?cat=games"
              className="group glass inline-flex items-center gap-2 rounded-full px-5 h-11 text-[14px] font-medium text-fg hover:text-accent-1 transition-colors"
            >
              <Gamepad2 className="h-4 w-4 text-accent-1" aria-hidden="true" />
              {data.categoryGames}
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-accent-grad text-white text-[11px] font-semibold">
                {gamesCount}
              </span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/store?cat=design"
              className="group glass inline-flex items-center gap-2 rounded-full px-5 h-11 text-[14px] font-medium text-fg hover:text-accent-1 transition-colors"
            >
              <Palette className="h-4 w-4 text-accent-1" aria-hidden="true" />
              {data.categoryDesign}
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-accent-grad text-white text-[11px] font-semibold">
                {designCount}
              </span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
