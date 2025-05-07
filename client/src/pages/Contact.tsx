import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, PhoneCall, Mail, Clock, MapPin } from "lucide-react";

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
    <>
      <Helmet>
        <title>Contact Us | Featherwood</title>
        <meta name="description" content="Get in touch with Featherwood for all your interior design and home renovation needs." />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#0A0A0A]">
        {/* Breadcrumbs */}
        <div className="bg-[#121212] py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-[#C4C4C4]">
              <Link href="/">
                <span className="hover:text-[#FFD700] cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-[#FFD700]">Contact Us</span>
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6">Let's Connect</h1>
              <p className="text-[#C4C4C4] text-lg mb-8">
                Have a question or want to discuss your interior design project? Get in touch with our team of experts.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="bg-[#222] p-8 rounded-sm">
                  <h2 className="text-2xl font-semibold font-playfair mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Full Name"
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
                          placeholder="Email Address"
                          className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                          <PhoneCall className="h-4 w-4 text-[#FFD700]" />
                          <span className="text-gray-400">+91</span>
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Phone Number"
                          className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400 pl-20"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <Input
                          id="city"
                          name="city"
                          placeholder="City"
                          className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400"
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
                        <SelectTrigger className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#222] border-[#333]">
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
                        className="bg-[#1A1A1A] border-[#333333] focus:border-[#FFD700] text-white placeholder:text-gray-400 min-h-[150px]"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#FFD700] text-black hover:bg-[#E5C100]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                    </Button>
                  </form>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-[#222] p-8 rounded-sm mb-8">
                  <h2 className="text-2xl font-semibold font-playfair mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="bg-[#333] p-3 rounded-full mr-4">
                        <PhoneCall className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Phone</h3>
                        <p className="text-[#C4C4C4]">+91-8850219287</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#333] p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Email</h3>
                        <p className="text-[#C4C4C4]">featherwoodblr@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#333] p-3 rounded-full mr-4">
                        <Clock className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Office Hours</h3>
                        <p className="text-[#C4C4C4]">Monday - Sunday: 10:30 AM - 9:30 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#333] p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Showroom 1</h3>
                        <p className="text-[#C4C4C4]">#11/45 Opposite to D mart siddapura, Varthur Main Road</p>
                        <p className="text-[#C4C4C4]">Whitefield, Bengaluru - 560066</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#333] p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Showroom 2</h3>
                        <p className="text-[#C4C4C4]">Shop #01 Opposite Sai Garden, next to Miracle Hospital, Kadugodi</p>
                        <p className="text-[#C4C4C4]">Whitefield, Bengaluru - 560066</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-[#333] p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Design Studio</h3>
                        <p className="text-[#C4C4C4]">Opp Sumadhura Folium, Borewell Road</p>
                        <p className="text-[#C4C4C4]">Whitefield, Bangalore - 560066</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Link href="/store-locator">
                    <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 w-full max-w-xs">
                      Find All Our Locations
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-[#151515]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-playfair mb-4">Frequently Asked Questions</h2>
              <p className="text-[#C4C4C4]">
                Find answers to common questions about our services.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#222] p-6 rounded-sm">
                <h3 className="text-xl font-semibold mb-3 font-playfair">What areas do you serve?</h3>
                <p className="text-[#C4C4C4]">
                  We currently serve major cities across India including Mumbai, Delhi, Bangalore, Hyderabad, and Chennai, with plans to expand to more locations soon.
                </p>
              </div>
              
              <div className="bg-[#222] p-6 rounded-sm">
                <h3 className="text-xl font-semibold mb-3 font-playfair">How long does a typical project take?</h3>
                <p className="text-[#C4C4C4]">
                  Project timelines vary based on scope and complexity. A typical full home interior project takes 45-90 days, while individual room renovations usually take 3-4 weeks.
                </p>
              </div>
              
              <div className="bg-[#222] p-6 rounded-sm">
                <h3 className="text-xl font-semibold mb-3 font-playfair">Do you offer virtual consultations?</h3>
                <p className="text-[#C4C4C4]">
                  Yes, we offer convenient virtual consultations via video call. You can book a session with our design experts through our website.
                </p>
              </div>
              
              <div className="bg-[#222] p-6 rounded-sm">
                <h3 className="text-xl font-semibold mb-3 font-playfair">What is your warranty policy?</h3>
                <p className="text-[#C4C4C4]">
                  We provide a 5-year warranty on all products and installations, giving you peace of mind about the quality and durability of our work.
                </p>
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