import { useScroll, useSpring, motion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 22,
    mass: 0.6,
    restDelta: 0.0005,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B7355] to-transparent origin-left z-[60] pointer-events-none opacity-90"
      style={{ scaleX }}
    />
  );
}
