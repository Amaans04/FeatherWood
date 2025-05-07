import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Orders() {
  const [location] = useLocation();
  const { getUserOrders, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before fetching data
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch orders only when component is mounted and user is available
  useEffect(() => {
    if (!mounted || !user) return;

    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user:", user.uid);
        const userOrders = await getUserOrders();
        console.log("Fetched orders:", userOrders);
        
        if (mounted) {
          setOrders(userOrders);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [mounted, user, getUserOrders]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setMounted(false);
      setOrders([]);
      setLoading(true);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0A0A0A] py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700] mx-auto"></div>
              <p className="mt-4 text-[#C4C4C4]">Loading orders...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-[#C4C4C4] mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-[#C4C4C4] mb-6">You haven't placed any orders yet.</p>
              <Link href="/furniture">
                <Button className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#151515] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-[#C4C4C4]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-[#FFD700] font-semibold">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-[#C4C4C4]">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 