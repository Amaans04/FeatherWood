import React from "react";
import { Link } from "wouter";
import { Eye, Heart, ShoppingCart, Star, StarHalf } from "lucide-react";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number): string => {
  return `$${(price / 100).toFixed(2)}`;
};

const renderStars = (rating: number = 0) => {
  // Convert rating from 0-50 to 0-5 scale
  const normalizedRating = rating / 10;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  
  return (
    <div className="flex text-accent mb-2">
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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
      sessionId: "guest-session" // In a real app, you'd generate or get this from somewhere
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    
    toast({
      title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isInWishlist(product.id) ? "removed from" : "added to"} your wishlist.`,
    });
  };

  return (
    <div className="group relative bg-background rounded-lg overflow-hidden card-shadow">
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrls?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-64 object-cover transition-all group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            className="bg-white text-primary hover:text-accent w-9 h-9 rounded-full flex items-center justify-center transition-all"
            onClick={handleToggleWishlist}
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-accent text-accent" : ""}`} />
          </button>
          <Link href={`/furniture/${product.slug}`}>
            <a className="bg-white text-primary hover:text-accent w-9 h-9 rounded-full flex items-center justify-center transition-all">
              <Eye className="w-5 h-5" />
            </a>
          </Link>
        </div>
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-white text-xs px-3 py-1 rounded-full">New</span>
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-3 left-3">
            <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full">Sale</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        {renderStars(product.rating)}
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.salePrice)}
              </span>
            )}
          </div>
          <button 
            className="bg-primary text-white hover:bg-accent px-3 py-2 rounded-md transition-all"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
