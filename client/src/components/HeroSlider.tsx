import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInUp, royalFade, goldShimmer, luxuryHover } from '@/utils/animations';

// Import the hero slides data from the JSON file
import heroSlidesData from '../data/hero-slides.json';

export default function HeroSlider() {
  const { slides } = heroSlidesData;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Changed to 5 seconds for slower transitions
    
    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to ensure the interval runs continuously
  
  const prevSlide = () => {
    if (!isTransitioning) {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    
    // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 700);
    }
  };
  
  const nextSlide = () => {
    if (!isTransitioning) {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    
    // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 700);
    }
  };
  
  const goToSlide = (index: number) => {
    if (!isTransitioning && index !== currentSlide) {
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 700);
    }
  };
  
  return (
    <div className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-[#0A0A0A] w-full max-w-[100vw]">
      {/* Slides */}
      <AnimatePresence mode="wait">
      {slides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
          key={slide.id}
              className="absolute inset-0 flex items-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.7, 
                ease: [0.25, 0.1, 0.25, 1.0] 
              }}
          style={{ 
            backgroundColor: slide.backgroundColor,
          }}
        >
          {/* Background Image with Overlay */}
              <motion.div 
                className="absolute inset-0 bg-cover bg-center w-full"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 7,
                  ease: "easeOut"
                }}
            style={{ 
              backgroundImage: `url(${slide.image})`,
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: slide.overlayColor }}
            ></div>
              </motion.div>
          
          {/* Content */}
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-lg md:max-w-xl">
                  <motion.h1 
                    className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-white"
                    variants={slideInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                {slide.title}
                  </motion.h1>
                  <motion.h2 
                    className="text-xl md:text-2xl font-medium mb-3 md:mb-4 text-[#FFD700]"
                    variants={slideInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                {slide.subtitle}
                  </motion.h2>
                  <motion.p 
                    className="text-[#C4C4C4] text-base md:text-lg mb-6 md:mb-8"
                    variants={slideInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                {slide.description}
                  </motion.p>
                  <motion.div
                    variants={slideInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
              <Link href={slide.cta.link}>
                      <motion.div whileHover={luxuryHover} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-[#FFD700] hover:bg-[#D4AF37] text-black text-sm md:text-base font-medium px-6 py-2.5"
                >
                  {slide.cta.text}
                </Button>
                      </motion.div>
              </Link>
                  </motion.div>
            </div>
          </div>
            </motion.div>
          )
      ))}
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <motion.button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        onClick={prevSlide}
        aria-label="Previous slide"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="h-6 w-6" />
      </motion.button>
      
      <motion.button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        onClick={nextSlide}
        aria-label="Next slide"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="h-6 w-6" />
      </motion.button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-[#FFD700] w-6' 
                : 'bg-white/50 hover:bg-white/80 w-3'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={index === currentSlide ? { width: 24 } : { width: 12 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}