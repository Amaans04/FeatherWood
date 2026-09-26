import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 8000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const testimonial = testimonials[currentSlide];

  return (
    <section className="py-14 md:py-28 bg-white border-t border-[#E8E4DF]">
      <div className="container mx-auto px-5 sm:px-6 max-w-4xl">
        <SectionHeader label="Testimonials" title="What Our Clients Say" />

        <Reveal variant="scaleIn">
          <div
            className="relative min-h-[260px] md:min-h-[280px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center px-2 md:px-12"
              >
                <blockquote className="font-cormorant text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-[#1A1A1A] leading-[1.45] italic mb-8 md:mb-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover grayscale"
                  />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]">
                      {testimonial.name}
                    </p>
                    <p className="text-[#6E6A66] text-xs font-light mt-0.5">
                      {testimonial.project}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center items-center gap-6 mt-10">
              <button
                onClick={prevSlide}
                className="p-2 text-[#6E6A66] hover:text-[#1A1A1A] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 stroke-[1]" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="min-w-[32px] min-h-[32px] flex items-center justify-center"
                    aria-label={`Testimonial ${i + 1}`}
                  >
                    <span
                      className={`block h-px transition-all duration-300 ${
                        i === currentSlide ? "w-8 bg-[#1A1A1A]" : "w-4 bg-[#E8E4DF]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-2 text-[#6E6A66] hover:text-[#1A1A1A] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 stroke-[1]" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
