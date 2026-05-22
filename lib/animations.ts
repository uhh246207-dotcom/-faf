import type { Variants, Transition } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const; // expo-out-ish

export const easeOut: Transition = { duration: 0.6, ease };

/** Fade + lift used on most section content */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

/** Container that staggers its children (use with `whileInView` once) */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Mask reveal — useful for hero headlines split into spans */
export const maskReveal: Variants = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: 0.9, ease },
  },
};

/** Used by the Navbar pill on first paint */
export const navSpringIn: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 24, mass: 0.8 },
  },
};

/** Card hover used in feature/service cards */
export const cardHover: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};

/** Standard viewport options for whileInView */
export const inViewOnce = { once: true, margin: '0px 0px -10% 0px' } as const;
