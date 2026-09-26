import Reveal from "@/components/Reveal";

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
  align?: "left" | "center";
  minHeight?: string;
}

export default function PageHero({
  label,
  title,
  description,
  image,
  imageAlt = "",
  align = "left",
  minHeight = "min-h-[45vh] md:min-h-[55vh]",
}: PageHeroProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-end md:items-center";

  return (
    <section className={`relative ${minHeight} max-h-[640px] overflow-hidden bg-[#1A1A1A]`}>
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

      <div className={`relative z-10 h-full flex ${alignClass}`}>
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl py-16 md:py-20 w-full">
          <div className={align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"}>
            {label && (
              <Reveal variant="fadeIn">
                <p className="luxury-label text-white/60 mb-3">{label}</p>
              </Reveal>
            )}
            <Reveal variant="fadeUp" delay={0.08}>
              <h1 className="font-cormorant text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.08] tracking-tight">
                {title}
              </h1>
            </Reveal>
            {description && (
              <Reveal variant="fadeUp" delay={0.16}>
                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mt-4 md:mt-5 max-w-lg">
                  {description}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
