import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";

export default function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative py-20 md:py-32 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src="https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury interior"
          className="w-full h-[120%] object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#1A1A1A]/78" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10 text-center max-w-3xl">
        <Reveal variant="fadeIn">
          <p className="luxury-label text-white/50 mb-4">Start Your Journey</p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.08}>
          <h2 className="font-cormorant text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1] tracking-tight mb-5 md:mb-6">
            Ready to Transform Your Space?
          </h2>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.16}>
          <p className="text-white/65 text-sm md:text-base font-light leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto">
            Schedule a free consultation with our design experts and take the first step toward your dream home.
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.24}>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/user-info" className="w-full sm:w-auto">
              <span className="luxury-btn bg-white text-[#1A1A1A] hover:bg-white/90 w-full sm:w-auto justify-center cursor-pointer block text-[10px] py-3.5">
                Book Consultation
              </span>
            </Link>
            <Link href="/projects" className="w-full sm:w-auto">
              <span className="luxury-btn-outline border-white/50 text-white hover:bg-white hover:text-[#1A1A1A] w-full sm:w-auto justify-center cursor-pointer block text-[10px] py-3.5">
                View Portfolio
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
