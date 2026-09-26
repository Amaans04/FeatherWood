import { Variants } from 'framer-motion';

/** Premium easing — slow, elegant deceleration */
export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: LUXURY_EASE },
  },
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: LUXURY_EASE },
  },
};

/** Smaller travel distance — better on mobile */
export const revealUpMobile: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: LUXURY_EASE },
  },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: LUXURY_EASE },
  },
};

export const revealBlur: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: LUXURY_EASE },
  },
};

export const slideInLeft: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.85, ease: LUXURY_EASE },
  },
};

export const slideInRight: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.85, ease: LUXURY_EASE },
  },
};

export const slideInUp: Variants = revealUp;

export const royalFade: Variants = revealScale;

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: LUXURY_EASE },
  },
};

export const goldShimmer: Variants = {
  hidden: { opacity: 0, backgroundPosition: '0% 0%' },
  visible: {
    opacity: 1,
    backgroundPosition: '100% 100%',
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

export const luxuryHover = {
  scale: 1.02,
  transition: { duration: 0.4, ease: LUXURY_EASE },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: LUXURY_EASE },
  },
};

export type RevealVariant =
  | 'fadeUp'
  | 'fadeIn'
  | 'scaleIn'
  | 'slideLeft'
  | 'slideRight'
  | 'blurIn';

export const revealVariants: Record<RevealVariant, Variants> = {
  fadeUp: revealUpMobile,
  fadeIn,
  scaleIn: revealScale,
  slideLeft: slideInLeft,
  slideRight: slideInRight,
  blurIn: revealBlur,
};
