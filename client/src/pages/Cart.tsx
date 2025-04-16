import React from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";

const formatPrice = (price: number): string => {
  return `$${(price / 100).toFixed(2)}`;
};

const Cart: React.FC = () => {
  const { 
    cartItems, 
    cartItemsWithProducts, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    cartTotal
  } = useCart();

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity >= 1) {
      updateCartItemQuantity(id, quantity);
    }
  };

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Button asChild>
                  <Link href="/furniture">Start Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItemsWithProducts.map((item) => (
                      <React.Fragment key={item.id}>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <Link href={`/furniture/${item.product?.slug}`}>
                              <a className="block">
                                <img 
                                  src={item.product?.imageUrls?.[0] || "https://via.placeholder.com/100"} 
                                  alt={item.product?.name} 
                                  className="w-24 h-24 object-cover rounded-md"
                                />
                              </a>
                            </Link>
                          </div>
                          
                          <div className="flex-grow">
                            <Link href={`/furniture/${item.product?.slug}`}>
                              <a className="font-medium hover:underline">{item.product?.name}</a>
                            </Link>
                            
                            {item.product?.material && (
                              <p className="text-sm text-gray-500">Material: {item.product.material}</p>
                            )}
                            
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  value={item.quantity} 
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                  className="w-12 h-8 text-center border-x-0 rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-semibold">
                                  {formatPrice((item.product?.price || 0) * item.quantity)}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeFromCart(item.id)}
                                  className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/furniture">
                      Continue Shopping
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{cartTotal >= 100000 ? 'Free' : formatPrice(999)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(cartTotal * 0.07)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(cartTotal + (cartTotal >= 100000 ? 0 : 999) + (cartTotal * 0.07))}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-primary hover:bg-accent">
                    <Link href="/checkout">
                      Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-4 bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">We Accept</h3>
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
