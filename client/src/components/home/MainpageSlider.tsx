import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface SlideData {
  image: string;
  title: string;
  subtitle: string;
  cta1: { text: string; link: string };
  cta2: { text: string; link: string };
}

const slides: SlideData[] = [
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    title: "Premium Living Solutions",
    subtitle: "Elegant furnishings and professional design services",
    cta1: { text: "Shop Furniture", link: "/furniture" },
    cta2: { text: "Design Services", link: "/interiors" },
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    title: "Modern Interior Design",
    subtitle: "Transform your space into a sanctuary",
    cta1: { text: "View Projects", link: "/interiors" },
    cta2: { text: "Get Estimate", link: "/contact" },
  },
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
    title: "Luxury Furniture Collection",
    subtitle: "Discover premium pieces for your home",
    cta1: { text: "Browse Collection", link: "/furniture" },
    cta2: { text: "Book Consultation", link: "/contact" },
  },
];

const MainpageSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative h-lvh
      w-full overflow-hidden -mt-[var(--header-height)]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-white text-center">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl mb-8 opacity-90"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Link
                  href={slides[currentSlide].cta1.link}
                  className="bg-secondary hover:bg-opacity-90 text-secondary-foreground px-8 py-3 rounded-md font-medium hover-scale"
                >
                  {slides[currentSlide].cta1.text}
                </Link>
                <Link
                  href={slides[currentSlide].cta2.link}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-3 rounded-md font-medium transition-all"
                >
                  {slides[currentSlide].cta2.text}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainpageSlider;
