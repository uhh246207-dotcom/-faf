'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerParent, inViewOnce } from '@/lib/animations';
import { ProductCard } from '@/components/store/ProductCard';
import type { Product, SiteContent } from '@/content/types';

interface Props {
  data: { eyebrow: string; heading: string; sub: string; seeAll: string };
  products: Product[];
  storeStrings: SiteContent['store'];
}

export function FeaturedProducts({ data, products, storeStrings }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle ambient aurora behind the grid */}
      <div className="aurora opacity-40" aria-hidden="true">
        <span className="aurora-blob" />
      </div>

      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
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
            className="mt-5 max-w-prose60 text-fg-body leading-7"
          >
            {data.sub}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div key={product.slug} variants={fadeUp}>
              <ProductCard product={product} strings={storeStrings} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mt-12 text-center"
        >
          <Link
            href="/store"
            className="shimmer-btn group inline-flex items-center gap-2 rounded-full bg-fg text-white h-12 px-6 text-[15px] font-medium hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(0,0,0,0.18)] transition-all duration-200"
          >
            {data.seeAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
