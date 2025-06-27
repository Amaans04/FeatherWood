import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
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
        <title>
          {isCategoryPage 
            ? `${selectedCategory?.name} | FeatherWood` 
            : 'Luxury Furniture Collection | FeatherWood'
          }
        </title>
        <meta 
          name="description" 
          content={isCategoryPage
            ? `Explore our exclusive collection of ${selectedCategory?.name.toLowerCase()} crafted with precision and designed for modern luxury homes.`
            : "Browse FeatherWood's exquisite furniture collection featuring handcrafted luxury pieces designed for modern living and built to last."
          }
        />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-[#0A0A0A]">
        {/* Hero Section */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            {/* Breadcrumbs for category pages */}
            {isCategoryPage && (
              <div className="flex items-center text-sm text-[#C4C4C4] mb-8">
                <Link href="/furniture">
                  <span className="hover:text-[#FFD700] cursor-pointer">Furniture</span>
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{selectedCategory?.name}</span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-3">
                {isCategoryPage
                  ? selectedCategory?.name
                  : 'Luxury Furniture Collection'
                }
              </h1>
              <p className="text-[#C4C4C4] max-w-3xl mx-auto text-sm md:text-lg">
                {isCategoryPage
                  ? selectedCategory?.description
                  : 'Handcrafted with precision and designed for comfort, our furniture adds elegance to any space.'
                }
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Input
                type="search"
                placeholder={`Search ${isCategoryPage ? selectedCategory?.name.toLowerCase() : 'categories'}...`}
                className="bg-[#222222] border-[#444] text-white pl-10 h-10 md:h-12 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 md:top-3.5 text-[#888]" size={20} />
            </div>
            
          </div>
        </section>
        
        {/* Show category tabs and grid for main furniture page */}
        {!isCategoryPage && (
          <section className="bg-[#151515] py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-[#151515] p-1 w-max min-w-full md:w-auto md:mx-auto mb-8">
                  <TabsTrigger 
                    value="all" 
                    className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                  >
                    All
                  </TabsTrigger>
                  {furnitureData.categories.map(category => (
                    <TabsTrigger 
                      key={category.id}
                      value={category.id} 
                      className="text-xs md:text-sm py-1.5 px-3 data-[state=active]:text-[#000000] data-[state=active]:bg-[#FFD700]"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {(activeTab === 'all' ? filteredCategories : filteredCategories.filter(cat => cat.id === activeTab)).map((category) => (
                      <Link href={`/furniture/${category.id}`} key={category.id}>
                        <div className="bg-[#222222] rounded-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
                          <div className="h-48 md:h-60 overflow-hidden">
                            <img 
                              src={category.image} 
                              alt={category.name} 
                              className="w-full h-full object-cover transition-all hover:scale-105"
                            />
                          </div>
                          <div className="p-4 md:p-5">
                            <h3 className="font-playfair text-lg md:text-xl font-semibold mb-1 md:mb-2">{category.name}</h3>
                            <p className="text-[#C4C4C4] text-xs md:text-sm line-clamp-2 mb-3">{category.description}</p>
                            <div className="flex items-center">
                              <span className="text-[#FFD700] text-xs">{category.products ? category.products.length : 0} products</span>
                              <ArrowRight className="ml-2 h-4 w-4 text-[#FFD700]" />
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
        )}
        
        {/* Show product grid for category pages */}
        {isCategoryPage && (
          <section className="bg-[#151515] py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => {
                  const [quantity, setQuantity] = useState(1);
                  
                  return (
                    <div key={product.id} className="bg-[#222222] rounded-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                      <Link href={`/furniture/${categoryId}/${product.id}`}>
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
                      </Link>
                      <div className="p-4 md:p-5">
                        <Link href={`/furniture/${categoryId}/${product.id}`}>
                          <h3 className="font-playfair text-lg md:text-xl font-semibold mb-1">{product.name}</h3>
                        </Link>
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
                        <div className="flex flex-wrap gap-1 mt-2 mb-4">
                          {product.tags && product.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-[#C4C4C4] border-[#444] text-xs">
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
                            className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#D4AF37] text-black px-4 py-2 rounded-md text-sm font-medium"
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
        )}
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
}