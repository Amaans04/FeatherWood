import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { motion } from "framer-motion";
import { pageTransition, staggerContainer } from "@/utils/animations";
import LinkWithScroll from "@/components/LinkWithScroll";
import projectDetailsData from "@/data/projectDetails.json";
import { projects } from "@/data/projects";

interface ProjectDetailType {
  id: string;
  title: string;
  location: string;
  description: string;
  heroImage: string;
  [key: string]: any;
}

export default function Projects() {
  const [allProjects, setAllProjects] = useState<ProjectDetailType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "residential", "commercial"];

  useEffect(() => {
    // Convert the object to an array
    const projectsArray = Object.values(projectDetailsData) as ProjectDetailType[];
    setAllProjects(projectsArray);
  }, []);

  // Filter projects based on category
  const filteredProjects = selectedCategory === "all" 
    ? allProjects 
    : allProjects.filter(project => {
        // Simple categorization based on project titles/descriptions
        if (selectedCategory === "residential") {
          return project.title.includes("Penthouse") || 
                 project.title.includes("Villa") || 
                 project.title.includes("Retreat") || 
                 project.title.includes("Loft");
        } else if (selectedCategory === "commercial") {
          return project.title.includes("Hotel") || 
                 project.title.includes("Headquarters");
        }
        return true;
      });

  return (
    <>
      <Helmet>
        <title>Our Projects | Featherwood Design</title>
        <meta name="description" content="Explore our portfolio of luxury interior design projects ranging from residential to commercial spaces." />
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
              src="https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="Projects hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
              Our Projects
            </h1>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-[#F5F5F5] max-w-2xl mx-auto">
              Discover our portfolio of thoughtfully designed spaces that balance aesthetics with functionality
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
        
        {/* Projects Grid */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-[#0A0A0A] to-[#222222]">
          <div className="container mx-auto px-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
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
                  <LinkWithScroll href={`/projects/${project.id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <motion.img 
                        src={project.heroImage} 
                        alt={project.title} 
                        className="w-full h-full object-cover" 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7 }}
                      />
                      <div className="absolute top-0 right-0 bg-[#FFD700] text-black px-3 py-1 m-3 text-sm font-medium">
                        {project.title.includes("Penthouse") || 
                         project.title.includes("Villa") || 
                         project.title.includes("Retreat") || 
                         project.title.includes("Loft")
                          ? "Residential"
                          : "Commercial"}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-playfair text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-[#C4C4C4] text-sm mb-3">{project.location}</p>
                      <p className="text-[#F5F5F5] text-sm line-clamp-3 mb-4">
                        {project.description}
                      </p>
                      <div className="text-[#FFD700] inline-flex items-center text-sm">
                        View Project Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </LinkWithScroll>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Show message if no projects match filter */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-medium mb-4">No projects found</h3>
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