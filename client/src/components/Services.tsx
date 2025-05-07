import { Link } from "wouter";
import { ChevronRight, ChevronDown } from "lucide-react";
import { services } from "@/data/services";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { staggerContainer, royalFade, slideInUp, goldShimmer, luxuryHover } from "@/utils/animations";

export default function Services() {
  const [showAllServices, setShowAllServices] = useState(false);
  
  // For mobile, initially show only 2 services
  const visibleServices = showAllServices ? services : services.slice(0, 2);

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <section id="services" className="py-12 md:py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <AnimateOnScroll variants={slideInUp} className="text-center mb-10 md:mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4">Our Luxury Services</h2>
          <motion.div 
            className="w-24 h-1 bg-[#FFD700] mx-auto"
            variants={goldShimmer}
            initial="hidden"
            animate="visible"
            style={{
              backgroundImage: "linear-gradient(90deg, #FFD700, #FFF8DC, #FFD700)",
              backgroundSize: "200% 100%"
            }}
          ></motion.div>
          <p className="text-[#C4C4C4] mt-6 max-w-2xl mx-auto">
            Experience unparalleled craftsmanship and attention to detail with our comprehensive design services
          </p>
        </AnimateOnScroll>
        
        {/* For larger screens with animations */}
        <motion.div 
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="bg-[#222222] rounded-sm overflow-hidden transition-all card-hover"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.3)",
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
              }}
            >
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
                <Link href={service.link}>
                  <motion.div 
                    className="text-[#FFD700] hover:text-[#D4AF37] inline-flex items-center cursor-pointer"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mobile optimized compact view with animations */}
        <motion.div 
          className="md:hidden"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div 
            className="grid grid-cols-2 gap-4" 
            variants={containerVariants}
            key={showAllServices ? "all-services" : "initial-services"}
          >
            {visibleServices.map((service, index) => (
              <motion.div 
                key={index} 
                className="bg-[#222222] rounded-sm overflow-hidden transition-all card-hover"
                variants={cardVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2), 0 3px 3px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="h-32 overflow-hidden">
                  <motion.img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-playfair text-base font-semibold mb-1">{service.title}</h3>
                  <Link href={service.link}>
                    <motion.div 
                      className="text-[#FFD700] hover:text-[#D4AF37] inline-flex items-center text-xs cursor-pointer"
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Learn more
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {!showAllServices && (
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div whileHover={luxuryHover} whileTap={{ scale: 0.95 }}>
                <Link href="/services">
                  <Button 
                    variant="outline"
                    className="border border-[#FFD700] bg-[#FFD700] text-black hover:bg-[#D4AF37] hover:border-[#D4AF37]"
                  >
                    <span>View All Services</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
