import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
const designIdeasData = {
  categories: [
    {
      id: "living-room",
      title: "Living Room",
      description: "Curated living room designs that blend style, comfort, and functionality",
      imageUrl: "/design-ideas/living-room-cover.jpg",
      items: [
        {
          id: "contemporary-living",
          title: "Contemporary Living Room",
          subtitle: "Modern elegance with clean lines",
          description: "A sophisticated living room featuring neutral palette, sleek furniture, and statement lighting pieces",
          heroImage: "/design-ideas/living-room/contemporary-1.jpg"
        },
        {
          id: "traditional-living",
          title: "Traditional Indian Living Room",
          subtitle: "Heritage-inspired comfort and luxury",
          description: "A regal living room that celebrates Indian craftsmanship with ornate details, rich textiles, and classic furniture",
          heroImage: "/design-ideas/living-room/traditional-1.jpg"
        }
      ]
    },
    {
      id: "bedroom",
      title: "Bedroom",
      description: "Serene bedroom designs for rest, relaxation and rejuvenation",
      imageUrl: "/design-ideas/bedroom-cover.jpg",
      items: []
    },
    {
      id: "kitchen",
      title: "Kitchen",
      description: "Beautifully designed kitchens that combine functionality with stunning aesthetics",
      imageUrl: "/design-ideas/kitchen-cover.jpg",
      items: []
    },
    {
      id: "bathroom",
      title: "Bathroom",
      description: "Functional and stylish bathroom designs for everyday luxury",
      imageUrl: "/design-ideas/bathroom-cover.jpg",
      items: []
    },
    {
      id: "dining-room",
      title: "Dining Room",
      description: "Elegant dining spaces perfect for family meals and entertaining guests",
      imageUrl: "/design-ideas/dining-room-cover.jpg",
      items: []
    },
    {
      id: "home-office",
      title: "Home Office",
      description: "Productive workspace designs that inspire creativity and focus",
      imageUrl: "/design-ideas/home-office-cover.jpg",
      items: []
    }
  ]
};

export default function DesignIdeas() {
  const { categories } = designIdeasData;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleItems, setVisibleItems] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Filter categories based on search term and active tab
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || category.id === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Load more items on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleItems < filteredCategories.length) {
          setVisibleItems(prev => Math.min(prev + 3, filteredCategories.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [visibleItems, filteredCategories.length]);

  return (
    <>
      <Helmet>
        <title>Design Ideas | Featherwood</title>
        <meta name="description" content="Explore our curated collection of interior design ideas for every room in your home." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#0A0A0A] py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3">Design Ideas</h1>
              <p className="text-[#C4C4C4] max-w-3xl mx-auto text-sm md:text-lg">
                Explore our curated collection of luxury interior designs
              </p>
            </div>
            
            {/* Search Bar - Optimized for Mobile */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Input
                type="search"
                placeholder="Search design ideas..."
                className="bg-[#222222] border-[#444] text-white pl-10 h-10 md:h-12 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 md:top-3.5 text-[#888]" size={20} />
            </div>
            
            {/* Category Tabs - Mobile Optimized */}
            <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
              <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <TabsList className="bg-[#151515] p-1 w-max min-w-full md:w-auto md:mx-auto">
                  <TabsTrigger 
                    value="all" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="living-room" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    Living Room
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bedroom" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    Bedroom
                  </TabsTrigger>
                  <TabsTrigger 
                    value="kitchen" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    Kitchen
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bathroom" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    Bathroom
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dining-room" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    Dining
                  </TabsTrigger>
                  <TabsTrigger 
                    value="home-office" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    Office
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Design Ideas Grid - Mobile Optimized */}
              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredCategories.slice(0, visibleItems).map((category) => (
                    <Link href={`/design-ideas/${category.id}`} key={category.id}>
                      <div className="bg-[#222222] rounded-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
                        <div className="h-48 md:h-56 overflow-hidden">
                          <img 
                            src={category.imageUrl} 
                            alt={category.title} 
                            className="w-full h-full object-cover transition-all hover:scale-105"
                          />
                        </div>
                        <div className="p-4 md:p-5">
                          <h3 className="font-playfair text-lg md:text-xl font-semibold mb-1 md:mb-2">{category.title}</h3>
                          <p className="text-[#C4C4C4] text-xs md:text-sm line-clamp-2">{category.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Load More Trigger - Invisible element for intersection observer */}
                {visibleItems < filteredCategories.length && (
                  <div ref={loadMoreRef} className="h-10 mt-4"></div>
                )}
                
                {/* Manual Load More Button - Only shown on smaller screens */}
                {visibleItems < filteredCategories.length && (
                  <div className="flex justify-center mt-8 md:hidden">
                    <Button 
                      onClick={() => setVisibleItems(prev => Math.min(prev + 3, filteredCategories.length))}
                      className="bg-[#FFD700] hover:bg-[#D4AF37] text-black text-sm py-2 px-4"
                    >
                      Load More
                    </Button>
                  </div>
                )}
                
                {/* No Results Found */}
                {filteredCategories.length === 0 && (
                  <div className="text-center py-8 md:py-16">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">No results found</h3>
                    <p className="text-[#C4C4C4] text-sm mb-4 md:mb-6">Try different keywords or browse our categories</p>
                    <Button 
                      onClick={() => {
                        setSearchTerm("");
                        setActiveTab("all");
                      }}
                      className="bg-[#FFD700] hover:bg-[#D4AF37] text-black text-sm"
                    >
                      Show All Categories
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Featured Design Ideas - Appears only when there are results */}
        {filteredCategories.length > 0 && (
          <section className="bg-[#151515] py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-xl md:text-3xl font-semibold">Featured Designs</h2>
                <Link href="/design-ideas/living-room">
                  <span className="text-[#FFD700] hover:underline text-sm font-medium cursor-pointer">View All</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories[0]?.items?.slice(0, 3).map((item, index) => (
                  <Link href={`/design-ideas/living-room/${item.id}`} key={item.id}>
                    <div className="group relative h-48 md:h-64 overflow-hidden rounded-sm">
                      <img 
                        src={item.heroImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <h3 className="font-playfair text-lg font-semibold">{item.title}</h3>
                        <p className="text-[#C4C4C4] text-xs">{item.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
}