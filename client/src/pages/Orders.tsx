import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Orders() {
  const { getUserOrders, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        if (mounted) {
          setOrders(userOrders);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
  }, [mounted, user, getUserOrders]);

  useEffect(() => {
    return () => {
      setMounted(false);
      setOrders([]);
      setLoading(true);
    };
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <PageLayout seo={{ title: "My Orders", description: "View your FeatherWood order history.", canonical: "/orders", noIndex: true }}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355] mx-auto" />
            <p className="mt-4 text-[#6E6A66]">Loading orders...</p>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      seo={{ title: "My Orders", description: "View your FeatherWood order history.", canonical: "/orders", noIndex: true }}
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Orders" }]} />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <h1 className="font-cormorant text-3xl font-light mb-8 text-[#1A1A1A]">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-12 border border-[#E8E4DF] bg-white">
              <Package className="h-12 w-12 text-[#8B7355] mx-auto mb-4" />
              <h2 className="font-cormorant text-xl font-light mb-2 text-[#1A1A1A]">No Orders Yet</h2>
              <p className="text-[#6E6A66] mb-6">You haven't placed any orders yet.</p>
              <Link href="/furniture">
                <span className="luxury-btn cursor-pointer">Start Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-[#E8E4DF] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-[#1A1A1A]">Order #{order.id}</h3>
                      <p className="text-sm text-[#6E6A66]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[#8B7355] font-medium">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-[#6E6A66] text-sm">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <span className="luxury-btn-outline cursor-pointer text-xs py-2 px-4 min-h-0">View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
