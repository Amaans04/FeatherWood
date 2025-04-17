import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { InteriorProject } from "@shared/schema";
import { ArrowLeft, ArrowRight, ChevronRight, Calendar, MapPin, DollarSign, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const { data: project, isLoading, error } = useQuery<InteriorProject>({
    queryKey: [`/api/projects/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div>
            <div className="h-80 bg-gray-200 w-full mb-6 rounded"></div>
            <div className="h-6 bg-gray-200 w-1/2 mb-4 rounded"></div>
            <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-background min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="mb-6">Sorry, we couldn't find the project you're looking for.</p>
          <Link href="/interiors">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle image navigation
  const nextImage = () => {
    if (project.imageUrls && activeImage < project.imageUrls.length - 1) {
      setActiveImage(activeImage + 1);
      setShowVideo(false);
    }
  };

  const prevImage = () => {
    if (activeImage > 0) {
      setActiveImage(activeImage - 1);
      setShowVideo(false);
    }
  };

  // Toggle video display
  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-8">
          <Link href="/">
            <a className="text-gray-500 hover:text-primary">Home</a>
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link href="/interiors">
            <a className="text-gray-500 hover:text-primary">Interior Projects</a>
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-primary font-medium">{project.title}</span>
        </div>

        {/* Project title */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
            <div>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                {project.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main image gallery */}
          <div className="lg:col-span-2">
            <div className="mb-6 relative rounded-lg overflow-hidden bg-black/5 h-[500px]">
              {/* Show video if available and toggled */}
              {showVideo ? (
                <div className="w-full h-full flex items-center justify-center">
                  {project.videoUrl ? (
                    <iframe 
                      src={project.videoUrl} 
                      className="w-full h-full" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-center p-6">
                      <p>No video available for this project</p>
                    </div>
                  )}
                </div>
              ) : (
                <img 
                  src={project.imageUrls?.[activeImage] || project.image} 
                  alt={`${project.title} - Image ${activeImage + 1}`}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Navigation arrows */}
              {project.imageUrls && project.imageUrls.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={prevImage} 
                    disabled={activeImage === 0}
                    className="bg-white/80 hover:bg-white text-primary rounded-full h-10 w-10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={nextImage} 
                    disabled={!project.imageUrls || activeImage === project.imageUrls.length - 1}
                    className="bg-white/80 hover:bg-white text-primary rounded-full h-10 w-10"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {project.imageUrls?.map((img, index) => (
                <div 
                  key={index}
                  className={`relative w-20 h-20 rounded cursor-pointer overflow-hidden flex-shrink-0 border-2 ${
                    activeImage === index && !showVideo ? 'border-secondary' : 'border-transparent'
                  }`}
                  onClick={() => {
                    setActiveImage(index);
                    setShowVideo(false);
                  }}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {/* Video thumbnail if available */}
              {project.videoUrl && (
                <div 
                  className={`relative w-20 h-20 rounded cursor-pointer overflow-hidden flex-shrink-0 border-2 ${
                    showVideo ? 'border-secondary' : 'border-transparent'
                  } bg-black flex items-center justify-center`}
                  onClick={toggleVideo}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-primary border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Project description */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {project.description}
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="text-xl font-bold mb-4">Design Approach</h3>
              <p className="text-gray-700">
                Our design team worked closely with the client to create a space that perfectly 
                blends functionality with aesthetic appeal. The {project.style} style was chosen 
                to complement the client's taste and the architectural features of the space.
              </p>
            </div>
          </div>

          {/* Sidebar information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Project Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <PenTool className="w-5 h-5 mr-3 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Design Style</p>
                    <p className="font-medium">{project.style}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{project.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 mr-3 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Budget Range</p>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                  Request Similar Design
                </Button>
                
                <Link href="#get-estimate">
                  <Button variant="outline" className="w-full">
                    Get Price Estimate
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-3">Share This Project</h4>
                <div className="flex gap-2">
                  {/* Social share buttons would go here */}
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4">
                      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4">
                      <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4">
                      <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="w-4 h-4">
                      <path fill="currentColor" d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related projects Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would be populated with actual related projects */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="h-64 relative">
                  <img 
                    src="https://via.placeholder.com/400x300" 
                    alt="Related project" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Similar Design Project</h3>
                  <p className="text-gray-700 mb-4">Example description for a related interior design project.</p>
                  <Link href="/interiors">
                    <Button variant="link" className="p-0 h-auto text-primary hover:text-secondary">
                      View Project <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetail;