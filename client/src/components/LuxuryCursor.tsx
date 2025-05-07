import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';

export default function LuxuryCursor() {
  const { enableAnimations, prefersReducedMotion } = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Don't show cursor effect on mobile devices
  const [isMobile, setIsMobile] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Setup mouse tracking
  useEffect(() => {
    // Determine if we should render and track mouse
    const canRender = !isMobile && enableAnimations && !prefersReducedMotion;
    setShouldRender(canRender);
    
    if (!canRender) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      // Check if the element or its parents have data-cursor-hover attribute
      let target = e.target as HTMLElement;
      while (target) {
        if (target.dataset && target.dataset.cursorHover) {
          setIsHovering(true);
          return;
        }
        if (target.parentElement) {
          target = target.parentElement;
        } else {
          break;
        }
      }
      
      setIsHovering(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enableAnimations, isMobile, prefersReducedMotion]);
  
  // Don't render on mobile or if animations are disabled
  if (!shouldRender) return null;
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          backgroundColor: isHovering ? '#FFD700' : 'white',
        }}
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          mass: 0.2,
          stiffness: 150,
          damping: 10,
          ease: 'anticipate',
        }}
      />
      
      {/* Subtle outer glow */}
      <motion.div
        className="fixed w-32 h-32 rounded-full pointer-events-none z-[9998] opacity-10"
        style={{
          background: isHovering 
            ? 'radial-gradient(circle, #FFD700 0%, rgba(255,215,0,0) 70%)' 
            : 'radial-gradient(circle, white 0%, rgba(255,255,255,0) 70%)',
        }}
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          mass: 0.5,
          stiffness: 120,
          damping: 15,
        }}
      />
    </>
  );
} 