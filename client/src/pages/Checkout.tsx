import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AddressForm {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { user, updateUserAddress, createOrder, getUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressForm>({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (user) {
        const userData = await getUserData();
        if (userData?.address) {
          setAddress(userData.address);
        }
      }
    };
    fetchUserAddress();
  }, [user, getUserData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user's address
      await updateUserAddress(address);

      // Create order
      const orderId = await createOrder({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: totalPrice,
        status: "pending",
        shippingAddress: address,
      });

      // Clear cart
      clearCart();

      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${orderId} has been placed.`,
      });

      // Redirect to order confirmation
      setLocation(`/orders/${orderId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#0A0A0A] py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Link href="/cart">
            <motion.div
              className="flex items-center text-[#FFD700] mb-8 cursor-pointer w-fit"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Cart</span>
            </motion.div>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Address Form */}
            <div className="bg-[#151515] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    required
                    className="bg-[#222] border-[#333] text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                    className="bg-[#222] border-[#333] text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    required
                    className="bg-[#222] border-[#333] text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleInputChange}
                    required
                    className="bg-[#222] border-[#333] text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleInputChange}
                    required
                    className="bg-[#222] border-[#333] text-white"
                  />
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-[#151515] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-[#222] rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-[#C4C4C4]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-[#FFD700]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                <div className="border-t border-[#222] pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-[#FFD700]">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FFD700] hover:bg-[#D4AF37] text-black py-6 text-lg mt-6"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 