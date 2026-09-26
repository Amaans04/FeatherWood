import { Link } from 'wouter';
import SectionHeader from '@/components/SectionHeader';
import Reveal, { RevealStagger, RevealItem } from '@/components/Reveal';

const calculators = [
  {
    label: 'Full Home Interior',
    description: 'Complete home interior estimate',
    path: '/home-interior-price-calculator',
  },
  {
    label: 'Kitchen',
    description: 'Kitchen design & modular estimate',
    path: '/kitchen-price-calculator',
  },
  {
    label: 'Wardrobe',
    description: 'Custom wardrobe costing',
    path: '/wardrobe-price-calculator',
  },
];

export default function PriceCalculator() {
  return (
    <section className="py-14 md:py-28 bg-white border-t border-[#E8E4DF]">
      <div className="container mx-auto px-5 sm:px-6 max-w-5xl">
        <SectionHeader
          label="Instant Estimate"
          title="Plan Your Dream Space"
          description="Get an approximate cost for your home interiors in minutes."
        />

        <RevealStagger className="flex flex-col md:grid md:grid-cols-3 gap-px bg-[#E8E4DF]">
          {calculators.map((calc) => (
            <RevealItem key={calc.path}>
              <Link href={calc.path}>
                <div className="bg-white p-8 md:p-12 group active:bg-[#FAFAF8] transition-colors duration-300 min-h-[160px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#1A1A1A] mb-2 md:mb-3 font-normal">
                      {calc.label}
                    </h3>
                    <p className="text-[#6E6A66] text-sm font-light leading-relaxed">
                      {calc.description}
                    </p>
                  </div>
                  <span className="inline-block mt-6 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 w-fit group-hover:text-[#8B7355] group-hover:border-[#8B7355] transition-colors">
                    Calculate →
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
