import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { useRoute, Link } from "wouter";
import designIdeasData from "@/data/designideas.json";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight,
  Grid3X3,
  MonitorSmartphone,
  PanelLeft,
  BookOpen,
  ChevronRight,
  Check
} from "lucide-react";

import designIdeasDetails from "@/data/designIdeasDetails.json";

interface DesignIdeaDetailProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  galleryImages: {
    url: string;
    caption: string;
  }[];
  features: {
    title: string;
    description: string;
  }[];
  testimonials: {
    text: string;
    author: string;
    location: string;
  }[];
  relatedCategories: string[];
}

export default function DesignIdeasDetail() {
  const [, params] = useRoute('/design-ideas/:id');
  const designId = params?.id;
  
  const [designData, setDesignData] = useState<DesignIdeaDetailProps | null>(null);
  const [relatedDesigns, setRelatedDesigns] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'grid' | 'slider'>('grid');
  
  useEffect(() => {
    if (designId && designId in designIdeasDetails) {
      // @ts-ignore - We know this exists based on the check above
      setDesignData(designIdeasDetails[designId]);
      
      if (designIdeasDetails[designId as keyof typeof designIdeasDetails]?.relatedCategories) {
        const related = designIdeasDetails[designId as keyof typeof designIdeasDetails].relatedCategories
          .map(id => designIdeasData.categories.find(cat => cat.id === id))
          .filter(Boolean);
          
        setRelatedDesigns(related || []);
      }
    }
  }, [designId]);
  
  if (!designData) {
    return (
      <PageLayout seo={{ title: "Design Not Found", description: "Design idea not found.", noIndex: true }}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <h1 className="font-cormorant text-2xl font-light mb-4 text-[#1A1A1A]">Design idea not found</h1>
            <p className="text-[#6E6A66] mb-6">The design idea you're looking for doesn't exist or hasn't been created yet.</p>
            <Link href="/design-ideas"><span className="luxury-btn cursor-pointer">Back to Design Ideas</span></Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      seo={{
        title: designData.title,
        description: designData.description,
        canonical: `/design-ideas/${designId}`,
        ogImage: designData.heroImage,
      }}
    >
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Design Ideas", href: "/design-ideas" },
          { label: designData.title },
        ]}
      />

      <PageHero
        label="Design Ideas"
        title={designData.title}
        description={designData.subtitle}
        image={designData.heroImage}
        imageAlt={designData.title}
      />

      <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-3/4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-white mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="p-0">
                    <div className="prose prose-lg prose-invert max-w-none">
                      <h2 className="text-2xl font-semibold mb-4 font-cormorant">{designData.title} by FeatherWood</h2>
                      <p className="text-[#6E6A66] mb-8">{designData.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        {designData.galleryImages.slice(0, 4).map((image, index) => (
                          <div key={index} className="rounded-sm overflow-hidden group">
                            <div className="h-64 relative">
                              <img 
                                src={image.url} 
                                alt={image.caption} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm">{image.caption}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-10">
                        <h3 className="text-xl font-semibold mb-6 font-cormorant">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {designData.features.map((feature, index) => (
                            <div key={index} className="flex">
                              <div className="flex-shrink-0 mt-1">
                                <Check className="h-5 w-5 text-[#8B7355]" />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-lg font-medium">{feature.title}</h4>
                                <p className="text-[#6E6A66] text-sm">{feature.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-12">
                        <h3 className="text-xl font-semibold mb-6 font-cormorant">What Our Clients Say</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {designData.testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-sm">
                              <p className="text-[#6E6A66] italic mb-4">"{testimonial.text}"</p>
                              <div className="text-[#8B7355] font-medium">{testimonial.author}</div>
                              <div className="text-[#6E6A66] text-sm">{testimonial.location}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gallery" className="p-0">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-semibold font-cormorant">{designData.title} Gallery</h2>
                      <div className="flex items-center space-x-2 bg-white rounded-md">
                        <Button 
                          variant={activeView === 'grid' ? 'default' : 'ghost'} 
                          size="icon"
                          onClick={() => setActiveView('grid')}
                          className={activeView === 'grid' ? 'bg-[#8B7355] text-black hover:bg-[#6E5A42]' : ''}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={activeView === 'slider' ? 'default' : 'ghost'}
                          size="icon"
                          onClick={() => setActiveView('slider')}
                          className={activeView === 'slider' ? 'bg-[#8B7355] text-black hover:bg-[#6E5A42]' : ''}
                        >
                          <PanelLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {activeView === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {designData.galleryImages.map((image, index) => (
                          <div key={index} className="rounded-sm overflow-hidden group">
                            <div className="h-64 relative">
                              <img 
                                src={image.url} 
                                alt={image.caption}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm">{image.caption}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-6">
                        {designData.galleryImages.map((image, index) => (
                          <div key={index} className="flex flex-col md:flex-row bg-white rounded-sm overflow-hidden">
                            <div className="md:w-1/2 h-64">
                              <img 
                                src={image.url} 
                                alt={image.caption}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="md:w-1/2 p-6 flex flex-col justify-center">
                              <h3 className="text-xl font-semibold mb-2 font-cormorant">{image.caption}</h3>
                              <p className="text-[#6E6A66]">
                                Beautiful design with attention to detail and quality craftsmanship.
                              </p>
                              <Button variant="link" className="text-[#8B7355] p-0 mt-4 self-start">
                                Get this design <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="features" className="p-0">
                    <h2 className="text-2xl font-semibold mb-8 font-cormorant">Features & Benefits</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {designData.features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-sm flex flex-col h-full">
                          <h3 className="text-xl font-semibold mb-3 font-cormorant text-[#8B7355]">{feature.title}</h3>
                          <p className="text-[#6E6A66] text-sm flex-grow">{feature.description}</p>
                          <div className="mt-6 pt-4 border-t border-[#E8E4DF]">
                            <Button variant="link" className="text-[#8B7355] p-0">
                              Learn more <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-12 bg-white p-8 rounded-sm">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                          <h3 className="text-2xl font-semibold mb-4 font-cormorant">Ready to get started?</h3>
                          <p className="text-[#6E6A66]">
                            Schedule a free consultation with our design experts to create your dream {designData.title.toLowerCase()}.
                          </p>
                        </div>
                        <div className="md:w-1/3 text-center md:text-right">
                          <Button className="bg-[#8B7355] text-black hover:bg-[#6E5A42]">
                            Book Free Design Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="md:w-1/4">
                <div className="bg-white p-6 rounded-sm mb-6">
                  <h3 className="text-lg font-semibold mb-4">Why Choose FeatherWood</h3>
                  <ul className="text-[#6E6A66] text-sm space-y-3">
                    <li className="flex">
                      <Check className="h-5 w-5 text-[#8B7355] flex-shrink-0 mr-2" />
                      <span>10+ years of design experience</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-[#8B7355] flex-shrink-0 mr-2" />
                      <span>Premium materials and finishes</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-[#8B7355] flex-shrink-0 mr-2" />
                      <span>45-day installation guarantee</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-[#8B7355] flex-shrink-0 mr-2" />
                      <span>5-year warranty on all products</span>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-[#8B7355] flex-shrink-0 mr-2" />
                      <span>100% satisfaction guarantee</span>
                    </li>
                  </ul>
                  
                  <Separator className="my-6 bg-[#333]" />
                  
                  <div className="text-center">
                    <Link href="/user-info">
                      <Button className="w-full bg-[#8B7355] text-black hover:bg-[#6E5A42]">
                        Get Free Quote
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {relatedDesigns.length > 0 && (
                  <div className="bg-white p-6 rounded-sm">
                    <h3 className="text-lg font-semibold mb-4">Related Designs</h3>
                    <div className="space-y-4">
                      {relatedDesigns.map((design, index) => (
                        <Link key={index} href={`/design-ideas/${design.id}`}>
                          <div className="group cursor-pointer">
                            <div className="h-24 overflow-hidden rounded-sm mb-2">
                              <img 
                                src={design.image} 
                                alt={design.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <h4 className="text-sm font-medium group-hover:text-[#8B7355] transition-colors">
                              {design.title}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* You Might Also Like */}
        <section className="py-12 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <h2 className="text-2xl font-semibold font-cormorant mb-8 text-white">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {designIdeasData.categories
                .filter((cat) => cat.id !== designId)
                .slice(0, 3)
                .map((category) => (
                  <Link key={category.id} href={`/design-ideas/${category.id}`}>
                    <div className="group cursor-pointer bg-white rounded-sm overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={category.imageUrl}
                          alt={`${category.title} design ideas by FeatherWood`}
                          width={400}
                          height={300}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-white group-hover:text-[#8B7355] transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-[#6E6A66] text-sm mt-1 line-clamp-2">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-2xl font-semibold font-cormorant">Ready to transform your space?</h2>
                <p className="text-[#6E6A66] mt-2">Book a free design consultation with our experts.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Download Brochure
                </Button>
                <Button className="bg-[#8B7355] text-black hover:bg-[#6E5A42]">
                  <MonitorSmartphone className="mr-2 h-4 w-4" />
                  Book Video Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
  );
}