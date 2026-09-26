import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, PhoneCall, Mail, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
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
      url.searchParams.append("city", formData.city || "");
      url.searchParams.append("subject", formData.subject);
      url.searchParams.append("message", formData.message);
      url.searchParams.append("formType", "contact");
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
            title: "Message Sent",
            description: "Thank you for contacting us. We'll get back to you soon!",
          });
          
          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            city: "",
            subject: "",
            message: ""
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
    <PageLayout
      seo={{
        title: "Contact FeatherWood Design",
        description:
          "Get in touch with FeatherWood for luxury interior design, modular kitchens, and custom furniture in Bengaluru. Book a free consultation today.",
        canonical: "/contact",
      }}
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <PageHero
        label="Get in Touch"
        title="Let's Connect"
        description="Have a question or want to discuss your interior design project? Get in touch with our team of experts."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        imageAlt="Contact FeatherWood"
        align="center"
      />

      {/* Contact Form Section */}
      <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="bg-white p-8 border border-[#E8E4DF]">
                  <h2 className="font-cormorant text-2xl font-light mb-6 text-[#1A1A1A]">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Full Name"
                          className="rounded-none bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#8B7355] text-[#1A1A1A] placeholder:text-[#6E6A66]"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          className="rounded-none bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#8B7355] text-[#1A1A1A] placeholder:text-[#6E6A66]"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                          <PhoneCall className="h-4 w-4 text-[#8B7355]" />
                          <span className="text-[#6E6A66]">+91</span>
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Phone Number"
                          className="bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#8B7355] text-[#1A1A1A] placeholder:text-[#6E6A66] pl-20"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <Input
                          id="city"
                          name="city"
                          placeholder="City"
                          className="rounded-none bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#8B7355] text-[#1A1A1A] placeholder:text-[#6E6A66]"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Select 
                        value={formData.subject} 
                        onValueChange={(value: string) => handleSelectChange("subject", value)}
                      >
                        <SelectTrigger className="rounded-none bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#8B7355] text-[#1A1A1A]">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E8E4DF] text-[#1A1A1A]">
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          <SelectItem value="Design Consultation">Design Consultation</SelectItem>
                          <SelectItem value="Project Quote">Project Quote</SelectItem>
                          <SelectItem value="Feedback">Feedback</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your Message"
                        className="bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#8B7355] text-[#1A1A1A] placeholder:text-[#6E6A66] min-h-[150px]"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="luxury-btn w-full disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-white p-8 rounded-card mb-8 border border-[#E8E4DF] shadow-soft">
                  <h2 className="text-2xl font-semibold font-cormorant mb-6 text-[#1A1A1A]">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="bg-[#FAFAF8] p-3 rounded-full mr-4">
                        <PhoneCall className="h-6 w-6 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1A1A1A]">Phone</h3>
                        <p className="text-[#6E6A66]">+91-8850219287</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#FAFAF8] p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1A1A1A]">Email</h3>
                        <p className="text-[#6E6A66]">featherwoodblr@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#FAFAF8] p-3 rounded-full mr-4">
                        <Clock className="h-6 w-6 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1A1A1A]">Office Hours</h3>
                        <p className="text-[#6E6A66]">Monday - Sunday: 10:30 AM - 9:30 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#FAFAF8] p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1A1A1A]">Showroom 1</h3>
                        <p className="text-[#6E6A66]">#11/45 Opposite to D mart siddapura, Varthur Main Road</p>
                        <p className="text-[#6E6A66]">Whitefield, Bengaluru - 560066</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#FAFAF8] p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1A1A1A]">Showroom 2</h3>
                        <p className="text-[#6E6A66]">Shop #01 Opposite Sai Garden, next to Miracle Hospital, Kadugodi</p>
                        <p className="text-[#6E6A66]">Whitefield, Bengaluru - 560066</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#FAFAF8] p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#1A1A1A]">Design Studio</h3>
                        <p className="text-[#6E6A66]">Opp Sumadhura Folium, Borewell Road</p>
                        <p className="text-[#6E6A66]">Whitefield, Bangalore - 560066</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Link href="/store-locator">
                    <span className="luxury-btn-outline cursor-pointer">Find All Our Locations</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-14 md:py-28 bg-[#FAFAF8] border-t border-[#E8E4DF]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-cormorant text-3xl font-light mb-4 text-[#1A1A1A]">Frequently Asked Questions</h2>
              <p className="text-[#6E6A66]">
                Find answers to common questions about our services.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-card border border-[#E8E4DF] shadow-soft">
                <h3 className="text-xl font-semibold mb-3 font-cormorant text-[#1A1A1A]">What areas do you serve?</h3>
                <p className="text-[#6E6A66]">
                  We currently serve major cities across India including Mumbai, Delhi, Bangalore, Hyderabad, and Chennai, with plans to expand to more locations soon.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-card border border-[#E8E4DF] shadow-soft">
                <h3 className="text-xl font-semibold mb-3 font-cormorant text-[#1A1A1A]">How long does a typical project take?</h3>
                <p className="text-[#6E6A66]">
                  Project timelines vary based on scope and complexity. A typical full home interior project takes 45-90 days, while individual room renovations usually take 3-4 weeks.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-card border border-[#E8E4DF] shadow-soft">
                <h3 className="text-xl font-semibold mb-3 font-cormorant text-[#1A1A1A]">Do you offer virtual consultations?</h3>
                <p className="text-[#6E6A66]">
                  Yes, we offer convenient virtual consultations via video call. You can book a session with our design experts through our website.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-card border border-[#E8E4DF] shadow-soft">
                <h3 className="text-xl font-semibold mb-3 font-cormorant text-[#1A1A1A]">What is your warranty policy?</h3>
                <p className="text-[#6E6A66]">
                  We provide a 5-year warranty on all products and installations, giving you peace of mind about the quality and durability of our work.
                </p>
              </div>
            </div>
          </div>
        </section>
    </PageLayout>
  );
}