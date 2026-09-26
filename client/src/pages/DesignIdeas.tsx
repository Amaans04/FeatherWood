import { useState, useRef, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

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
          heroImage: "/design-ideas/living-room/contemporary-1.jpg",
        },
        {
          id: "traditional-living",
          title: "Traditional Indian Living Room",
          subtitle: "Heritage-inspired comfort and luxury",
          description: "A regal living room that celebrates Indian craftsmanship with ornate details, rich textiles, and classic furniture",
          heroImage: "/design-ideas/living-room/traditional-1.jpg",
        },
      ],
    },
    {
      id: "bedroom",
      title: "Bedroom",
      description: "Serene bedroom designs for rest, relaxation and rejuvenation",
      imageUrl: "/design-ideas/bedroom-cover.jpg",
      items: [],
    },
    {
      id: "kitchen",
      title: "Kitchen",
      description: "Beautifully designed kitchens that combine functionality with stunning aesthetics",
      imageUrl: "/design-ideas/kitchen-cover.jpg",
      items: [],
    },
    {
      id: "bathroom",
      title: "Bathroom",
      description: "Functional and stylish bathroom designs for everyday luxury",
      imageUrl: "/design-ideas/bathroom-cover.jpg",
      items: [],
    },
    {
      id: "dining-room",
      title: "Dining Room",
      description: "Elegant dining spaces perfect for family meals and entertaining guests",
      imageUrl: "/design-ideas/dining-room-cover.jpg",
      items: [],
    },
    {
      id: "home-office",
      title: "Home Office",
      description: "Productive workspace designs that inspire creativity and focus",
      imageUrl: "/design-ideas/home-office-cover.jpg",
      items: [],
    },
  ],
};

export default function DesignIdeas() {
  const { categories } = designIdeasData;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleItems, setVisibleItems] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || category.id === activeTab;
    return matchesSearch && matchesTab;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleItems < filteredCategories.length) {
          setVisibleItems((prev) => Math.min(prev + 3, filteredCategories.length));
        }
      },
      { threshold: 0.1 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [visibleItems, filteredCategories.length]);

  return (
    <PageLayout
      seo={{
        title: "Interior Design Ideas for Indian Homes",
        description:
          "Browse FeatherWood's curated interior design ideas — living rooms, bedrooms, kitchens, home offices & more. Get inspired for your dream home in Bengaluru.",
        canonical: "/design-ideas",
      }}
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Design Ideas" }]} />

      <PageHero
        label="Inspiration"
        title="Design Ideas"
        description="Explore our curated collection of luxury interior designs"
        image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80"
        imageAlt="Design ideas"
        align="center"
      />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="relative max-w-xl mx-auto mb-8">
            <Input
              type="search"
              placeholder="Search design ideas..."
              className="rounded-none bg-white border-[#E8E4DF] text-[#1A1A1A] pl-10 h-10 md:h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 md:top-3.5 text-[#8B7355]" size={20} />
          </div>

          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <div className="w-full overflow-x-auto pb-2 no-scrollbar mobile-scroll-x" data-lenis-prevent-wheel>
              <TabsList className="bg-[#FAFAF8] border border-[#E8E4DF] p-1 w-max min-w-full md:w-auto md:mx-auto rounded-none">
                {["all", "living-room", "bedroom", "kitchen", "bathroom", "dining-room", "home-office"].map(
                  (tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="text-xs md:text-sm py-1.5 px-3 rounded-none data-[state=active]:text-white data-[state=active]:bg-[#1A1A1A]"
                    >
                      {tab === "all"
                        ? "All"
                        : tab === "dining-room"
                          ? "Dining"
                          : tab === "home-office"
                            ? "Office"
                            : tab
                                .split("-")
                                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                .join(" ")}
                    </TabsTrigger>
                  )
                )}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredCategories.slice(0, visibleItems).map((category) => (
                  <Link href={`/design-ideas/${category.id}`} key={category.id}>
                    <div className="bg-white border border-[#E8E4DF] overflow-hidden transition-all hover:-translate-y-1 cursor-pointer h-full">
                      <div className="h-48 md:h-56 overflow-hidden">
                        <img
                          src={category.imageUrl}
                          alt={category.title}
                          className="w-full h-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <div className="p-4 md:p-5">
                        <h3 className="font-cormorant text-lg md:text-xl font-light mb-1 md:mb-2 text-[#1A1A1A]">
                          {category.title}
                        </h3>
                        <p className="text-[#6E6A66] text-xs md:text-sm line-clamp-2">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {visibleItems < filteredCategories.length && <div ref={loadMoreRef} className="h-10 mt-4" />}

              {visibleItems < filteredCategories.length && (
                <div className="flex justify-center mt-8 md:hidden">
                  <button
                    type="button"
                    onClick={() => setVisibleItems((prev) => Math.min(prev + 3, filteredCategories.length))}
                    className="luxury-btn"
                  >
                    Load More
                  </button>
                </div>
              )}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8 md:py-16">
                  <h3 className="font-cormorant text-xl md:text-2xl font-light mb-3 md:mb-4 text-[#1A1A1A]">
                    No results found
                  </h3>
                  <p className="text-[#6E6A66] text-sm mb-4 md:mb-6">Try different keywords or browse our categories</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveTab("all");
                    }}
                    className="luxury-btn"
                  >
                    Show All Categories
                  </button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {filteredCategories.length > 0 && (
        <section className="py-14 md:py-28 bg-[#FAFAF8] border-t border-[#E8E4DF]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-cormorant text-xl md:text-3xl font-light text-[#1A1A1A]">Featured Designs</h2>
              <Link href="/design-ideas/living-room">
                <span className="luxury-link cursor-pointer">View All</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories[0]?.items?.slice(0, 3).map((item) => (
                <Link href={`/design-ideas/living-room/${item.id}`} key={item.id}>
                  <div className="group relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={item.heroImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <h3 className="font-cormorant text-lg font-light text-white">{item.title}</h3>
                      <p className="text-white/70 text-xs">{item.subtitle}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
