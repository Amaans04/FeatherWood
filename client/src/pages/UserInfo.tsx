import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

export default function UserInfo() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    whatsappUpdates: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      whatsappUpdates: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Google Script URL
      const scriptURL = "https://script.google.com/macros/s/AKfycbw_CsG5qUH22QoyuPhMUZQ2bGX0GeEz35wHDhNkz8Pyrzajb49AVdEn0i5fA_pTmgEyAA/exec";
      
      // Build URL with query parameters
      const url = new URL(scriptURL);
      url.searchParams.append("name", formData.name);
      url.searchParams.append("email", formData.email);
      url.searchParams.append("phone", formData.phone);
      url.searchParams.append("property", formData.property || "");
      url.searchParams.append("whatsappUpdates", formData.whatsappUpdates ? "Yes" : "No");
      url.searchParams.append("service", "");
      url.searchParams.append("message", "");
      url.searchParams.append("formType", "quote");
      url.searchParams.append("sourceUrl", window.location.href);
      
      // Use XMLHttpRequest instead of form submission
      const xhr = new XMLHttpRequest();
      
      // Setup request with a silent GET request (no redirect)
      xhr.open("GET", url.toString(), true);
      
      // Set up callbacks
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Form submitted successfully:", xhr.responseText);
          
          // Show success message
          toast({
            title: "Quote Requested",
            description: "We'll contact you shortly with your free quote!",
          });
          
          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            property: "",
            whatsappUpdates: false
          });
        } else {
          console.error("Error submitting form:", xhr.statusText);
          
          // Show error toast
          toast({
            title: "Submission Error",
            description: "There was a problem submitting your form. Please try again.",
            variant: "destructive"
          });
        }
        
        setIsSubmitting(false);
      };
      
      xhr.onerror = function() {
        console.error("Network error during form submission");
        
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive"
        });
        
        setIsSubmitting(false);
      };
      
      // Send the request
      xhr.send();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Book a Free Consultation | FeatherWood</title>
        <meta name="description" content="Book a free consultation with our expert interior designers to transform your space." />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#0A0A0A]">
        <section className="min-h-screen pt-16 pb-20 relative">
          <div className="absolute inset-0 z-0">
            <img 
              src="/kitchen-modern.jpg" 
              alt="Modern Kitchen Design" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6 leading-tight">
                  Let's get started with<br />your dream interiors
                </h1>
                <p className="text-[#C4C4C4] text-lg max-w-xl mb-8">
                  Our expert designers are ready to bring your vision to life. Fill out the form and we'll get back to you with a personalized design plan and quote.
                </p>
                <div className="hidden lg:block">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center">
                        <span className="text-[#FFD700] font-semibold">1</span>
                      </div>
                      <p className="text-[#F5F5F5]">Fill out the simple form</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center">
                        <span className="text-[#FFD700] font-semibold">2</span>
                      </div>
                      <p className="text-[#F5F5F5]">Our designers will contact you</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center">
                        <span className="text-[#FFD700] font-semibold">3</span>
                      </div>
                      <p className="text-[#F5F5F5]">Get a detailed design plan and quote</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-[#222222] p-8 rounded-sm shadow-xl border border-[#333333]">
                  <h2 className="text-2xl font-semibold font-playfair text-white mb-6">Talk to a Designer</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Name"
                        className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email ID"
                        className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                        <Phone className="h-4 w-4 text-[#FFD700]" />
                        <span className="text-gray-400">+91</span>
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Phone number"
                        className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400 pl-20"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex items-start space-x-2 py-1">
                      <Checkbox
                        id="whatsapp"
                        checked={formData.whatsappUpdates}
                        onCheckedChange={handleCheckboxChange}
                        className="border-[#FFD700] data-[state=checked]:bg-[#FFD700] data-[state=checked]:text-black"
                      />
                      <Label htmlFor="whatsapp" className="text-gray-300 text-sm cursor-pointer">
                        Send me updates on WhatsApp
                      </Label>
                    </div>
                    
                    <div>
                      <Input
                        id="property"
                        name="property"
                        placeholder="Property Name"
                        className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400"
                        value={formData.property}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium transition-colors"
                    >
                      {isSubmitting ? "SUBMITTING..." : "GET FREE QUOTE"}
                    </Button>
                  </form>
                  
                  <p className="text-sm text-gray-400 mt-4">
                    By submitting this form, you agree to the{" "}
                    <Link href="/privacy-policy">
                      <span className="text-[#FFD700] hover:underline cursor-pointer">privacy policy</span>
                    </Link>
                    {" "}&{" "}
                    <Link href="/terms">
                      <span className="text-[#FFD700] hover:underline cursor-pointer">terms and conditions</span>
                    </Link>
                  </p>
                </div>
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