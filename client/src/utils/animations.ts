import { Variants } from 'framer-motion';

// Elegant fade-in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0] // Elegant easing curve
    } 
  }
};

// Luxury slide-in from left
export const slideInLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0],
      delay: 0.1
    } 
  }
};

// Luxury slide-in from right
export const slideInRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0],
      delay: 0.1
    } 
  }
};

// Elegant slide-in from bottom
export const slideInUp: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0],
    } 
  }
};

// Royal fade-in with scale
export const royalFade: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Spring-like elegant motion
    } 
  }
};

// Staggered children animation with elegant timing
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

// Shimmer effect for gold elements
export const goldShimmer: Variants = {
  hidden: { opacity: 0, backgroundPosition: '0% 0%' },
  visible: { 
    opacity: 1,
    backgroundPosition: '100% 100%',
    transition: { 
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    } 
  }
};

// Subtle hover animation for interactive elements
export const luxuryHover = {
  scale: 1.03,
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
};

// Page transition animation
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
      when: "beforeChildren",
      staggerChildren: 0.15,
    } 
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0],
    } 
  }
}; 