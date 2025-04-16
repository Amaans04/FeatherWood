import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Session ID for guest carts
const SESSION_ID = "guest-session";

interface CartItemWithProduct extends CartItem {
  product: Product | null;
}

interface CartContextType {
  cartItems: CartItem[];
  cartItemsWithProducts: CartItemWithProduct[];
  cartTotal: number;
  cartCount: number;
  addToCart: (item: { productId: number; quantity: number; sessionId?: string; userId?: number }) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartItemsWithProducts: [],
  cartTotal: 0,
  cartCount: 0,
  addToCart: () => {},
  updateCartItemQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isLoading: false,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Fetch cart items
  const { data: cartItemsWithProducts = [], isLoading, refetch } = useQuery<CartItemWithProduct[]>({
    queryKey: [`/api/cart?sessionId=${SESSION_ID}`],
  });
  
  // Extract cart items without products
  const cartItems = cartItemsWithProducts.map(item => ({
    id: item.id,
    userId: item.userId,
    sessionId: item.sessionId,
    productId: item.productId,
    quantity: item.quantity,
  }));
  
  // Calculate cart total
  const cartTotal = cartItemsWithProducts.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );
  
  // Calculate cart count (total quantity)
  const cartCount = cartItemsWithProducts.reduce(
    (count, item) => count + item.quantity,
    0
  );
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (item: { productId: number; quantity: number; sessionId?: string; userId?: number }) => {
      return apiRequest("POST", "/api/cart", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart?sessionId=${SESSION_ID}`] });
    }
  });
  
  // Update cart item quantity mutation
  const updateCartItemMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart?sessionId=${SESSION_ID}`] });
    }
  });
  
  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/cart/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart?sessionId=${SESSION_ID}`] });
    }
  });
  
  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => {
      return apiRequest("DELETE", `/api/cart?sessionId=${SESSION_ID}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart?sessionId=${SESSION_ID}`] });
    }
  });
  
  const addToCart = (item: { productId: number; quantity: number; sessionId?: string; userId?: number }) => {
    addToCartMutation.mutate({
      ...item,
      sessionId: item.sessionId || SESSION_ID
    });
  };
  
  const updateCartItemQuantity = (id: number, quantity: number) => {
    updateCartItemMutation.mutate({ id, quantity });
  };
  
  const removeFromCart = (id: number) => {
    removeFromCartMutation.mutate(id);
  };
  
  const clearCart = () => {
    clearCartMutation.mutate();
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsWithProducts,
        cartTotal,
        cartCount,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
