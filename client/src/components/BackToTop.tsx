import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { handleScrollToTop } from "@/lib/utils";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button 
      onClick={handleScrollToTop}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center shadow-lg transition-all hover:bg-[#D4AF37] z-40"
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  );
}
