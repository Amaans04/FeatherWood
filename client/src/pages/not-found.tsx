import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <PageLayout
      seo={{
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist.",
        noIndex: true,
      }}
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "404" }]} />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="max-w-md mx-auto text-center border border-[#E8E4DF] bg-white p-8">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-[#8B7355]" />
            </div>
            <h1 className="font-cormorant text-3xl font-light text-[#1A1A1A] mb-4">404 Page Not Found</h1>
            <p className="text-[#6E6A66] text-sm mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <span className="luxury-btn cursor-pointer">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
