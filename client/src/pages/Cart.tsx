import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft } from 'lucide-react';
import QuantityControl from '@/components/QuantityControl';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to proceed to checkout.',
        variant: 'destructive',
      });
      setLocation('/auth');
      return;
    }
    setLocation('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <PageLayout
      seo={{
        title: 'Shopping Cart',
        description: 'Review items in your FeatherWood shopping cart.',
        canonical: '/cart',
        noIndex: true,
      }}
    >
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <Link href="/furniture">
            <motion.div className="flex items-center text-[#8B7355] mb-8 cursor-pointer w-fit" whileHover={{ x: -5 }}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm uppercase tracking-wider">Continue Shopping</span>
            </motion.div>
          </Link>

          <div className="mb-8">
            <h1 className="font-cormorant text-3xl md:text-4xl font-light mb-2 text-[#1A1A1A]">Your Cart</h1>
            <p className="text-[#6E6A66]">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 border border-[#E8E4DF] bg-white">
              <h2 className="font-cormorant text-2xl font-light mb-4 text-[#1A1A1A]">Your cart is empty</h2>
              <p className="text-[#6E6A66] mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/furniture">
                <span className="luxury-btn cursor-pointer">Start Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#E8E4DF] p-6 flex flex-col md:flex-row gap-6"
                  >
                    <div className="w-full md:w-40 h-40 bg-[#FAFAF8] overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-cormorant text-xl font-light mb-2 text-[#1A1A1A]">{item.name}</h3>
                      <p className="text-[#8B7355] text-lg mb-4">{formatPrice(item.price)}</p>
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
                          className="text-[#6E6A66] hover:text-red-500 transition-colors"
                          type="button"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white border border-[#E8E4DF] p-6 sticky top-24">
                  <h2 className="font-cormorant text-xl font-light mb-6 text-[#1A1A1A]">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[#6E6A66]">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-[#6E6A66]">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-[#E8E4DF] pt-4">
                      <div className="flex justify-between font-medium text-[#1A1A1A]">
                        <span>Total</span>
                        <span className="text-[#8B7355]">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="luxury-btn w-full disabled:opacity-50"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
