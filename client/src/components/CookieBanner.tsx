import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#222222] py-3 px-4 flex justify-between items-center text-sm z-50">
      <p className="text-[#C4C4C4]">Our website uses cookies.</p>
      <div className="flex items-center space-x-2">
        <Button 
          variant="link" 
          className="text-[#FFD700] hover:text-[#D4AF37] p-0 h-auto transition-all"
          onClick={() => window.open('https://www.livspace.com/in/interiors/service/service-cookie-policy', '_blank')}
        >
          Learn more
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-[#C4C4C4] hover:text-white p-1 h-auto transition-all"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
