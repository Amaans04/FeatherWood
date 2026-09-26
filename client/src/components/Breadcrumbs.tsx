import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-[#FAFAF8] border-b border-[#E8E4DF] py-3 md:py-4"
    >
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
        <ol className="flex items-center flex-wrap gap-1 text-[10px] md:text-xs uppercase tracking-[0.12em] text-[#6E6A66]">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 mx-2 opacity-40 flex-shrink-0" />
              )}
              {item.href ? (
                <Link href={item.href}>
                  <span className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className="text-[#8B7355]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
