import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  className?: string;
  zoomLevel?: number;
  magnifierSize?: number;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  className = '',
  zoomLevel = 2.5,
  magnifierSize = 150,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const magnifierRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isEnabled) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (isEnabled) {
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const toggleMagnifier = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      setShowMagnifier(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={className}
      />
      
      <button
        onClick={toggleMagnifier}
        className="absolute bottom-4 right-4 bg-[#FFD700] hover:bg-[#D4AF37] text-black px-4 py-2 rounded-full shadow-lg transition-all duration-200 z-20 flex items-center gap-2 font-medium"
        title={isEnabled ? "Disable magnifying glass" : "Enable magnifying glass"}
      >
        {isEnabled ? (
          <>
            <ZoomOut className="w-5 h-5" />
            <span>Disable Magnifier</span>
          </>
        ) : (
          <>
            <ZoomIn className="w-5 h-5" />
            <span>Enable Magnifier</span>
          </>
        )}
      </button>
      
      <AnimatePresence>
        {showMagnifier && isEnabled && (
          <motion.div
            ref={magnifierRef}
            className="absolute pointer-events-none rounded-full overflow-hidden border-2 border-[#FFD700]"
            style={{
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              left: `calc(${position.x}% - ${magnifierSize / 2}px)`,
              top: `calc(${position.y}% - ${magnifierSize / 2}px)`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.2
            }}
          >
            <motion.div
              className="absolute w-full h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.2
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageMagnifier; 