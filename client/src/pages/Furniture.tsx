import React, { useState } from 'react';
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link, useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import QuantityControl from '@/components/QuantityControl';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

// Import furniture data
import furnitureData from '@/data/furniture.json';

export default function Furniture() {
  const [location] = useLocation();
  const params = useParams();
  const categoryId = params.categoryId;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { addToCart } = useCart();
  
  // Determine if we're on a category page
  const isCategoryPage = !!categoryId;
  
  // Find the selected category if we're on a category page
  const selectedCategory = isCategoryPage
    ? furnitureData.categories.find(cat => cat.id === categoryId)
    : null;
    
  // Filter main categories for the main furniture page
  const filteredCategories = furnitureData.categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter products for category pages
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

  // Handle adding item to cart
  const handleAddToCart = (product: any, quantity: number) => {
    // Add the item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discountedPrice,
        image: product.mainImage
      });
    }
  };

  // If on a category page and category not found
  if (isCategoryPage && !selectedCategory) {
    return (
      <PageLayout seo={{ title: "Category Not Found", description: "Furniture category not found.", noIndex: true }}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <h1 className="font-cormorant text-2xl md:text-3xl font-light mb-4">Category not found</h1>
            <p className="text-[#6E6A66] mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/furniture"><span className="luxury-btn cursor-pointer">View All Furniture</span></Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const heroImage = isCategoryPage
    ? selectedCategory!.image
    : "https://images.unsplash.com/photo-1555041469-a586c638eaf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  return (
    <PageLayout
      seo={{
        title: isCategoryPage ? `${selectedCategory!.name} in Bengaluru` : "Luxury Furniture in Bengaluru",
        description: isCategoryPage
          ? `${selectedCategory!.description} Shop ${selectedCategory!.name.toLowerCase()} at FeatherWood showrooms in Whitefield, Bengaluru.`
          : "Shop FeatherWood furniture in Bengaluru — sofas, beds, dining tables, wardrobes, tables and chairs, made for modern Indian homes.",
        canonical: isCategoryPage ? `/furniture/${categoryId}` : "/furniture",
        structuredData: isCategoryPage
          ? {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${selectedCategory!.name} by FeatherWood`,
              itemListElement: selectedCategory!.products.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: product.name,
                url: `https://www.featherwood.in/furniture/${selectedCategory!.id}/${encodeURIComponent(product.id)}`,
              })),
            }
          : {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "FeatherWood furniture collections",
              itemListElement: furnitureData.categories.map((category, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: category.name,
                url: `https://www.featherwood.in/furniture/${category.id}`,
              })),
            },
      }}
    >
      <Breadcrumbs
        items={
          isCategoryPage
            ? [{ label: "Home", href: "/" }, { label: "Furniture", href: "/furniture" }, { label: selectedCategory!.name }]
            : [{ label: "Home", href: "/" }, { label: "Furniture" }]
        }
      />

      <PageHero
        label="Collection"
        title={isCategoryPage ? selectedCategory!.name : "Luxury Furniture Collection"}
        description={
          isCategoryPage
            ? selectedCategory!.description
            : "Handcrafted with precision and designed for comfort, our furniture adds elegance to any space."
        }
        image={heroImage}
        align="center"
      />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="relative max-w-xl mx-auto mb-8">
              <Input
                type="search"
                placeholder={`Search ${isCategoryPage ? selectedCategory?.name.toLowerCase() : 'categories'}...`}
                className="bg-white border-[#E8E4DF] text-[#1A1A1A] placeholder:text-[#6E6A66] pl-10 h-10 md:h-12 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 md:top-3.5 text-[#8B7355]" size={20} />
            </div>

        {!isCategoryPage && (
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-[#FAFAF8] border border-[#E8E4DF] p-1 w-max min-w-full md:w-auto md:mx-auto mb-8 rounded-full">
                  <TabsTrigger 
                    value="all" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#1A1A1A] data-[state=active]:bg-[#8B7355]"
                  >
                    All
                  </TabsTrigger>
                  {furnitureData.categories.map(category => (
                    <TabsTrigger 
                      key={category.id}
                      value={category.id} 
                      className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#1A1A1A] data-[state=active]:bg-[#8B7355]"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {(activeTab === 'all' ? filteredCategories : filteredCategories.filter(cat => cat.id === activeTab)).map((category) => (
                      <Link href={`/furniture/${category.id}`} key={category.id}>
                        <div className="bg-[#FAFAF8] border border-[#E8E4DF] rounded-card overflow-hidden transition-all hover:shadow-soft hover:-translate-y-1 cursor-pointer h-full">
                          <div className="h-48 md:h-60 overflow-hidden">
                            <img 
                              src={category.image} 
                              alt={category.name} 
                              className="w-full h-full object-cover transition-all hover:scale-105"
                            />
                          </div>
                          <div className="p-4 md:p-5">
                            <h3 className="font-cormorant text-lg md:text-xl font-semibold mb-1 md:mb-2 text-[#1A1A1A]">{category.name}</h3>
                            <p className="text-[#6E6A66] text-xs md:text-sm line-clamp-2 mb-3">{category.description}</p>
                            <div className="flex items-center">
                              <span className="text-[#8B7355] text-xs">{category.products ? category.products.length : 0} products</span>
                              <ArrowRight className="ml-2 h-4 w-4 text-[#8B7355]" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* No Results Found */}
                  {(activeTab === 'all' ? filteredCategories.length === 0 : filteredCategories.filter(cat => cat.id === activeTab).length === 0) && (
                    <div className="text-center py-8 md:py-16">
                      <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">No results found</h3>
                      <p className="text-[#6E6A66] text-sm mb-4 md:mb-6">Try different keywords or browse our categories</p>
                      <Button 
                        onClick={() => {
                          setSearchTerm("");
                          setActiveTab("all");
                        }}
                        className="bg-[#8B7355] hover:bg-[#6E5A42] text-[#1A1A1A] text-sm"
                      >
                        Show All Categories
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
        )}

        {isCategoryPage && (
          <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => {
                  const [quantity, setQuantity] = useState(1);
                  
                  return (
                    <div key={product.id} className="bg-[#FAFAF8] border border-[#E8E4DF] rounded-card overflow-hidden transition-all hover:shadow-soft hover:-translate-y-1 h-full">
                      <Link href={`/furniture/${categoryId}/${product.id}`}>
                        <div className="relative h-48 md:h-60 overflow-hidden">
                          <img 
                            src={product.mainImage} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-all hover:scale-105"
                          />
                          {product.isNew && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-[#8B7355] text-[#0A0A0A] font-medium">New</Badge>
                            </div>
                          )}
                          {product.isBestseller && (
                            <div className={`absolute top-3 ${product.isNew ? 'left-16' : 'left-3'}`}>
                              <Badge className="bg-[#8B7355] text-[#0A0A0A] font-medium">Bestseller</Badge>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4 md:p-5">
                        <Link href={`/furniture/${categoryId}/${product.id}`}>
                          <h3 className="font-cormorant text-lg md:text-xl font-semibold mb-1 text-[#1A1A1A]">{product.name}</h3>
                        </Link>
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
                        <div className="flex flex-wrap gap-1 mt-2 mb-4">
                          {product.tags && product.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-[#6E6A66] border-[#E8E4DF] text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <QuantityControl
                            quantity={quantity}
                            onIncrement={() => setQuantity(prev => Math.min(prev + 1, 99))}
                            onDecrement={() => setQuantity(prev => Math.max(prev - 1, 1))}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCart(product, quantity)}
                            className="flex items-center gap-2 bg-[#8B7355] hover:bg-[#6E5A42] text-[#1A1A1A] px-4 py-2 rounded-md text-sm font-medium"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          </>
        )}
        </div>
      </section>
    </PageLayout>
  );
}