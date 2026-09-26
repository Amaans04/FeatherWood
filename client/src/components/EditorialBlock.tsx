import { useRef } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { services } from "@/data/services";
import SectionHeader, { MobileScrollHint } from "@/components/SectionHeader";
import Reveal, { RevealStagger, RevealItem } from "@/components/Reveal";

export default function EditorialBlock({
  label,
  title,
  paragraphs,
  image,
  imageAlt = "",
  reverse = false,
  cta,
}: {
  label?: string;
  title: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
  cta?: { text: string; href: string };
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section className="py-14 md:py-28 bg-[#F9F8F6] overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
        <div
          className={`flex flex-col gap-10 md:gap-16 lg:gap-20 ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } lg:items-center`}
        >
          {image && (
            <Reveal variant="scaleIn" className="w-full lg:w-1/2">
              <div ref={imageRef} className="aspect-[4/5] max-h-[70vh] lg:max-h-none overflow-hidden bg-[#EDE8E2]">
                <motion.img
                  src={image}
                  alt={imageAlt || title}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="w-full h-[110%] object-cover will-change-transform"
                  style={{ y: imageY }}
                />
              </div>
            </Reveal>
          )}

          <div className={`w-full ${image ? "lg:w-1/2" : "max-w-3xl mx-auto text-center"}`}>
            {label && (
              <Reveal variant="fadeIn">
                <p className="luxury-label mb-3">{label}</p>
              </Reveal>
            )}
            <Reveal variant="fadeUp" delay={0.08}>
              <h2 className="font-cormorant text-[2rem] leading-[1.12] sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight mb-6 md:mb-8">
                {title}
              </h2>
            </Reveal>
            <div className={`space-y-4 md:space-y-5 ${!image ? "mx-auto" : ""}`}>
              {paragraphs.map((paragraph, i) => (
                <Reveal key={i} variant="fadeUp" delay={0.12 + i * 0.08}>
                  <p className="text-[#6E6A66] text-sm md:text-base font-light leading-[1.85]">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
            {cta && (
              <Reveal variant="fadeUp" delay={0.28} className={`mt-8 md:mt-10 ${!image ? "flex justify-center" : ""}`}>
                <Link href={cta.href}>
                  <span className="luxury-link">{cta.text}</span>
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
