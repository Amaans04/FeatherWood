import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import projectDetailsData from "@/data/projectDetails.json";
import { cn } from "@/lib/utils";
import LinkWithScroll from "@/components/LinkWithScroll";
import { motion } from "framer-motion";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { slideInLeft, slideInRight, slideInUp, staggerContainer, luxuryHover } from "@/utils/animations";

export default function Projects() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    // Convert the projectDetails object to an array with the necessary properties
    const projectsArray = Object.entries(projectDetailsData).map(([id, details]) => ({
      title: details.title,
      location: details.location,
      imageUrl: details.heroImage,
      link: `/projects/${id}`
    }));
    setProjects(projectsArray);
  }, []);
  
  // For desktop view
  const handleLoadMore = () => {
    setVisibleProjects(Math.min(visibleProjects + 3, projects.length));
  };
  
  // For mobile view, show only 2 projects initially
  const mobileVisibleProjects = showAllProjects ? projects : projects.slice(0, 2);

  // Animation variants
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
    <section id="projects" className="py-12 md:py-20 bg-gradient-to-b from-[#0A0A0A] to-[#222222]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          <AnimateOnScroll variants={slideInLeft}>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4">Featured Projects</h2>
            <motion.div 
              className="w-24 h-1 bg-[#FFD700]"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            ></motion.div>
          </AnimateOnScroll>
        </motion.div>
        
        {/* Desktop/Tablet Project Grid */}
        <motion.div 
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.slice(0, visibleProjects).map((project, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
                transition: { duration: 0.3 }
              }}
            >
              <LinkWithScroll 
                href={project.link}
                className={cn(
                  "rounded-sm overflow-hidden transition-all block",
                  index >= 3 && "hidden lg:block"
                )}
              >
                <div className="relative h-80 overflow-hidden">
                  <motion.img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover" 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="font-playfair text-xl font-semibold mb-1">{project.title}</h3>
                    <p className="text-[#C4C4C4] text-sm">{project.location}</p>
                  </div>
                </div>
              </LinkWithScroll>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mobile Optimized Compact View */}
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
            key={showAllProjects ? "all-projects" : "initial-projects"}
          >
            {mobileVisibleProjects.map((project, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.3 }
                }}
              >
                <LinkWithScroll 
                  href={project.link}
                  className="rounded-sm overflow-hidden block"
                >
                  <div className="relative h-40 overflow-hidden">
                    <motion.img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                      <h3 className="font-playfair text-sm font-semibold">{project.title}</h3>
                      <p className="text-[#C4C4C4] text-xs">{project.location}</p>
                    </div>
                  </div>
                </LinkWithScroll>
              </motion.div>
            ))}
          </motion.div>
          
          {!showAllProjects && (
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div whileHover={luxuryHover} whileTap={{ scale: 0.95 }}>
                <LinkWithScroll href="/projects">
                  <Button 
                    variant="outline"
                    className="border border-[#FFD700] bg-[#FFD700] text-black hover:bg-[#D4AF37] hover:border-[#D4AF37]"
                  >
                    <span>View All Projects</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </LinkWithScroll>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Desktop View Load More */}
        {visibleProjects < projects.length && (
          <AnimateOnScroll variants={slideInUp} className="mt-10 text-center hidden md:block">
            <motion.div whileHover={luxuryHover} whileTap={{ scale: 0.95 }}>
              <LinkWithScroll href="/projects">
                <Button 
                  variant="outline"
                  className="border border-[#FFD700] bg-[#FFD700] text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] font-medium py-3 px-8 rounded-sm transition-all"
                >
                  View All Projects
                </Button>
              </LinkWithScroll>
            </motion.div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
}
