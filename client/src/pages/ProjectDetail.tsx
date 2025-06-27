import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Check,
  Calendar,
  MapPin,
  Square,
  PlaySquare,
  Image as ImageIcon,
  Users
} from "lucide-react";
import projectDetailsData from "@/data/projectDetails.json";
import LinkWithScroll from "@/components/LinkWithScroll";

// Define the type for projectDetailsData
type ProjectDetailsData = {
  [key: string]: ProjectDetailProps;
};

interface ProjectDetailProps {
  id: string;
  title: string;
  location: string;
  area: string;
  completionDate: string;
  client: string;
  heroImage: string;
  description: string;
  challenge: string;
  solution: string;
  features: {
    title: string;
    description: string;
  }[];
  testimonial: {
    text: string;
    author: string;
    role: string;
  };
  galleryImages: {
    url: string;
    caption: string;
  }[];
  videos: {
    url: string;
    title: string;
    thumbnail: string;
  }[];
  relatedProjects: string[];
}

export default function ProjectDetail() {
  const [, params] = useRoute('/projects/:id');
  const projectId = params?.id;
  
  const [projectData, setProjectData] = useState<ProjectDetailProps | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (projectId) {
      // Fix the TypeScript issue by properly typing projectDetailsData
      const typedProjectDetailsData = projectDetailsData as ProjectDetailsData;
      
      if (projectId in typedProjectDetailsData) {
        setProjectData(typedProjectDetailsData[projectId]);
        
        if (typedProjectDetailsData[projectId]?.relatedProjects) {
          const related = typedProjectDetailsData[projectId].relatedProjects
            .map((id: string) => {
              const relatedProject = typedProjectDetailsData[id];
              if (relatedProject) {
                return {
                  title: relatedProject.title,
                  location: relatedProject.location,
                  imageUrl: relatedProject.heroImage,
                  link: `/projects/${id}`
                };
              }
              return null;
            })
            .filter(Boolean);
            
          setRelatedProjects(related || []);
        }
      }
    }
  }, [projectId]);
  
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const handlePrevImage = () => {
    if (!projectData) return;
    setSelectedImageIndex((prev) => 
      prev === 0 ? projectData.galleryImages.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    if (!projectData) return;
    setSelectedImageIndex((prev) => 
      prev === projectData.galleryImages.length - 1 ? 0 : prev + 1
    );
  };
  
  if (!projectData) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Project not found</h1>
          <p className="mb-6">The project you're looking for doesn't exist or hasn't been created yet.</p>
          <LinkWithScroll href="/#projects">
            <Button>
              Back to Projects
            </Button>
          </LinkWithScroll>
        </div>
        <Footer />
      </>
    );
  }
  
  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  return (
    <>
      <Helmet>
        <title>{projectData.title} | FeatherWood Projects</title>
        <meta name="description" content={projectData.description} />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-[#0A0A0A]">
        {/* Hero Section */}
        <section className="relative">
          <div className="h-[50vh] md:h-[70vh] w-full relative">
            <div className="absolute inset-0 bg-black/60"></div>
            <img 
              src={projectData.heroImage} 
              alt={projectData.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-3">
                    {projectData.title}
                  </h1>
                  <p className="text-lg md:text-xl text-[#E5E5E5]">
                    {projectData.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Project Details */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Project Overview */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-8 bg-[#222222] p-1 rounded-sm">
                    <TabsTrigger value="overview" className="rounded-sm data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="rounded-sm data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                      Gallery
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="rounded-sm data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                      Videos
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="focus-visible:outline-none focus-visible:ring-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-4">
                          Project Overview
                        </h2>
                        <p className="text-[#C4C4C4] leading-relaxed">
                          {projectData.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xl font-playfair font-semibold mb-4">
                            The Challenge
                          </h3>
                          <p className="text-[#C4C4C4] leading-relaxed">
                            {projectData.challenge}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-playfair font-semibold mb-4">
                            Our Solution
                          </h3>
                          <p className="text-[#C4C4C4] leading-relaxed">
                            {projectData.solution}
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-8 bg-[#333]" />
                      
                      <div>
                        <h3 className="text-xl font-playfair font-semibold mb-6">
                          Key Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {projectData.features.map((feature, index) => (
                            <div key={index} className="flex">
                              <div className="flex-shrink-0 mt-1">
                                <Check className="h-5 w-5 text-[#FFD700]" />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-lg font-medium">{feature.title}</h4>
                                <p className="text-[#C4C4C4] text-sm">{feature.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {projectData.testimonial && (
                        <>
                          <Separator className="my-8 bg-[#333]" />
                          
                          <div>
                            <h3 className="text-xl font-playfair font-semibold mb-4">
                              Client Testimonial
                            </h3>
                            <div className="bg-[#222] p-6 rounded-sm">
                              <p className="text-[#E5E5E5] italic mb-4">"{projectData.testimonial.text}"</p>
                              <div>
                                <div className="text-[#FFD700] font-medium">{projectData.testimonial.author}</div>
                                <div className="text-[#C4C4C4] text-sm">{projectData.testimonial.role}</div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Gallery Tab */}
                  <TabsContent value="gallery" className="focus-visible:outline-none focus-visible:ring-0">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-6">
                        Project Gallery
                      </h2>
                      
                      {/* Main Image Display */}
                      <div className="mb-6 relative">
                        <div className="aspect-video relative overflow-hidden rounded-sm">
                          <img 
                            src={projectData.galleryImages[selectedImageIndex].url} 
                            alt={projectData.galleryImages[selectedImageIndex].caption} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Navigation Arrows */}
                        <button 
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black rounded-full flex items-center justify-center"
                          aria-label="Previous image"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        
                        <button 
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black rounded-full flex items-center justify-center"
                          aria-label="Next image"
                        >
                          <ArrowRight size={20} />
                        </button>
                        
                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-sm">
                            {projectData.galleryImages[selectedImageIndex].caption}
                          </p>
                        </div>
                      </div>
                      
                      {/* Thumbnail Grid */}
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
                        {projectData.galleryImages.map((image, index) => (
                          <div 
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`aspect-square rounded-sm overflow-hidden cursor-pointer transition-all ${
                              selectedImageIndex === index ? 'ring-2 ring-[#FFD700]' : ''
                            }`}
                          >
                            <img 
                              src={image.url} 
                              alt={image.caption} 
                              className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Videos Tab */}
                  <TabsContent value="videos" className="focus-visible:outline-none focus-visible:ring-0">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-6">
                        Project Videos
                      </h2>
                      
                      {projectData.videos.length > 0 ? (
                        <div className="space-y-8">
                          {projectData.videos.map((video, index) => (
                            <div key={index} className="space-y-4">
                              <h3 className="text-xl font-medium">{video.title}</h3>
                              <div className="aspect-video rounded-sm overflow-hidden">
                                <iframe
                                  ref={videoRef}
                                  width="100%"
                                  height="100%"
                                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(video.url)}`}
                                  title={video.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <PlaySquare className="h-12 w-12 text-[#555] mx-auto mb-4" />
                          <p className="text-[#C4C4C4]">No videos available for this project</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right Column - Project Details Sidebar */}
              <div>
                <div className="bg-[#222222] rounded-sm p-6 mb-8 sticky top-4">
                  <h3 className="text-xl font-playfair font-semibold mb-6">
                    Project Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#FFD700] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-[#C4C4C4]">Location</div>
                        <div className="font-medium">{projectData.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Square className="h-5 w-5 text-[#FFD700] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-[#C4C4C4]">Area</div>
                        <div className="font-medium">{projectData.area}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-[#FFD700] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-[#C4C4C4]">Completion Date</div>
                        <div className="font-medium">{projectData.completionDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-[#FFD700] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-[#C4C4C4]">Client</div>
                        <div className="font-medium">{projectData.client}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-[#333]" />
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={() => setActiveTab('gallery')}
                      variant="outline"
                      className="flex-1 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Gallery
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab('videos')}
                      variant="outline"
                      className="flex-1 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
                    >
                      <PlaySquare className="mr-2 h-4 w-4" />
                      Videos
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <LinkWithScroll href="/user-info">
                      <Button className="w-full bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium">
                        Book a Consultation
                      </Button>
                    </LinkWithScroll>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="mt-16">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-4">
                    Related Projects
                  </h2>
                  <div className="w-24 h-1 bg-[#FFD700]"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedProjects.map((project, index) => (
                    <LinkWithScroll key={index} href={project.link}>
                      <div className="rounded-sm overflow-hidden transition-all card-hover">
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-all hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                            <h3 className="font-playfair text-xl font-semibold mb-1">{project.title}</h3>
                            <p className="text-[#C4C4C4] text-sm">{project.location}</p>
                          </div>
                        </div>
                      </div>
                    </LinkWithScroll>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
} 