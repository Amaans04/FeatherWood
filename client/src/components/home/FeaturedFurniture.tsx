import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/furniture/ProductCard";
import { Product } from "@shared/schema";

const FeaturedFurniture: React.FC = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Collections</h2>
          <Link href="/furniture" className="text-primary hover:text-accent font-medium flex items-center">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-background rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading products. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedFurniture;
