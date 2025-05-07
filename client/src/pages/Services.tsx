import { useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { motion } from "framer-motion";
import { pageTransition, staggerContainer } from "@/utils/animations";
import { services } from "@/data/services";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "design", "renovation", "furniture"];

  // Filter services based on category
  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => {
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
    <>
      <Helmet>
        <title>Our Services | FeatherWood Design</title>
        <meta name="description" content="Explore our comprehensive range of luxury interior design services." />
      </Helmet>

      <Navbar />
      
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
      >
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80" 
              alt="Services hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
              Our Services
            </h1>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-[#F5F5F5] max-w-2xl mx-auto">
              Experience unparalleled craftsmanship and attention to detail with our comprehensive design services
            </p>
          </div>
        </section>
        
        {/* Category Filters */}
        <section className="py-10 bg-[#0A0A0A]">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-sm transition-all ${
                    selectedCategory === category
                      ? "bg-[#FFD700] text-black"
                      : "border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Services Grid */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-[#0A0A0A] to-[#222222]">
          <div className="container mx-auto px-6">
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
                  className="bg-[#222222] rounded-sm overflow-hidden shadow-lg transition-all"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
                    transition: { duration: 0.3 }
                  }}
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
                      <h3 className="font-playfair text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-[#C4C4C4] text-sm mb-4">{service.description}</p>
                      <div className="text-[#FFD700] hover:text-[#D4AF37] inline-flex items-center cursor-pointer">
                        Learn more
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Show message if no services match filter */}
            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-medium mb-4">No services found</h3>
                <p className="text-[#C4C4C4]">Try selecting a different category</p>
              </div>
            )}
          </div>
        </section>
      </motion.div>
      
      <Footer />
      <BackToTop />
    </>
  );
} 