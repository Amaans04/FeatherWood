import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ArrowRight } from "lucide-react";
import { services } from "@/data/services";

interface ServiceDetailProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export default function ServiceDetail() {
  const [, params] = useRoute('/services/:id');
  const serviceId = params?.id;
  
  const [serviceData, setServiceData] = useState<ServiceDetailProps | null>(null);
  
  useEffect(() => {
    if (serviceId) {
      const service = services.find(service => {
        const path = service.link.split("/").pop();
        return path === serviceId;
      });
      
      if (service) {
        setServiceData(service);
      }
    }
  }, [serviceId]);
  
  if (!serviceData) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Service not found</h1>
          <p className="mb-6">The service you're looking for doesn't exist or hasn't been created yet.</p>
          <Link href="/#services">
            <Button>
              Back to Services
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  // Special content for interior design page
  const isInteriorDesign = serviceId === "interior-design";
  
  return (
    <>
      <Helmet>
        <title>{serviceData.title} | Featherwood</title>
        <meta name="description" content={serviceData.description} />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#0A0A0A] relative">
          <div className="h-[50vh] md:h-[65vh] w-full relative">
            <div className="absolute inset-0 bg-black/60"></div>
            <img 
              src={serviceData.imageUrl} 
              alt={serviceData.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-2xl">
                  {serviceData.title}
                </h1>
                <p className="text-lg md:text-xl text-[#E5E5E5] mt-4 max-w-2xl">
                  {serviceData.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-6">
                What We Offer
              </h2>
              <p className="text-[#C4C4C4] mb-8">
                At Featherwood, we provide comprehensive {serviceData.title.toLowerCase()} services tailored to your unique needs and preferences. Our team of experienced designers and craftspeople work closely with you to bring your vision to life.
              </p>
              
              <Separator className="my-10 bg-[#333]" />
              
              {/* Interior Design specific section with link to Design Ideas */}
              {isInteriorDesign && (
                <div className="bg-[#222] p-8 rounded-sm mb-12">
                  <h3 className="text-xl md:text-2xl font-playfair font-semibold mb-4">
                    Explore Our Design Ideas
                  </h3>
                  <p className="text-[#C4C4C4] mb-6">
                    Looking for inspiration? Browse our curated collection of design ideas to discover stunning interior concepts for every room in your home.
                  </p>
                  <Link href="/design-ideas">
                    <Button className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                      View Design Ideas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
              
              <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-6">
                Our Process
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Consultation</h3>
                    <p className="text-[#C4C4C4]">
                      We begin with an in-depth consultation to understand your vision, requirements, and budget. Our team will discuss your style preferences and functional needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Design Development</h3>
                    <p className="text-[#C4C4C4]">
                      Our designers create detailed plans and visual concepts for your approval. We incorporate your feedback to refine the design until it's perfect.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Implementation</h3>
                    <p className="text-[#C4C4C4]">
                      Our skilled team brings the design to life with meticulous attention to detail. We manage the entire process to ensure quality and timely completion.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Final Reveal</h3>
                    <p className="text-[#C4C4C4]">
                      We present the finished space to you and ensure everything meets your expectations. Our relationship continues with after-service support.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <h3 className="text-xl font-semibold mb-4">Ready to Transform Your Space?</h3>
                <Link href="/user-info">
                  <Button className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                    Book a Consultation
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
} 