import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { services } from "@/data/services";
import SectionHeader, { MobileScrollHint } from "@/components/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/Reveal";
import Reveal from "@/components/Reveal";

function ServiceCard({ service }: { service: (typeof services)[0] }) {
  return (
    <Link href={service.link}>
      <div className="cursor-pointer h-full flex flex-col bg-[#FAFAF8] group active:scale-[0.98] transition-transform duration-300">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={service.imageUrl}
            alt={`${service.title} — FeatherWood interior design service`}
            width={400}
            height={500}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#1A1A1A] mb-2 md:mb-3 font-normal">
            {service.title}
          </h3>
          <p className="text-[#6E6A66] text-xs md:text-sm font-light leading-relaxed mb-4 flex-grow line-clamp-2">
            {service.description}
          </p>
          <span className="inline-flex items-center text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#1A1A1A] md:group-hover:text-[#8B7355] transition-colors">
            Explore
            <ChevronRight className="w-3 h-3 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-14 md:py-28 bg-[#FAFAF8] overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
        <SectionHeader
          label="What We Offer"
          title="Our Services"
          description="End-to-end interior design with exceptional craftsmanship and meticulous attention to detail."
        />

        <MobileScrollHint />

        {/* Mobile horizontal scroll */}
        <RevealStagger className="md:hidden flex gap-px overflow-x-auto snap-x snap-mandatory no-scrollbar mobile-scroll-x bg-[#E8E4DF] -mx-5 px-5 pb-1" data-lenis-prevent-wheel>
          {services.map((service) => (
            <RevealItem key={service.title} className="flex-shrink-0 w-[72vw] max-w-[300px] snap-center">
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Desktop grid */}
        <RevealStagger className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8E4DF]">
          {services.map((service) => (
            <RevealItem key={service.title} className="bg-[#FAFAF8] group">
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal variant="fadeUp" delay={0.15} className="text-center mt-10 md:mt-14">
          <Link href="/services">
            <span className="luxury-link">View All Services</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
