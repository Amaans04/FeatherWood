import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    // Auto-advance carousel
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-16 md:py-24 bg-[#222222]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4">Client Testimonials</h2>
          <div className="w-24 h-1 bg-[#FFD700] mx-auto"></div>
        </div>
        
        <div className="relative">
          {/* Testimonial Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-all duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4 md:px-12">
                  <div className="bg-[#0A0A0A] p-8 md:p-12 rounded-sm">
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-playfair text-xl font-semibold">{testimonial.name}</h3>
                        <p className="text-[#C4C4C4] text-sm">{testimonial.project}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex text-[#FFD700]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="fill-current" size={16} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#C4C4C4] italic line-clamp-3">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Controls */}
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevSlide} 
              className="mx-2 w-10 h-10 rounded-full border border-[#C4C4C4] flex items-center justify-center text-[#C4C4C4] hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextSlide} 
              className="mx-2 w-10 h-10 rounded-full border border-[#C4C4C4] flex items-center justify-center text-[#C4C4C4] hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
