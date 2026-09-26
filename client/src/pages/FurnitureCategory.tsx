import React, { useState } from 'react';
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { Link, useParams } from 'wouter';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Import furniture data
import furnitureData from '@/data/furniture.json';

export default function FurnitureCategory() {
  const params = useParams();
  const categoryId = params.categoryId;
  const [searchTerm, setSearchTerm] = useState("");
  
  // Find the selected category
  const selectedCategory = furnitureData.categories.find(cat => cat.id === categoryId);
  
  // Filter products based on search term
  const filteredProducts = selectedCategory?.products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
    
  // Format price to INR currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // If category not found
  if (!selectedCategory) {
    return (
      <PageLayout seo={{ title: "Category Not Found", description: "Furniture category not found.", noIndex: true }}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <h1 className="font-cormorant text-2xl md:text-3xl font-light mb-4 text-[#1A1A1A]">Category not found</h1>
            <p className="text-[#6E6A66] mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/furniture">
              <span className="luxury-btn cursor-pointer">View All Furniture</span>
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.featherwood.in/" },
      { "@type": "ListItem", position: 2, name: "Furniture", item: "https://www.featherwood.in/furniture" },
      { "@type": "ListItem", position: 3, name: selectedCategory.name, item: `https://www.featherwood.in/furniture/${categoryId}` },
    ],
  };

  return (
    <PageLayout
      seo={{
        title: `${selectedCategory.name} — Luxury ${selectedCategory.name} Collection`,
        description: `Shop FeatherWood's premium ${selectedCategory.name.toLowerCase()} collection. ${selectedCategory.description}`,
        canonical: `/furniture/${categoryId}`,
        structuredData: breadcrumbSchema,
      }}
    >
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Furniture", href: "/furniture" },
          { label: selectedCategory.name },
        ]}
      />

      <PageHero
        label="Furniture"
        title={selectedCategory.name}
        description={selectedCategory.description}
        image={selectedCategory.image}
        imageAlt={selectedCategory.name}
      />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="relative max-w-xl mx-auto mb-8">
            <Input
              type="search"
              placeholder={`Search ${selectedCategory.name.toLowerCase()}...`}
              className="rounded-none bg-white border-[#E8E4DF] text-[#1A1A1A] placeholder:text-[#6E6A66] pl-10 h-10 md:h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 md:top-3.5 text-[#8B7355]" size={20} />
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/furniture/${categoryId}/${product.id}`} key={product.id}>
                  <div className="bg-[#FAFAF8] border border-[#E8E4DF] rounded-card overflow-hidden transition-all hover:shadow-soft hover:-translate-y-1 cursor-pointer h-full">
                    <div className="relative h-48 md:h-60 overflow-hidden">
                      <img 
                        src={product.mainImage} 
                        alt={`${product.name} — FeatherWood ${selectedCategory.name}`}
                        width={480}
                        height={360}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all hover:scale-105"
                      />
                      {product.isNew && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#8B7355] text-[#1A1A1A] font-medium">New</Badge>
                        </div>
                      )}
                      {product.isBestseller && (
                        <div className={`absolute top-3 ${product.isNew ? 'left-16' : 'left-3'}`}>
                          <Badge className="bg-[#8B7355] text-[#1A1A1A] font-medium">Bestseller</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-cormorant text-lg md:text-xl font-semibold mb-1 text-[#1A1A1A]">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-[#8B7355] text-[#8B7355]" />
                          <span className="ml-1 text-[#1A1A1A] text-sm">{product.rating}</span>
                        </div>
                        <span className="mx-2 text-[#6E6A66]">|</span>
                        <span className="text-[#6E6A66] text-xs">{product.reviews} reviews</span>
                      </div>
                      <p className="text-[#6E6A66] text-xs md:text-sm line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-baseline mb-1">
                        <span className="text-[#8B7355] font-bold text-lg">{formatPrice(product.discountedPrice)}</span>
                        {product.price > product.discountedPrice && (
                          <span className="ml-2 text-[#6E6A66] line-through text-sm">{formatPrice(product.price)}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags && product.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-[#6E6A66] border-[#E8E4DF] text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 md:py-16">
                <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">No products found</h3>
                <p className="text-[#6E6A66] text-sm mb-4 md:mb-6">Try different keywords or browse other categories</p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="bg-[#8B7355] hover:bg-[#6E5A42] text-[#1A1A1A] text-sm mr-3"
                >
                  Clear Search
                </Button>
                <Link href="/furniture">
                  <Button 
                    className="bg-transparent border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10 text-sm"
                  >
                    Back to Categories
                  </Button>
                </Link>
              </div>
            )}
          </div>
      </section>
    </PageLayout>
  );
} 