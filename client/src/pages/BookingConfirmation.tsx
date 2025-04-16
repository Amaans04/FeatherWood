import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const BookingConfirmation: React.FC = () => {
  const [, navigate] = useLocation();
  
  // Redirect to home if accessed directly (without going through checkout)
  useEffect(() => {
    // In a real app, you would check if there was actually an order submitted
    // For now, we'll just use a timeout for demo purposes
    const timer = setTimeout(() => {
      if (!document.referrer.includes("checkout")) {
        // navigate("/");
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const orderNumber = "FW" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-accent mb-4" />
              </div>
              <CardTitle className="text-3xl">Thank You for Your Order!</CardTitle>
              <CardDescription className="text-lg">
                Your order has been placed successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">Order Number:</p>
                <p className="text-2xl font-bold">{orderNumber}</p>
              </div>
              
              <div className="border border-dashed border-gray-300 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-3">What's Next?</h3>
                <p className="text-gray-700 mb-4">
                  We've sent an order confirmation to your email. A member of our team will
                  contact you within 24 hours to confirm your order details and delivery schedule.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h4 className="font-medium text-primary mb-1">Order Processing</h4>
                    <p className="text-sm text-gray-600">
                      Your order will be processed within 1-2 business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">Delivery</h4>
                    <p className="text-sm text-gray-600">
                      Standard delivery takes 3-5 business days after processing.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Need Help?</h3>
                <p className="text-sm text-gray-700">
                  If you have any questions about your order, please contact our customer support:
                </p>
                <p className="text-sm">
                  <a href="mailto:support@featherwood.com" className="text-primary hover:text-accent">
                    support@featherwood.com
                  </a> 
                  {" "}or{" "}
                  <a href="tel:+18005551234" className="text-primary hover:text-accent">
                    +1 (800) 555-1234
                  </a>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/furniture">Continue Shopping</Link>
              </Button>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
