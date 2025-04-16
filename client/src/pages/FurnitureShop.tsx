import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductCategory } from "@shared/schema";
import ProductCard from "@/components/furniture/ProductCard";
import ProductFilters from "@/components/furniture/ProductFilters";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, FilterX } from "lucide-react";

const FurnitureShop: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [location] = useLocation();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  
  const categorySlug = searchParams.get('category');
  const material = searchParams.get('material');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  const queryString = Object.entries({
    category: categorySlug,
    material,
    minPrice,
    maxPrice
  })
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: [`/api/products${queryString ? `?${queryString}` : ''}`],
  });
  
  const { data: categories } = useQuery<ProductCategory[]>({
    queryKey: ["/api/categories"],
  });
  
  // Extract unique materials from products
  const uniqueMaterials = Array.from(
    new Set(
      products?.flatMap(product => product.material?.split(',').map(m => m.trim()) || []) || []
    )
  ).filter(Boolean);

  return (
    <div className="bg-background">
      <div className="container py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Shop Furniture</h1>
          <Button 
            variant="outline" 
            className="md:hidden"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterOpen ? <FilterX className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters - hidden on mobile by default */}
          <aside className={`${filterOpen ? 'block' : 'hidden'} md:block`}>
            {categories && (
              <ProductFilters 
                categories={categories} 
                materials={uniqueMaterials}
              />
            )}
          </aside>
          
          {/* Products */}
          <div className="md:col-span-3">
            {categorySlug && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 capitalize">
                  {categorySlug.replace('-', ' ')} Collection
                </h2>
                <p className="text-gray-600">
                  Browse our curated selection of premium {categorySlug.replace('-', ' ')}
                </p>
              </div>
            )}
            
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg h-96 animate-pulse"></div>
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or browse our categories</p>
                <Button asChild>
                  <a href="/furniture">View All Products</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureShop;
