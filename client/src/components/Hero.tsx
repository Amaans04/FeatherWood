import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
          alt="Luxury interior design" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 image-overlay"></div>
      </div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight text-shadow">
              Transform Your Space <br className="hidden md:block" />
              <span className="text-[#FFD700]">Elevate Your Living</span>
            </h1>
            <p className="text-[#C4C4C4] text-xl md:text-2xl mb-8 font-cormorant">
              Luxury interior design tailored to your lifestyle
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium py-3 px-8 rounded-sm transition-all"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book a Consultation
              </Button>
              <Button 
                variant="outline" 
                className="border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 font-medium py-3 px-8 rounded-sm transition-all"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
