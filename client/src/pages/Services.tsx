import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";
import { pageTransition, staggerContainer } from "@/utils/animations";
import { services } from "@/data/services";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "design", "renovation", "furniture"];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => {
          if (selectedCategory === "design") {
            return service.title.includes("Design") || service.title.includes("Consultation");
          } else if (selectedCategory === "renovation") {
            return service.title.includes("Renovation");
          } else if (selectedCategory === "furniture") {
            return service.title.includes("Furniture");
          }
          return true;
        });

  return (
    <PageLayout
      seo={{
        title: "Interior Design Services",
        description:
          "FeatherWood offers end-to-end interior design services — from consultation and renovation to custom furniture design for luxury homes in Bengaluru.",
        canonical: "/services",
      }}
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      <PageHero
        label="What We Do"
        title="Our Services"
        description="Experience unparalleled craftsmanship and attention to detail with our comprehensive design services"
        image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80"
        imageAlt="FeatherWood services"
        align="center"
      />

      <motion.div initial="hidden" animate="visible" exit="exit" variants={pageTransition}>
        <section className="py-10 border-b border-[#E8E4DF]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-xs uppercase tracking-[0.15em] transition-all ${
                    selectedCategory === category
                      ? "bg-[#1A1A1A] text-white"
                      : "border border-[#E8E4DF] text-[#6E6A66] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
            >
              {filteredServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white border border-[#E8E4DF] overflow-hidden transition-all hover:-translate-y-1"
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={service.link}>
                    <div className="h-64 overflow-hidden">
                      <motion.img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-cormorant text-xl font-light mb-2 text-[#1A1A1A]">{service.title}</h3>
                      <p className="text-[#6E6A66] text-sm mb-4">{service.description}</p>
                      <span className="luxury-link inline-flex items-center">
                        Learn more
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <h3 className="font-cormorant text-2xl font-light mb-4 text-[#1A1A1A]">No services found</h3>
                <p className="text-[#6E6A66]">Try selecting a different category</p>
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </PageLayout>
  );
}
