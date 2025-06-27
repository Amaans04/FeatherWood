import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useInView, Variant, Variants } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { fadeIn } from '@/utils/animations';

interface AnimateOnScrollProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  threshold?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export default function AnimateOnScroll({
  children,
  variants = fadeIn,
  className = '',
  threshold = 0.1,
  delay = 0,
  duration = 0.8,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const { enableAnimations } = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Apply custom duration and delay if provided
  const customVariants = {
    ...variants,
    visible: {
      ...(variants.visible as Variant),
      transition: {
        ...(variants.visible as any)?.transition,
        delay: delay,
        duration: duration,
      },
    },
  };

  // Handle animation state
  useEffect(() => {
    if (isInView && once) {
      setHasAnimated(true);
    }
  }, [isInView, once]);

  // Determine if we should render with or without animation
  const shouldRenderWithoutAnimation = !enableAnimations || (hasAnimated && once);

  // Return without animation if needed
  if (shouldRenderWithoutAnimation) {
    return <div className={className}>{children}</div>;
  }

  // Otherwise, return with animation
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
} 