import React, { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ProductCategory } from "@shared/schema";

interface ProductFiltersProps {
  categories: ProductCategory[];
  materials: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ categories, materials }) => {
  const [, setLocation] = useLocation();
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    search.get("category") || null
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    search.get("material")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(search.get("minPrice") || "0"),
    parseInt(search.get("maxPrice") || "5000")
  ]);

  const applyFilters = () => {
    const newSearch = new URLSearchParams();
    
    if (selectedCategory) {
      newSearch.set("category", selectedCategory);
    }
    
    if (selectedMaterials.length > 0) {
      newSearch.set("material", selectedMaterials.join(","));
    }
    
    if (priceRange[0] > 0) {
      newSearch.set("minPrice", priceRange[0].toString());
    }
    
    if (priceRange[1] < 5000) {
      newSearch.set("maxPrice", priceRange[1].toString());
    }
    
    setLocation(`/furniture?${newSearch.toString()}`);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedMaterials([]);
    setPriceRange([0, 5000]);
    setLocation("/furniture");
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Filters</h3>
        {(selectedCategory || selectedMaterials.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000) && (
          <button 
            className="text-sm text-gray-500 flex items-center hover:text-primary"
            onClick={resetFilters}
          >
            <X className="w-4 h-4 mr-1" /> Clear All
          </button>
        )}
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox 
                id={`category-${category.id}`}
                checked={selectedCategory === category.slug}
                onCheckedChange={() => setSelectedCategory(
                  selectedCategory === category.slug ? null : category.slug
                )}
              />
              <label 
                htmlFor={`category-${category.id}`}
                className="ml-2 text-sm font-medium cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider 
          defaultValue={priceRange}
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-4"
        />
        <div className="flex justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      
      {/* Materials */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Material</h4>
        <div className="space-y-2">
          {materials.map((material) => (
            <div key={material} className="flex items-center">
              <Checkbox 
                id={`material-${material}`}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => toggleMaterial(material)}
              />
              <label 
                htmlFor={`material-${material}`}
                className="ml-2 text-sm font-medium cursor-pointer"
              >
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-accent"
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default ProductFilters;
