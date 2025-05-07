import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuantityControl from '@/components/QuantityControl';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Cart() {
  const [location, setLocation] = useLocation();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed to checkout.",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    setLocation("/checkout");
  };

  // Format price to INR currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#0A0A0A] py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Link href="/furniture">
            <motion.div
              className="flex items-center text-[#FFD700] mb-8 cursor-pointer w-fit"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Continue Shopping</span>
            </motion.div>
          </Link>

          {/* Cart header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Cart</h1>
            <p className="text-[#C4C4C4]">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {items.length === 0 ? (
            // Empty cart state
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-[#C4C4C4] mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/furniture">
                <Button className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            // Cart items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#151515] rounded-lg p-6 flex flex-col md:flex-row gap-6"
                  >
                    {/* Product image */}
                    <div className="w-full md:w-40 h-40 bg-[#222222] rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                      <p className="text-[#FFD700] text-lg mb-4">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Quantity control */}
                      <div className="flex items-center justify-between">
                        <QuantityControl
                          quantity={item.quantity}
                          onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                          onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#C4C4C4] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#151515] rounded-lg p-6 sticky top-8">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[#C4C4C4]">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-[#C4C4C4]">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-[#222222] pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-[#FFD700]">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#FFD700] hover:bg-[#D4AF37] text-black py-6 text-lg"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
} 