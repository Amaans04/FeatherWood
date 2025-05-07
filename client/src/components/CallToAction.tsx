import { Button } from "@/components/ui/button";

export default function CallToAction() {
  const handleConsultationClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePortfolioClick = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 bg-[#0A0A0A] relative">
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
          alt="Luxury interior background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
            Ready to Transform Your Space?
          </h2>
          <p className="text-[#C4C4C4] text-lg mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our design experts and take the first step toward your dream space.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium py-3 px-8 rounded-sm transition-all"
              onClick={handleConsultationClick}
            >
              Book a Consultation
            </Button>
            <Button 
              variant="outline" 
              className="border border-[#FFD700] bg-[#FFD700] text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] font-medium py-3 px-8 rounded-sm transition-all"
              onClick={handlePortfolioClick}
            >
              View Our Portfolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
