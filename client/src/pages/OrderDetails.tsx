import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        const foundOrder = orders.find(o => o.id === orderId);
        setOrder(foundOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, getUserOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "shipped":
        return "text-purple-500";
      case "delivered":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0A0A0A] py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0A0A0A] py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
              <Link href="/orders">
                <Button className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                  View All Orders
                </Button>
              </Link>
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
      
      <main className="min-h-screen bg-[#0A0A0A] py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Link href="/orders">
            <motion.div
              className="flex items-center text-[#FFD700] mb-8 cursor-pointer w-fit"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Orders</span>
            </motion.div>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#151515] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                  <div className={`flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-semibold capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
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
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#151515] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                <div className="space-y-2 text-[#C4C4C4]">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#151515] rounded-lg p-6 sticky top-8">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-[#C4C4C4]">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#C4C4C4]">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-[#222] pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-[#FFD700]">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <p className="text-[#C4C4C4]">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 