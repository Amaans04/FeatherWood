import React, { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Star, StarHalf, Minus, Plus, Heart, ShoppingCart, ArrowLeft, Check, Truck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";

const formatPrice = (price: number): string => {
  return `$${(price / 100).toFixed(2)}`;
};

const renderStars = (rating: number = 0) => {
  // Convert rating from 0-50 to 0-5 scale
  const normalizedRating = rating / 10;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  
  return (
    <div className="flex text-accent">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="fill-current" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} />
      ))}
      <span className="text-gray-500 text-sm ml-1">({(normalizedRating).toFixed(1)})</span>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${params.slug}`],
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        quantity,
        sessionId: "guest-session" // In a real app, you'd use a proper session ID
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product.id);
      
      toast({
        title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.name} has been ${isInWishlist(product.id) ? "removed from" : "added to"} your wishlist.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="animate-pulse bg-gray-200 h-[500px] rounded-lg"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for could not be found or has been removed.</p>
        <Button asChild>
          <Link href="/furniture">Back to Furniture Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background py-10">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
            <Link href="/furniture">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Furniture
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={product.imageUrls?.[0] || "https://via.placeholder.com/600"} 
                alt={product.name} 
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Additional images would go here */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {product.imageUrls.slice(0, 4).map((img, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden cursor-pointer">
                    <img src={img} alt={`${product.name} - view ${index + 1}`} className="w-full h-24 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            {product.isNew && (
              <span className="inline-block bg-accent text-white text-xs px-3 py-1 rounded-full mb-2">New Arrival</span>
            )}
            {product.salePrice && (
              <span className="inline-block bg-secondary text-white text-xs px-3 py-1 rounded-full mb-2 ml-2">Sale</span>
            )}
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              {renderStars(product.rating)}
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-primary mr-3">{formatPrice(product.price)}</span>
              {product.salePrice && (
                <span className="text-lg text-gray-500 line-through">{formatPrice(product.salePrice)}</span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Specifications:</h3>
              <ul className="space-y-2">
                {product.material && (
                  <li className="flex"><span className="font-medium w-32">Material:</span> {product.material}</li>
                )}
                {product.dimensions && (
                  <li className="flex"><span className="font-medium w-32">Dimensions:</span> {product.dimensions}</li>
                )}
                {product.color && (
                  <li className="flex"><span className="font-medium w-32">Color:</span> {product.color}</li>
                )}
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Quantity:</h3>
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-12 h-9 text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-primary hover:bg-accent text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isInWishlist(product.id) ? "fill-secondary text-secondary" : ""}`} /> 
                  {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </div>
            
            <Card className="bg-gray-50 p-4 mt-6">
              <div className="flex items-start space-x-3">
                <Truck className="text-accent h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $1000</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-start space-x-3">
                <Check className="text-accent h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium">In Stock</h4>
                  <p className="text-sm text-gray-600">Ships within 1-2 business days</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
