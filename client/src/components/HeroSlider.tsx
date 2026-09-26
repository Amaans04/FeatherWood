import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import heroSlidesData from '../data/hero-slides.json';

const SWIPE_THRESHOLD = 50;

export default function HeroSlider() {
  const { slides } = heroSlidesData;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning, currentSlide]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    /* Only horizontal swipe changes slides — don't intercept vertical scroll */
    if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div
      ref={heroRef}
      className="relative h-[calc(100svh-4rem-3.75rem)] min-h-[440px] max-h-[860px] overflow-hidden bg-[#1A1A1A] w-full lg:h-[calc(100svh-4rem)] lg:min-h-[560px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div className="absolute inset-0 overflow-hidden" style={{ y: parallaxY }}>
            <img
              src={slide.image}
              alt={`${slide.title} — FeatherWood luxury interior design`}
              width={1920}
              height={1080}
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              loading={currentSlide === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover scale-[1.12] will-change-transform"
            />
          </motion.div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/40" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex items-end lg:items-center z-10"
        style={{ opacity: contentOpacity }}
      >
        <div className="w-full px-5 sm:px-6 lg:px-8 pb-12 pr-16 lg:pb-0 lg:pr-8">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="luxury-label text-white/80 mb-3 md:mb-4">{slide.subtitle}</p>
                <h1 className="font-cormorant text-[2.25rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-4 md:mb-6">
                  {slide.title}
                </h1>
                <p className="text-white/80 text-sm md:text-base font-light leading-relaxed mb-5 md:mb-10 max-w-[90%] md:max-w-md">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href={slide.cta.link} className="w-full sm:w-auto">
                    <span className="luxury-btn w-full sm:w-auto text-center justify-center text-[10px] py-3.5 cursor-pointer block">
                      {slide.cta.text}
                    </span>
                  </Link>
                  <Link href="/store-locator" className="w-full sm:w-auto">
                    <span className="luxury-btn-outline w-full sm:w-auto text-center justify-center border-white/50 text-white text-[10px] py-3.5 hover:bg-white hover:text-[#1A1A1A] cursor-pointer block">
                      Visit Showroom
                    </span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Desktop arrows */}
      <button
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors p-2"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-7 w-7 stroke-[1]" />
      </button>
      <button
        className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors p-2"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-7 w-7 stroke-[1]" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-5 lg:bottom-8 lg:left-8 z-20 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-px transition-all duration-500 min-w-[24px] min-h-[24px] flex items-center justify-center`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={`block h-px transition-all duration-500 ${
                index === currentSlide ? 'w-10 bg-white' : 'w-5 bg-white/35'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Mobile swipe hint */}
      <motion.div
        className="lg:hidden absolute bottom-4 right-16 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">Swipe</span>
      </motion.div>
    </div>
  );
}
