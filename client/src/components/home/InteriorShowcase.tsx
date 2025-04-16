import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "@/components/interior/ProjectCard";
import { InteriorProject } from "@shared/schema";

const InteriorShowcase: React.FC = () => {
  const { data: projects, isLoading, error } = useQuery<InteriorProject[]>({
    queryKey: ["/api/projects/featured"],
  });

  return (
    <section className="py-16 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interior Design Portfolio</h2>
          <p className="text-lg text-gray-700">Explore our recent design projects that transformed spaces into personalized sanctuaries.</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading projects. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/interiors">
            <a className="inline-block bg-secondary hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-medium">
              View All Projects
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InteriorShowcase;
