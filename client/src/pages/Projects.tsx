import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";
import { pageTransition, staggerContainer } from "@/utils/animations";
import LinkWithScroll from "@/components/LinkWithScroll";
import projectDetailsData from "@/data/projectDetails.json";

interface ProjectDetailType {
  id: string;
  title: string;
  location: string;
  description: string;
  heroImage: string;
  [key: string]: unknown;
}

export default function Projects() {
  const [allProjects, setAllProjects] = useState<ProjectDetailType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "residential", "commercial"];

  useEffect(() => {
    const projectsArray = Object.values(projectDetailsData) as ProjectDetailType[];
    setAllProjects(projectsArray);
  }, []);

  const filteredProjects =
    selectedCategory === "all"
      ? allProjects
      : allProjects.filter((project) => {
          if (selectedCategory === "residential") {
            return (
              project.title.includes("Penthouse") ||
              project.title.includes("Villa") ||
              project.title.includes("Retreat") ||
              project.title.includes("Loft")
            );
          } else if (selectedCategory === "commercial") {
            return project.title.includes("Hotel") || project.title.includes("Headquarters");
          }
          return true;
        });

  return (
    <PageLayout
      seo={{
        title: "Interior Design Projects Portfolio",
        description:
          "Explore FeatherWood's portfolio of luxury interior design projects — residential and commercial spaces crafted with exceptional attention to detail.",
        canonical: "/projects",
      }}
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />

      <PageHero
        label="Portfolio"
        title="Our Projects"
        description="Discover our portfolio of thoughtfully designed spaces that balance aesthetics with functionality"
        image="https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        imageAlt="FeatherWood projects"
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
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white border border-[#E8E4DF] overflow-hidden transition-all hover:-translate-y-1"
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
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
                      <div className="absolute top-0 right-0 bg-[#8B7355] text-white px-3 py-1 m-3 text-[10px] uppercase tracking-[0.12em]">
                        {project.title.includes("Penthouse") ||
                        project.title.includes("Villa") ||
                        project.title.includes("Retreat") ||
                        project.title.includes("Loft")
                          ? "Residential"
                          : "Commercial"}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-cormorant text-xl font-light mb-2 text-[#1A1A1A]">{project.title}</h3>
                      <p className="text-[#6E6A66] text-sm mb-3">{project.location}</p>
                      <p className="text-[#6E6A66] text-sm line-clamp-3 mb-4">{project.description}</p>
                      <span className="luxury-link inline-flex items-center text-sm">
                        View Project Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </LinkWithScroll>
                </motion.div>
              ))}
            </motion.div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <h3 className="font-cormorant text-2xl font-light mb-4 text-[#1A1A1A]">No projects found</h3>
                <p className="text-[#6E6A66]">Try selecting a different category</p>
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </PageLayout>
  );
}
