import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";

const inputClass =
  "rounded-none bg-[#FAFAF8] border-[#E8E4DF] text-[#1A1A1A] disabled:opacity-60 focus:border-[#8B7355]";

export default function Profile() {
  const { getUserData, updateUserAddress } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: { street: "", city: "", state: "", country: "", zipCode: "" },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            city: data.city || "",
            address: data.address || { street: "", city: "", state: "", country: "", zipCode: "" },
          });
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch user data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [getUserData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserAddress(formData.address);
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsEditing(false);
    } catch {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <PageLayout seo={{ title: "Profile", description: "Manage your FeatherWood account.", canonical: "/profile", noIndex: true }}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto" />
            <p className="mt-4 text-[#6E6A66]">Loading profile...</p>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout seo={{ title: "Profile", description: "Manage your FeatherWood account profile and address.", canonical: "/profile", noIndex: true }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="font-cormorant text-3xl md:text-4xl font-light mb-8 text-[#1A1A1A]">Profile</h1>

            <div className="bg-white border border-[#E8E4DF] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-cormorant text-xl font-light text-[#1A1A1A]">Personal Information</h2>
                <button type="button" onClick={() => setIsEditing(!isEditing)} className="luxury-btn-outline text-xs py-2 px-4 min-h-0">
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["name", "email", "phone", "city"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-[#6E6A66] text-xs uppercase tracking-wider mb-2 capitalize">{field}</label>
                      <Input
                        type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        disabled={field === "email" || !isEditing}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#E8E4DF]">
                  <h3 className="font-cormorant text-lg font-light mb-4 text-[#1A1A1A]">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(["street", "city", "state", "country", "zipCode"] as const).map((field) => (
                      <div key={field}>
                        <label className="block text-[#6E6A66] text-xs uppercase tracking-wider mb-2">
                          {field === "zipCode" ? "ZIP Code" : field}
                        </label>
                        <Input
                          type="text"
                          name={`address.${field}`}
                          value={formData.address[field]}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-6">
                    <button type="submit" className="luxury-btn">Save Changes</button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
