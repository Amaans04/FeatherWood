import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InteriorProject } from "@shared/schema";
import ProjectCard from "@/components/interior/ProjectCard";
import DesignProcess from "@/components/home/DesignProcess";
import PriceEstimator from "@/components/PriceEstimator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InteriorDesign: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: projects, isLoading } = useQuery<InteriorProject[]>({
    queryKey: ["/api/projects"],
  });
  
  // Get unique categories from projects
  const categories = projects ? 
    Array.from(new Set(projects.map(project => project.category))) : 
    [];
  
  const filteredProjects = activeTab === "all" ? 
    projects : 
    projects?.filter(project => project.category === activeTab);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Interior Design Solutions</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Our professional designers create personalized spaces that reflect your style, 
              optimize functionality, and enhance your lifestyle.
            </p>
            <a 
              href="#get-estimate" 
              className="bg-accent hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-medium inline-block"
            >
              Get a Free Estimate
            </a>
          </div>
        </div>
      </section>
      
      {/* Portfolio Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Design Portfolio</h2>
            <p className="text-lg text-gray-700">
              Explore our recent design projects that transformed spaces into personalized sanctuaries.
            </p>
          </div>
          
          {/* Category Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg h-96 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredProjects?.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No projects found</h3>
                  <p className="text-gray-600">Please try a different category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {filteredProjects?.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Design Process Section */}
      <DesignProcess />
      
      {/* Price Estimator Section */}
      <section id="get-estimate" className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get an Instant Price Estimate</h2>
            <p className="text-lg text-gray-700">
              Use our interactive tool to calculate a personalized estimate for your interior design project.
            </p>
          </div>
          <div className="flex justify-center">
            <PriceEstimator />
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteriorDesign;
