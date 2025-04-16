import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message is required and should be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = (values: ContactFormValues) => {
    console.log("Contact form submitted:", values);
    
    // Show success toast
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you shortly.",
    });
    
    // Reset form
    form.reset();
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg opacity-90">
              Have questions or need assistance? Our team is here to help you transform your space into a sanctuary.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information and Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                          <Phone className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-gray-600 mb-1">Customer Support:</p>
                        <a href="tel:+18005551234" className="text-primary hover:text-accent">
                          +1 (800) 555-1234
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                          <Mail className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-600 mb-1">For inquiries:</p>
                        <a href="mailto:info@featherwood.com" className="text-primary hover:text-accent">
                          info@featherwood.com
                        </a>
                        <p className="text-gray-600 mt-2 mb-1">For support:</p>
                        <a href="mailto:support@featherwood.com" className="text-primary hover:text-accent">
                          support@featherwood.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                          <MapPin className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Visit Us</h3>
                        <p className="text-gray-600">
                          123 Design Street<br />
                          New York, NY 10001<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                          <Clock className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Business Hours</h3>
                        <p className="text-gray-600">
                          Mon - Fri: 9AM - 6PM<br />
                          Sat: 10AM - 4PM<br />
                          Sun: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name*</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                            <FormLabel>Email Address*</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message*</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={6} 
                              placeholder="How can we help you?" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-accent"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Google Maps (placeholder) */}
      <section className="h-96 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Map will be displayed here</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
