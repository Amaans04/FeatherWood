import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import { trackFormSubmit } from "@/lib/analytics";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  service: z.string().min(1, { message: "Please select a service" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Google Script URL - use the same one as UserInfo.tsx
      const scriptURL = "https://script.google.com/macros/s/AKfycbw_CsG5qUH22QoyuPhMUZQ2bGX0GeEz35wHDhNkz8Pyrzajb49AVdEn0i5fA_pTmgEyAA/exec";
      
      // Build URL with query parameters
      const url = new URL(scriptURL);
      
      // Add form data as query parameters
      url.searchParams.append("name", data.name);
      url.searchParams.append("email", data.email);
      url.searchParams.append("phone", data.phone || "");
      url.searchParams.append("property", ""); // No property field in this form
      url.searchParams.append("whatsappUpdates", "No"); // No WhatsApp option in this form
      url.searchParams.append("sourceUrl", window.location.href);
      url.searchParams.append("service", data.service);
      url.searchParams.append("message", data.message);
      url.searchParams.append("formType", "contact"); // Mark this as coming from contact form
      
      // Use XMLHttpRequest to avoid page redirection
      const xhr = new XMLHttpRequest();
      
      // Setup request
      xhr.open("GET", url.toString(), true);
      
      // Set up callbacks
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Contact form submitted successfully:", xhr.responseText);
          
          // Show success message
          toast({
            title: "Message Sent",
            description: "Thank you for contacting us. We'll get back to you shortly.",
          });

          trackFormSubmit("contact");
          
          // Reset form
          form.reset();
        } else {
          console.error("Error submitting contact form:", xhr.statusText);
          
          toast({
            title: "Submission Error",
            description: "There was a problem submitting your message. Please try again.",
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
        description: "There was a problem submitting your message. Please try again.",
        variant: "destructive"
      });
      
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 md:py-28 bg-[#FAFAF8] border-t border-[#E8E4DF]">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
        <SectionHeader
          label="Contact"
          title="Get In Touch"
          description="Have questions or ready to start your project? Reach out to our team."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Contact Form */}
          <Reveal variant="fadeUp">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Your name" 
                          className="bg-white border-[#E8E4DF] rounded-none px-4 py-3 text-[#1A1A1A] placeholder:text-[#6E6A66]/60 focus:border-[#1A1A1A] focus:ring-0 font-light"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="Your email address" 
                          className="bg-white border-[#E8E4DF] rounded-none px-4 py-3 text-[#1A1A1A] placeholder:text-[#6E6A66]/60 focus:border-[#1A1A1A] focus:ring-0 font-light"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel" 
                          placeholder="Your phone number" 
                          className="bg-white border-[#E8E4DF] rounded-none px-4 py-3 text-[#1A1A1A] placeholder:text-[#6E6A66]/60 focus:border-[#1A1A1A] focus:ring-0 font-light"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Interested In</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-[#E8E4DF] rounded-none px-4 py-3 text-[#1A1A1A] focus:border-[#1A1A1A] focus:ring-0 font-light">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-[#E6E1DC]">
                          <SelectItem value="interior-design">Interior Design</SelectItem>
                          <SelectItem value="renovation">Renovation</SelectItem>
                          <SelectItem value="furniture-design">Furniture Design</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4} 
                          placeholder="Tell us about your project" 
                          className="bg-white border-[#E8E4DF] rounded-none px-4 py-3 text-[#1A1A1A] placeholder:text-[#6E6A66]/60 focus:border-[#1A1A1A] focus:ring-0 font-light resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full luxury-btn rounded-none text-[10px] tracking-[0.2em]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          </Reveal>
          
          {/* Contact Information */}
          <Reveal variant="fadeUp" delay={0.12}>
          <div className="lg:pl-8">
            <div className="mb-10">
              <h3 className="luxury-label mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-[#8B7355]">
                    <MapPin size={16} strokeWidth={1.5} />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#2B2B2B]">FeatherWood Interiors,Kadugodi</p>
                    <p className="text-[#6E6A66]">Whitefield, Bengaluru, 560066</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-[#8B7355]">
                    <MapPin size={16} strokeWidth={1.5} />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#2B2B2B]">FeatherWood Interiors,Siddapura</p>
                    <p className="text-[#6E6A66]">Whitefield, Bengaluru, 560066</p>
                  </div>
                </div>
                
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-[#8B7355]">
                    <Phone size={16} strokeWidth={1.5} />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#2B2B2B]">+91 88502 19287</p>
                    <p className="text-[#2B2B2B]">+91 97391 35120</p>
                    <p className="text-[#6E6A66]">Mon-Fri: 9am - 6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-[#8B7355]">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#2B2B2B]">featherwoodblr@gmail.com</p>
                    <p className="text-[#6E6A66]">Support: support@featherwood.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="luxury-label mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 border border-[#E8E4DF] flex items-center justify-center text-[#6E6A66] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 border border-[#E8E4DF] flex items-center justify-center text-[#6E6A66] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 border border-[#E8E4DF] flex items-center justify-center text-[#6E6A66] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                >
                  <Facebook size={16} strokeWidth={1.5} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 border border-[#E8E4DF] flex items-center justify-center text-[#6E6A66] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                >
                  <Linkedin size={16} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
