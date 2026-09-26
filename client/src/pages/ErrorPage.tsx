import { useState } from "react";
import { useLocation, Link } from "wouter";
import { X } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function ErrorPage() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setLocation("/");
  };

  const handleBackToHome = () => {
    setLocation("/");
  };

  if (!isVisible) return null;

  return (
    <PageLayout
      seo={{
        title: "Page Not Found",
        description: "The page you requested is unavailable.",
        noIndex: true,
      }}
      hideFooter
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white border border-[#E8E4DF] max-w-lg w-full mx-4 relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#6E6A66] hover:text-[#1A1A1A] transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="p-8 text-center">
            <div className="max-w-xs mx-auto mb-6">
              <img
                src="https://images.livspace-cdn.com/plain/https://d3gq2merok8n5r.cloudfront.net/error-web-1649312864-okbYP.png"
                alt="404 Error"
                className="w-full"
              />
            </div>
            <h2 className="font-cormorant text-2xl font-light mb-2 text-[#1A1A1A]">Whoops!</h2>
            <h3 className="font-cormorant text-xl font-light mb-4 text-[#1A1A1A]">Wrong address</h3>
            <p className="text-[#6E6A66] mb-6">
              We are sorry but the page you requested is unavailable.
              <br />
              Would you like to explore other areas instead?
            </p>
            <div className="mb-4">
              <Link href="/contact">
                <span className="luxury-link cursor-pointer">Hire a designer</span>
              </Link>
            </div>
            <div className="mb-6">
              <Link href="/design-ideas">
                <span className="luxury-link cursor-pointer">Design ideas</span>
              </Link>
            </div>
            <button type="button" className="luxury-btn w-full" onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
