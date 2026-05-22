'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'group relative border-b border-border/80 transition-colors',
      'data-[state=open]:bg-white/40',
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

/* ============================================================
   Custom plus / minus icon — animated cross that morphs into a
   horizontal line when the accordion is open.
   ============================================================ */
function PlusMinusIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] text-fg-muted transition-all duration-300 group-hover:text-accent-1 group-data-[state=open]:bg-accent-grad group-data-[state=open]:text-white group-data-[state=open]:shadow-pill"
    >
      {/* Horizontal bar — always visible */}
      <span className="absolute h-[2px] w-3 rounded-full bg-current" />
      {/* Vertical bar — collapses to 0 when open */}
      <span className="absolute h-3 w-[2px] rounded-full bg-current transition-transform duration-300 group-data-[state=open]:scale-y-0" />
    </span>
  );
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between gap-4 px-4 py-5 text-left text-base md:text-[17px] font-medium text-fg transition-colors hover:text-accent-1 rounded-2xl',
        className
      )}
      {...props}
    >
      <span className="leading-snug">{children}</span>
      <PlusMinusIcon />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-[15px] leading-7 text-fg-body',
      'data-[state=closed]:animate-[acc-up_0.28s_ease-out]',
      'data-[state=open]:animate-[acc-down_0.28s_ease-out]'
    )}
    {...props}
  >
    <div className={cn('px-4 pb-5 pr-12', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
