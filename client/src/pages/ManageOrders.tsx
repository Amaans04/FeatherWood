import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Order {
  id: string;
  userId: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: { street: string; city: string; state: string; country: string; zipCode: string };
  createdAt: Date;
}

const seo = { title: "Manage Orders", description: "Admin order management for FeatherWood.", noIndex: true as const };

export default function ManageOrders() {
  const { getAllOrders, updateOrderStatus } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch(() => toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [getAllOrders]);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast({ title: "Success", description: "Order status updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update order status", variant: "destructive" });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (selectedStatus === "all" || order.status === selectedStatus);
  });

  const content = (
    <section className="py-14 md:py-28">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
        <h1 className="font-cormorant text-3xl md:text-4xl font-light mb-8 text-[#1A1A1A]">Manage Orders</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6A66] h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by order ID or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-none bg-white border-[#E8E4DF] text-[#1A1A1A]"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-none bg-white border border-[#E8E4DF] text-[#1A1A1A] px-4 py-2 text-sm"
          >
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
              <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#E8E4DF] p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="font-medium text-[#1A1A1A]">Order #{order.id}</h2>
                  <p className="text-[#6E6A66] text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-sm capitalize text-[#8B7355] mt-2 md:mt-0">{order.status}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#6E6A66] mb-2">Items</h3>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
                        <div>
                          <p className="text-sm text-[#1A1A1A]">{item.name}</p>
                          <p className="text-xs text-[#6E6A66]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-[#8B7355] text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#6E6A66] mb-2">Shipping Address</h3>
                  <p className="text-sm text-[#6E6A66]">{order.shippingAddress.street}</p>
                  <p className="text-sm text-[#6E6A66]">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[#E8E4DF] flex flex-wrap justify-between items-center gap-4">
                <p className="text-[#8B7355] font-medium">₹{order.totalAmount.toLocaleString()}</p>
                <div className="flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                    className="rounded-none border border-[#E8E4DF] px-3 py-2 text-sm text-[#1A1A1A]"
                  >
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <Link href={`/orders/${order.id}`}>
                    <span className="luxury-btn-outline text-xs py-2 px-4 min-h-0 cursor-pointer">View Details</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <PageLayout seo={seo}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto" />
            <p className="mt-4 text-[#6E6A66]">Loading orders...</p>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout seo={seo}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Manage Orders" }]} />
      {content}
    </PageLayout>
  );
}
