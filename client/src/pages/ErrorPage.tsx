import { useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#222222] rounded-sm max-w-lg w-full mx-4 relative">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-[#C4C4C4] hover:text-white transition-all"
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
          <h2 className="font-playfair text-2xl font-semibold mb-2">Whoops!</h2>
          <h3 className="font-playfair text-xl mb-4">Wrong address</h3>
          <p className="text-[#C4C4C4] mb-6">
            We are sorry but the page you requested is unavailable.<br />
            Would you like to explore other areas instead?
          </p>
          <div className="mb-4">
            <Link href="/contact">
              <a className="text-[#FFD700] hover:text-[#D4AF37]">Hire a designer</a>
            </Link>
          </div>
          <div className="mb-6">
            <Link href="/magazine">
              <a className="text-[#FFD700] hover:text-[#D4AF37]">Featherwood magazine</a>
            </Link>
          </div>
          <Button 
            className="w-full bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium py-3 rounded-sm transition-all"
            onClick={handleBackToHome}
          >
            BACK TO HOME
          </Button>
        </div>
      </div>
    </div>
  );
}
