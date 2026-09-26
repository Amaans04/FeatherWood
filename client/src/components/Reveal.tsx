import { ReactNode, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { revealVariants, RevealVariant, staggerItem } from '@/utils/animations';

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  /** How much of element must be visible (0–1) */
  amount?: number;
  as?: 'div' | 'section' | 'article' | 'li';
}

export default function Reveal({
  children,
  variant = 'fadeUp',
  className = '',
  delay = 0,
  duration,
  once = true,
  amount = 0.1,
  as = 'div',
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount,
    margin: '0px 0px -8% 0px',
  });
  const { enableAnimations } = useAnimation();

  const base = revealVariants[variant];
  const variants: Variants = {
    hidden: base.hidden,
    visible: {
      ...(base.visible as object),
      transition: {
        ...(typeof base.visible === 'object' && 'transition' in base.visible
          ? (base.visible as { transition?: object }).transition
          : {}),
        delay,
        ...(duration ? { duration } : {}),
      },
    },
  };

  const Component = motion[as];

  if (!enableAnimations) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </Component>
  );
}

interface RevealStaggerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  as?: 'div' | 'ul' | 'section';
}

export function RevealStagger({
  children,
  className = '',
  once = true,
  as = 'div',
}: RevealStaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.08, margin: '0px 0px -30px 0px' });
  const { enableAnimations } = useAnimation();
  const Component = motion[as];

  if (!enableAnimations) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.06 },
        },
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { enableAnimations } = useAnimation();

  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
