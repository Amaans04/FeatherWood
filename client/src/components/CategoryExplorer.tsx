import { Link } from "wouter";
import furnitureData from "@/data/furniture.json";
import SectionHeader, { MobileScrollHint } from "@/components/SectionHeader";
import Reveal, { RevealStagger, RevealItem } from "@/components/Reveal";

export default function CategoryExplorer() {
  return (
    <section className="py-14 md:py-28 bg-white border-t border-[#E8E4DF] overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
        <SectionHeader
          label="Explore"
          title="Dive Into FeatherWood"
          description="Curated furniture and interior collections crafted for modern Indian homes."
        />

        <MobileScrollHint />

        {/* Mobile: horizontal snap scroll */}
        <RevealStagger className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar mobile-scroll-x pb-2 -mx-5 px-5" data-lenis-prevent-wheel>
          {furnitureData.categories.map((category) => (
            <RevealItem key={category.id} className="flex-shrink-0 w-[42vw] max-w-[180px] snap-start">
              <Link href={`/furniture/${category.id}`}>
                <article className="group cursor-pointer active:opacity-80 transition-opacity">
                  <div className="aspect-[3/4] overflow-hidden bg-[#F5F3F0] mb-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A] text-center font-normal">
                    {category.name}
                  </h3>
                </article>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Desktop: grid */}
        <RevealStagger className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
          {furnitureData.categories.map((category) => (
            <RevealItem key={category.id}>
              <Link href={`/furniture/${category.id}`}>
                <article className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden bg-[#F5F3F0] mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] text-center font-normal group-hover:text-[#8B7355] transition-colors duration-300">
                    {category.name}
                  </h3>
                </article>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal variant="fadeUp" delay={0.2} className="text-center mt-10 md:mt-16">
          <Link href="/furniture">
            <span className="luxury-link inline-block">View All Collections</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
