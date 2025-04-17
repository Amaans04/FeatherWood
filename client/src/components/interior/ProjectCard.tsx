import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { InteriorProject } from "@shared/schema";

interface ProjectCardProps {
  project: InteriorProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-72">
        <img 
          src={project.imageUrls?.[0] || project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
          <Link href={`/interiors/${project.slug}`}>
            <button className="bg-white text-primary hover:bg-accent hover:text-white px-5 py-2 rounded-md transition-all">
              View Project
            </button>
          </Link>
        </div>
      </div>
      <div className="p-6">
        <span className="text-accent text-sm font-medium mb-2 block">{project.category}</span>
        <h3 className="font-bold text-xl mb-3">{project.title}</h3>
        <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>
        <Link href={`/interiors/${project.slug}`}>
          <span className="text-primary hover:text-accent font-medium flex items-center cursor-pointer">
            View Case Study <ArrowRight className="ml-2 w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
