import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Process() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  
  const handleConsultationClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleStep = (stepIndex: number) => {
    if (expandedStep === stepIndex) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepIndex);
    }
  };
  
  const processSteps = [
    {
      number: 1,
      title: "Consultation",
      description: "We begin with an in-depth consultation to understand your vision, requirements, and lifestyle needs."
    },
    {
      number: 2,
      title: "Design & Planning",
      description: "Our design team creates detailed plans, mood boards, and 3D visualizations of your future space."
    },
    {
      number: 3,
      title: "Execution",
      description: "We handle the entire implementation process, from procurement to installation, ensuring flawless execution."
    }
  ];

  return (
    <section id="process" className="py-12 md:py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4">Our Design Process</h2>
          <div className="w-24 h-1 bg-[#FFD700] mx-auto"></div>
          <p className="text-[#C4C4C4] mt-6 max-w-2xl mx-auto">
            We believe in a collaborative approach to design, creating spaces that reflect your personality and lifestyle
          </p>
        </div>
        
        {/* Desktop view - Regular grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:gap-12">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#222222] text-[#FFD700] mb-6">
                <span className="font-playfair text-2xl font-semibold">{step.number}</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-[#C4C4C4]">{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* Mobile view - Accordion style */}
        <div className="md:hidden space-y-3">
          {processSteps.map((step, index) => (
            <div 
              key={index} 
              className="bg-[#222222] rounded-sm overflow-hidden"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A0A0A] text-[#FFD700] mr-3">
                    <span className="font-playfair font-semibold">{step.number}</span>
                  </div>
                  <h3 className="font-playfair text-base font-semibold">{step.title}</h3>
                </div>
                {expandedStep === index ? 
                  <ChevronDown className="w-4 h-4 text-[#FFD700]" /> : 
                  <ChevronRight className="w-4 h-4 text-[#FFD700]" />
                }
              </div>
              
              {expandedStep === index && (
                <div className="px-4 pb-4 text-[#C4C4C4] text-sm">
                  <p>{step.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-10 md:mt-16 text-center">
          <Button 
            className="bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium py-3 px-8 rounded-sm transition-all"
            onClick={handleConsultationClick}
          >
            Schedule a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
