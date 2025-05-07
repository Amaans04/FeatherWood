import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instagram, Facebook, Linkedin, Send, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export default function Footer() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterValues) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Successfully Subscribed",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-[#0A0A0A] pt-16 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src="/cmp_logo.jpg" 
                alt="FeatherWood" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-[#C4C4C4] mb-6 leading-relaxed">
              Luxury interior design solutions for discerning clients who appreciate exceptional craftsmanship and timeless elegance.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#C4C4C4] hover:text-[#FFD700] transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-[#C4C4C4] hover:text-[#FFD700] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#C4C4C4] hover:text-[#FFD700] transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#C4C4C4] hover:text-[#FFD700] transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <div className="text-[#C4C4C4] hover:text-[#FFD700] transition-all cursor-pointer flex items-center">
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    About Us
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <div className="text-[#C4C4C4] hover:text-[#FFD700] transition-all cursor-pointer flex items-center">
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    Services
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <div className="text-[#C4C4C4] hover:text-[#FFD700] transition-all cursor-pointer flex items-center">
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    Projects
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-[#C4C4C4] hover:text-[#FFD700] transition-all cursor-pointer flex items-center">
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    Contact
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-[#FFD700] mt-1 mr-3" size={18} />
                <div className="text-[#C4C4C4]">
                  <p className="font-medium mb-1">Showroom 1:</p>
                  <p>Kadugodi, Whitefield</p>
                  <p>Bengaluru - 560067</p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="text-[#FFD700] mt-1 mr-3" size={18} />
                <div className="text-[#C4C4C4]">
                  <p className="font-medium mb-1">Showroom 2:</p>
                  <p>Siddapura, Varthur Main Road</p>
                  <p>Bengaluru - 560066</p>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="text-[#FFD700] mt-1 mr-3" size={18} />
                <span className="text-[#C4C4C4]">+91-8850219287</span>
              </li>
              <li className="flex items-start">
                <Mail className="text-[#FFD700] mt-1 mr-3" size={18} />
                <span className="text-[#C4C4C4]">featherwoodblr@gmail.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-[#C4C4C4] mb-4">
              Subscribe to our newsletter for design inspiration, updates, and special offers.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="Your email" 
                          className="flex-grow bg-[#222222] border-none rounded-l-sm px-4 py-2 text-[#F5F5F5] placeholder:text-gray-500 focus:outline-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="bg-[#FFD700] hover:bg-[#D4AF37] text-black px-4 py-2 rounded-r-sm transition-all"
                  disabled={isSubmitting}
                >
                  <Send size={16} />
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        <Separator className="bg-gray-800 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <p className="text-[#C4C4C4] text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FeatherWood. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy">
              <div className="text-[#C4C4C4] hover:text-[#FFD700] text-sm transition-all cursor-pointer">Privacy Policy</div>
            </Link>
            <Link href="/terms">
              <div className="text-[#C4C4C4] hover:text-[#FFD700] text-sm transition-all cursor-pointer">Terms of Service</div>
            </Link>
          </div>
        </div>
        
        {/* Credits Section */}
        <div className="text-center pt-4 border-t border-gray-800">
          <div className="flex flex-col items-center">
            <p className="text-[#C4C4C4] text-sm mb-2">Designed & Developed with</p>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
              </svg>
              <span className="text-[#C4C4C4] text-sm">by</span>
              <a 
                href="https://theapexdev.site" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-1 text-[#FFD700] font-semibold text-sm hover:text-[#D4AF37] transition-all"
              >
                TheApexDev
              </a>
            </div>
            <p className="text-[#888] text-xs mt-2 max-w-md">
              Crafting digital experiences that blend aesthetics with functionality. 
              Our team of expert designers and developers bring your vision to life.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
