import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EntryAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');
    
    if (hasSeenAnimation) {
      setIsVisible(false);
      return;
    }

    sessionStorage.setItem('hasSeenAnimation', 'true');

    // Show the logo for 2 seconds, then start wipe-out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: '-100%',
            transition: { 
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#110f10] overflow-hidden"
        >
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <img
              src="/cmp_logo.jpg"
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryAnimation; 