import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WishlistItem, Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// For demo purposes, use a fixed user ID
// In a real app, you would get this from authentication
const DEMO_USER_ID = 1;

interface WishlistItemWithProduct extends WishlistItem {
  product: Product | null;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistItemsWithProducts: WishlistItemWithProduct[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  wishlistItemsWithProducts: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  toggleWishlist: () => {},
  isInWishlist: () => false,
  isLoading: false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Fetch wishlist items
  const { data: wishlistItemsWithProducts = [], isLoading } = useQuery<WishlistItemWithProduct[]>({
    queryKey: [`/api/wishlist?userId=${DEMO_USER_ID}`],
    staleTime: 300000, // 5 minutes
  });
  
  // Extract wishlist items without products
  const wishlistItems = wishlistItemsWithProducts.map(item => ({
    id: item.id,
    userId: item.userId,
    productId: item.productId,
  }));
  
  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: number) => {
      return apiRequest("POST", "/api/wishlist", {
        userId: DEMO_USER_ID,
        productId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist?userId=${DEMO_USER_ID}`] });
    }
  });
  
  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: number) => {
      return apiRequest("DELETE", `/api/wishlist?userId=${DEMO_USER_ID}&productId=${productId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist?userId=${DEMO_USER_ID}`] });
    }
  });
  
  const addToWishlist = (productId: number) => {
    addToWishlistMutation.mutate(productId);
  };
  
  const removeFromWishlist = (productId: number) => {
    removeFromWishlistMutation.mutate(productId);
  };
  
  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.productId === productId);
  };
  
  const toggleWishlist = (productId: number) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };
  
  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistItemsWithProducts,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
