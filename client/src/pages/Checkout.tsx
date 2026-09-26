import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import Breadcrumbs from '@/components/Breadcrumbs';

interface AddressForm {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const inputClass =
  'rounded-none bg-[#FAFAF8] border-[#E8E4DF] text-[#1A1A1A] focus:border-[#8B7355]';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { user, updateUserAddress, createOrder, getUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressForm>({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
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
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserAddress(address);
      const orderId = await createOrder({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: totalPrice,
        status: 'pending',
        shippingAddress: address,
      });
      clearCart();
      toast({
        title: 'Order Placed Successfully',
        description: `Your order #${orderId} has been placed.`,
      });
      setLocation(`/orders/${orderId}`);
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      seo={{
        title: 'Checkout',
        description: 'Complete your FeatherWood furniture purchase.',
        canonical: '/checkout',
        noIndex: true,
      }}
    >
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <Link href="/cart">
            <motion.div className="flex items-center text-[#8B7355] mb-8 cursor-pointer w-fit" whileHover={{ x: -5 }}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm uppercase tracking-wider">Back to Cart</span>
            </motion.div>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-[#E8E4DF] p-6">
              <h2 className="font-cormorant text-2xl font-light mb-6 text-[#1A1A1A]">Shipping Address</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {(['street', 'city', 'state', 'country', 'zipCode'] as const).map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className="text-[#6E6A66] text-xs uppercase tracking-wider capitalize">
                      {field === 'zipCode' ? 'ZIP Code' : field}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      value={address[field]}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </div>
                ))}
              </form>
            </div>

            <div className="bg-white border border-[#E8E4DF] p-6">
              <h2 className="font-cormorant text-2xl font-light mb-6 text-[#1A1A1A]">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-[#FAFAF8] overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1A1A1A]">{item.name}</h3>
                        <p className="text-[#6E6A66] text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-[#8B7355]">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                <div className="border-t border-[#E8E4DF] pt-4">
                  <div className="flex justify-between font-medium text-[#1A1A1A]">
                    <span>Total</span>
                    <span className="text-[#8B7355]">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="luxury-btn w-full mt-6 disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
