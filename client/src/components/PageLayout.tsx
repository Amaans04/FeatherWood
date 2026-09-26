import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
}

interface PageLayoutProps {
  children: ReactNode;
  seo?: SEOConfig;
  className?: string;
  hideFooter?: boolean;
}

export default function PageLayout({
  children,
  seo,
  className,
  hideFooter = false,
}: PageLayoutProps) {
  return (
    <>
      {seo && <SEO {...seo} />}
      <Navbar />
      <main
        className={cn(
          "pt-16 pb-mobile-nav lg:pb-0 min-h-screen bg-[#FAFAF8] overflow-x-hidden",
          className
        )}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
