import { Link } from "wouter";
import SectionHeader from "@/components/SectionHeader";
import Reveal, { RevealStagger, RevealItem } from "@/components/Reveal";

const processSteps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We begin with an in-depth consultation to understand your vision, requirements, and lifestyle.",
  },
  {
    number: "02",
    title: "Design & Planning",
    description:
      "Detailed plans, mood boards, and 3D visualizations bring your future space to life.",
  },
  {
    number: "03",
    title: "Execution",
    description:
      "From procurement to installation — flawless execution with uncompromising quality.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-14 md:py-28 bg-[#FAFAF8]">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
        <SectionHeader label="How It Works" title="Our Design Process" />

        <RevealStagger className="space-y-0 md:grid md:grid-cols-3 md:gap-8">
          {processSteps.map((step, index) => (
            <RevealItem key={index}>
              <div className="relative py-8 md:py-0 border-b border-[#E8E4DF] md:border-0 last:border-0">
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px bg-[#E8E4DF]" />
                )}
                <Reveal variant="fadeUp" delay={index * 0.1}>
                  <span className="font-cormorant text-5xl md:text-6xl font-light text-[#E8E4DF] block mb-3 md:mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#1A1A1A] mb-3 font-normal">
                    {step.title}
                  </h3>
                  <p className="text-[#6E6A66] text-sm font-light leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </Reveal>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal variant="fadeUp" delay={0.2} className="mt-12 md:mt-16 text-center">
          <Link href="/user-info">
            <span className="luxury-btn cursor-pointer w-full sm:w-auto inline-flex justify-center text-[10px] py-3.5 px-10">
              Schedule a Consultation
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
