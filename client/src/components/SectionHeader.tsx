import { ReactNode } from 'react';
import Reveal from '@/components/Reveal';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`mb-10 md:mb-16 max-w-2xl ${alignClass} ${className}`}>
      {label && (
        <Reveal variant="fadeIn" delay={0}>
          <p className="luxury-label mb-3">{label}</p>
        </Reveal>
      )}
      <Reveal variant="fadeUp" delay={0.08}>
        <h2 className="font-cormorant text-[2rem] leading-tight sm:text-4xl md:text-5xl font-light text-[#1A1A1A] tracking-tight mb-4">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal variant="fadeUp" delay={0.16}>
          <p className="text-[#6E6A66] text-sm md:text-base font-light leading-relaxed">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function MobileScrollHint({ children }: { children?: ReactNode }) {
  return (
    <div className="md:hidden flex items-center justify-between mb-5 px-1">
      <span className="luxury-label text-[9px]">Swipe to explore</span>
      <div className="flex gap-1">
        <span className="w-6 h-px bg-[#1A1A1A]" />
        <span className="w-3 h-px bg-[#E8E4DF]" />
        <span className="w-1.5 h-px bg-[#E8E4DF]" />
      </div>
    </div>
  );
}
