import React, { useState } from 'react';
import { Link, useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
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
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">Category not found</h1>
            <p className="text-[#C4C4C4] mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/furniture">
              <Button className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                View All Furniture
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{selectedCategory.name} | Featherwood</title>
        <meta 
          name="description" 
          content={`Explore our exclusive collection of ${selectedCategory.name.toLowerCase()} crafted with precision and designed for modern luxury homes.`}
        />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-[#0A0A0A]">
        {/* Hero Section */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-[#C4C4C4] mb-8">
              <Link href="/furniture">
                <span className="hover:text-[#FFD700] cursor-pointer">Furniture</span>
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{selectedCategory.name}</span>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3">
                {selectedCategory.name}
              </h1>
              <p className="text-[#C4C4C4] max-w-3xl mx-auto text-sm md:text-lg">
                {selectedCategory.description}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Input
                type="search"
                placeholder={`Search ${selectedCategory.name.toLowerCase()}...`}
                className="bg-[#222222] border-[#444] text-white pl-10 h-10 md:h-12 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 md:top-3.5 text-[#888]" size={20} />
            </div>
          </div>
        </section>
        
        {/* Product Listing */}
        <section className="bg-[#151515] py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/furniture/${categoryId}/${product.id}`} key={product.id}>
                  <div className="bg-[#222222] rounded-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
                    <div className="relative h-48 md:h-60 overflow-hidden">
                      <img 
                        src={product.mainImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-all hover:scale-105"
                      />
                      {product.isNew && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#FFD700] text-[#0A0A0A] font-medium">New</Badge>
                        </div>
                      )}
                      {product.isBestseller && (
                        <div className={`absolute top-3 ${product.isNew ? 'left-16' : 'left-3'}`}>
                          <Badge className="bg-[#FFD700] text-[#0A0A0A] font-medium">Bestseller</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-playfair text-lg md:text-xl font-semibold mb-1">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                          <span className="ml-1 text-white text-sm">{product.rating}</span>
                        </div>
                        <span className="mx-2 text-[#555]">|</span>
                        <span className="text-[#C4C4C4] text-xs">{product.reviews} reviews</span>
                      </div>
                      <p className="text-[#C4C4C4] text-xs md:text-sm line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-baseline mb-1">
                        <span className="text-[#FFD700] font-bold text-lg">{formatPrice(product.discountedPrice)}</span>
                        {product.price > product.discountedPrice && (
                          <span className="ml-2 text-[#888] line-through text-sm">{formatPrice(product.price)}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags && product.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-[#C4C4C4] border-[#444] text-xs">
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
                <p className="text-[#C4C4C4] text-sm mb-4 md:mb-6">Try different keywords or browse other categories</p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="bg-[#FFD700] hover:bg-[#D4AF37] text-black text-sm mr-3"
                >
                  Clear Search
                </Button>
                <Link href="/furniture">
                  <Button 
                    className="bg-transparent border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 text-sm"
                  >
                    Back to Categories
                  </Button>
                </Link>
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