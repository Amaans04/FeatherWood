import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  const { user, getUserData, updateUserAddress } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setUserData(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            city: data.city || "",
            address: data.address || {
              street: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getUserData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserAddress(formData.address);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0A0A0A] py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto"></div>
              <p className="mt-4 text-[#C4C4C4]">Loading profile...</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Profile</h1>

            <div className="bg-[#151515] rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C4C4C4] mb-2">Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-[#222] border-[#333] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C4C4C4] mb-2">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="bg-[#222] border-[#333] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C4C4C4] mb-2">Phone</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-[#222] border-[#333] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C4C4C4] mb-2">City</label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-[#222] border-[#333] text-white"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#333]">
                  <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#C4C4C4] mb-2">Street</label>
                      <Input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#222] border-[#333] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C4C4C4] mb-2">City</label>
                      <Input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#222] border-[#333] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C4C4C4] mb-2">State</label>
                      <Input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#222] border-[#333] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C4C4C4] mb-2">Country</label>
                      <Input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#222] border-[#333] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C4C4C4] mb-2">ZIP Code</label>
                      <Input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#222] border-[#333] text-white"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-6">
                    <Button type="submit" className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
} 