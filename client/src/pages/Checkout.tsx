import React, { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const formatPrice = (price: number): string => {
  return `$${(price / 100).toFixed(2)}`;
};

const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  saveAddress: z.boolean().default(false),
  paymentMethod: z.enum(["credit", "paypal", "bank"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout: React.FC = () => {
  const [, navigate] = useLocation();
  const { cartItems, cartItemsWithProducts, cartTotal, clearCart } = useCart();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      saveAddress: false,
      paymentMethod: "credit",
    },
  });
  
  const onSubmit = (values: CheckoutFormValues) => {
    console.log("Checkout form submitted:", values);
    
    // Simulate successful order placement
    clearCart();
    navigate("/booking-confirmation");
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-6">You need to add some items to your cart before checking out.</p>
          <Button asChild>
            <Link href="/furniture">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      
                      <FormField
                        control={form.control}
                        name="phone"
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
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>City*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code*</FormLabel>
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
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="saveAddress"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Save this address for future orders</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Choose how you want to pay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="credit" id="credit" />
                                <FormLabel htmlFor="credit" className="cursor-pointer flex-1">Credit / Debit Card</FormLabel>
                                <div className="flex gap-2">
                                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <FormLabel htmlFor="paypal" className="cursor-pointer flex-1">PayPal</FormLabel>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                              </div>
                              
                              <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="bank" id="bank" />
                                <FormLabel htmlFor="bank" className="cursor-pointer flex-1">Bank Transfer</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Credit card form would go here when credit is selected */}
                    {form.watch("paymentMethod") === "credit" && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <FormLabel>Card Number</FormLabel>
                          <Input placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <FormLabel>Expiry Date</FormLabel>
                            <Input placeholder="MM/YY" />
                          </div>
                          <div>
                            <FormLabel>CVC</FormLabel>
                            <Input placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-primary hover:bg-accent">
                      Place Order
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItemsWithProducts.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2">
                      <div className="flex gap-2">
                        <div className="relative">
                          <img 
                            src={item.product?.imageUrls?.[0] || "https://via.placeholder.com/50"} 
                            alt={item.product?.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium line-clamp-1">{item.product?.name}</div>
                          <div className="text-gray-500">{formatPrice(item.product?.price || 0)} each</div>
                        </div>
                      </div>
                      <div className="font-medium">{formatPrice((item.product?.price || 0) * item.quantity)}</div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{cartTotal >= 100000 ? 'Free' : formatPrice(999)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(cartTotal * 0.07)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(cartTotal + (cartTotal >= 100000 ? 0 : 999) + (cartTotal * 0.07))}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
