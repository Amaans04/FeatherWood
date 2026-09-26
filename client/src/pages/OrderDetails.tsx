import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function OrderDetails() {
  const [, params] = useRoute("/orders/:orderId");
  const orderId = params?.orderId;
  const { getUserOrders } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await getUserOrders();
        setOrder(orders.find((o) => o.id === orderId));
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId, getUserOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "processing":
        return "text-blue-600";
      case "shipped":
        return "text-purple-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const layoutProps = {
    seo: {
      title: "Order Details",
      description: "View details for your FeatherWood order.",
      canonical: `/orders/${orderId}`,
      noIndex: true as const,
    },
  };

  if (loading) {
    return (
      <PageLayout {...layoutProps}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center text-[#6E6A66]">Loading...</div>
        </section>
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout {...layoutProps}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Orders", href: "/orders" }, { label: "Not Found" }]} />
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <h2 className="font-cormorant text-2xl font-light mb-4 text-[#1A1A1A]">Order Not Found</h2>
            <Link href="/orders">
              <span className="luxury-btn cursor-pointer">View All Orders</span>
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout {...layoutProps}>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: `#${order.id}` },
        ]}
      />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <Link href="/orders">
            <motion.div className="flex items-center text-[#8B7355] mb-8 cursor-pointer w-fit" whileHover={{ x: -5 }}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm uppercase tracking-wider">Back to Orders</span>
            </motion.div>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[#E8E4DF] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-cormorant text-2xl font-light text-[#1A1A1A]">Order #{order.id}</h2>
                  <div className={`flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-medium capitalize text-sm">{order.status}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
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
                </div>
              </div>

              <div className="bg-white border border-[#E8E4DF] p-6">
                <h3 className="font-cormorant text-xl font-light mb-4 text-[#1A1A1A]">Shipping Address</h3>
                <div className="space-y-1 text-[#6E6A66] text-sm">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E8E4DF] p-6 sticky top-24">
                <h3 className="font-cormorant text-xl font-light mb-6 text-[#1A1A1A]">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-[#6E6A66] text-sm">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#6E6A66] text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-[#E8E4DF] pt-4">
                    <div className="flex justify-between font-medium text-[#1A1A1A]">
                      <span>Total</span>
                      <span className="text-[#8B7355]">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-[#6E6A66] text-xs uppercase tracking-wider">Order Date</p>
                  <p className="font-medium text-[#1A1A1A] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
