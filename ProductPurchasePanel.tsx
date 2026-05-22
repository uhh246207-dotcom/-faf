'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { fadeUp, staggerParent, inViewOnce } from '@/lib/animations';
import type { FaqItem } from '@/content/types';

interface Props {
  data: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: FaqItem[];
  };
}

export function FAQ({ data }: Props) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="text-center mb-12 md:mb-16"
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
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mx-auto max-w-[760px]"
        >
          <div className="rounded-3xl glass-strong shadow-card p-2 md:p-3">
            <Accordion type="single" collapsible className="">
              {data.items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className={
                    i === data.items.length - 1
                      ? 'border-b-0'
                      : undefined
                  }
                >
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
