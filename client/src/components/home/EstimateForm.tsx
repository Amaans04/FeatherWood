import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { insertConsultationRequestSchema } from "@shared/schema";

const formSchema = insertConsultationRequestSchema.extend({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  projectType: z.string().min(1, { message: "Please select a project type" }),
  description: z.string().min(10, { message: "Please provide a brief description of your project" }),
  budgetRange: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EstimateForm: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      projectType: "",
      description: "",
      budgetRange: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest("POST", "/api/consultation-requests", {
        ...values,
        createdAt: new Date(),
        status: "pending"
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Thank you for your interest! We'll contact you within 24 hours.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <section className="py-16 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg overflow-hidden card-shadow">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Get a Free Design Estimate</h2>
              <p className="text-gray-700 mb-6">Tell us about your project and our design consultant will get back to you within 24 hours with a personalized plan and quote.</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Type*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Modular Kitchen">Modular Kitchen</SelectItem>
                              <SelectItem value="Living Room">Living Room</SelectItem>
                              <SelectItem value="Bedroom">Bedroom</SelectItem>
                              <SelectItem value="Bathroom">Bathroom</SelectItem>
                              <SelectItem value="Full Home">Full Home</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description*</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Under $5,000">Under $5,000</SelectItem>
                            <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                            <SelectItem value="$10,000 - $20,000">$10,000 - $20,000</SelectItem>
                            <SelectItem value="$20,000 - $50,000">$20,000 - $50,000</SelectItem>
                            <SelectItem value="Over $50,000">Over $50,000</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-secondary hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-medium transition-all"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="bg-primary text-white hidden md:block relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1658&q=80" 
                alt="Interior designer working" 
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Why Choose Our Design Services?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="text-accent mt-1 mr-3 w-5 h-5" />
                    <span>Expert designers with 10+ years of experience</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-accent mt-1 mr-3 w-5 h-5" />
                    <span>Personalized approach to match your style</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-accent mt-1 mr-3 w-5 h-5" />
                    <span>3D visualization before implementation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-accent mt-1 mr-3 w-5 h-5" />
                    <span>Transparent pricing with no hidden costs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-accent mt-1 mr-3 w-5 h-5" />
                    <span>Premium materials and craftsmanship</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-accent mt-1 mr-3 w-5 h-5" />
                    <span>End-to-end project management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstimateForm;
