import React, { useState, useEffect } from 'react';
import { Link, useLocation, useRoute, useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  MessageCircle, 
  Share2, 
  Check, 
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Info
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuantityControl from '@/components/QuantityControl';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

// Add type definitions
interface Dimensions {
  length: number;
  width: number;
  height: number;
  seat_height?: number;
  unit: string;
}

interface ProductVariant {
  size: string;
  price: number;
  discountedPrice: number;
  dimensions: Dimensions;
  mainImage: string;
  gallery: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  details: string;
  mainImage: string;
  dimensions: Dimensions;
  materials: string[];
  colors: string[];
  gallery?: string[];
  features: string[];
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[];
  variants?: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

interface FurnitureData {
  categories: Category[];
}

// Import furniture data with type assertion
import furnitureData from '@/data/furniture.json';
const typedFurnitureData = furnitureData as FurnitureData;

export default function FurnitureProductDetail() {
  // Extract category and product IDs from the URL
  const [, params] = useRoute('/furniture/:categoryId/:productId');
  const categoryId = params?.categoryId;
  const productId = params?.productId;
  
  // Find the category and product
  const category = typedFurnitureData.categories.find(cat => cat.id === categoryId);
  const product = category?.products.find(prod => prod.id === productId);
  
  // State for selected options
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product?.variants?.[0] || null);
  const [mainImage, setMainImage] = useState(product?.variants?.[0]?.mainImage || product?.mainImage || '');
  const [quantity, setQuantity] = useState(1);
  
  // Cart context
  const { addToCart } = useCart();
  
  // Format price to INR currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product) return 0;
    const currentPrice = selectedVariant?.price || product.price;
    const currentDiscountedPrice = selectedVariant?.discountedPrice || product.discountedPrice;
    
    if (currentPrice === currentDiscountedPrice) return 0;
    
    const discount = ((currentPrice - currentDiscountedPrice) / currentPrice) * 100;
    return Math.round(discount);
  };
  
  // Handle adding item to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Add the item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: `${product.name} - ${selectedVariant?.size || ''}`,
        price: selectedVariant?.discountedPrice || product.discountedPrice,
        image: selectedVariant?.mainImage || product.mainImage
      });
    }
  };
  
  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setMainImage(variant.mainImage);
  };
  
  // Handle WhatsApp inquiry
  const handleWhatsAppInquiry = () => {
    if (!product) return;
    
    // Create a message with product details
    const message = `Hello FeatherWood, I'm interested in the following product:\n\n` +
      `*${product.name}*\n` +
      `Price: ${formatPrice(selectedVariant?.discountedPrice || product.discountedPrice)}\n` +
      `Category: ${category?.name}\n` +
      `Color: ${selectedColor}\n` +
      `Size: ${selectedVariant?.size || ''}` +
      `\nProduct ID: ${product.id}\n` +
      `URL: ${window.location.href}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp business number
    const whatsappNumber = "918850219287"; // +91 88502 19287
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };
  
  // Handle share functionality
  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.name,
      text: `Check out this ${product.name} from FeatherWood Furniture`,
      url: window.location.href
    };
    
    try {
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Product URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        alert('Could not share or copy URL. Please try again.');
      }
    }
  };
  
  // If product not found, show error
  if (!category || !product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found | FeatherWood</title>
        </Helmet>
        <Navbar />
        <main className="min-h-screen bg-[#151515] py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Product Not Found</h1>
            <p className="text-[#C4C4C4] mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/furniture">
              <Button className="bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                Browse All Furniture
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Update main image when clicking on gallery images
  const handleImageClick = (image: string) => {
    setMainImage(image);
  };
  
  return (
    <>
      <Helmet>
        <title>{product.name} | FeatherWood Furniture</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen">
        {/* Breadcrumbs */}
        <section className="bg-[#0A0A0A] py-4">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center text-sm text-[#C4C4C4]">
              <Link href="/furniture">
                <span className="hover:text-[#FFD700] cursor-pointer">Furniture</span>
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link href={`/furniture/${category.id}`}>
                <span className="hover:text-[#FFD700] cursor-pointer">{category.name}</span>
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-white truncate max-w-[150px] md:max-w-none">{product.name}</span>
            </div>
          </div>
        </section>
        
        {/* Product Detail Section */}
        <section className="bg-[#151515] py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Product Images */}
              <div>
                {/* Main Image */}
                <div className="bg-[#222222] rounded-sm overflow-hidden mb-4">
                  <img 
                    src={mainImage || product.mainImage} 
                    alt={product.name}
                    className="w-full h-[300px] md:h-[500px] object-cover"
                  />
                </div>
                
                {/* Image Gallery */}
                <div className="grid grid-cols-4 gap-2">
                  <div 
                    className={`bg-[#222222] rounded-sm overflow-hidden cursor-pointer transition-all ${mainImage === (selectedVariant?.mainImage || product.mainImage) ? 'ring-2 ring-[#FFD700]' : ''}`}
                    onClick={() => handleImageClick(selectedVariant?.mainImage || product.mainImage)}
                  >
                    <img 
                      src={selectedVariant?.mainImage || product.mainImage} 
                      alt={`${product.name} - Main`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                  
                  {selectedVariant?.gallery?.map((image: string, index: number) => (
                    <div 
                      key={index}
                      className={`bg-[#222222] rounded-sm overflow-hidden cursor-pointer transition-all ${mainImage === image ? 'ring-2 ring-[#FFD700]' : ''}`}
                      onClick={() => handleImageClick(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - View ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Product Information */}
              <div>
                {/* Product badges */}
                <div className="flex gap-2 mb-4">
                  {product.isNew && (
                    <Badge className="bg-[#FFD700] text-[#0A0A0A] font-medium">New</Badge>
                  )}
                  {product.isBestseller && (
                    <Badge className="bg-[#F64B5A] text-white font-medium">Bestseller</Badge>
                  )}
                  {calculateDiscount() > 0 && (
                    <Badge className="bg-[#2C8A2C] text-white font-medium">{calculateDiscount()}% OFF</Badge>
                  )}
                </div>
                
                {/* Product title */}
                <h1 className="font-playfair text-2xl md:text-4xl font-bold mb-2">{product.name}</h1>
                
                {/* Product rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                    <span className="ml-1 text-white font-medium">{product.rating}</span>
                  </div>
                  <span className="mx-2 text-[#555]">|</span>
                  <span className="text-[#C4C4C4]">{product.reviews} reviews</span>
                </div>
                
                {/* Product price */}
                <div className="flex items-baseline mb-4">
                  <span className="text-[#FFD700] font-bold text-2xl md:text-3xl">
                    {formatPrice(selectedVariant?.discountedPrice || product.discountedPrice)}
                  </span>
                  {(selectedVariant?.price || product.price) > (selectedVariant?.discountedPrice || product.discountedPrice) && (
                    <span className="ml-3 text-[#888] line-through text-lg">
                      {formatPrice(selectedVariant?.price || product.price)}
                    </span>
                  )}
                </div>
                
                {/* Product description */}
                <p className="text-[#C4C4C4] mb-6">{product.description}</p>
                
                {/* Size variants */}
                {product?.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Size</h3>
                    <RadioGroup 
                      defaultValue={product.variants[0].size} 
                      onValueChange={(value) => {
                        const variant = product.variants?.find(v => v.size === value);
                        if (variant) {
                          handleVariantSelect(variant);
                        }
                      }} 
                      value={selectedVariant?.size}
                      className="flex flex-wrap gap-2"
                    >
                      {product.variants.map((variant: ProductVariant, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={variant.size} 
                            id={`size-${index}`} 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor={`size-${index}`}
                            className="flex items-center space-x-2 rounded-md border border-[#333] p-2 cursor-pointer peer-data-[state=checked]:border-[#FFD700] hover:bg-[#222222]"
                          >
                            <span>{variant.size}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                
                {/* Color selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Color</h3>
                    <RadioGroup 
                      defaultValue={product.colors[0]} 
                      onValueChange={setSelectedColor} 
                      value={selectedColor}
                      className="flex flex-wrap gap-2"
                    >
                      {product.colors.map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={color} 
                            id={`color-${index}`} 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor={`color-${index}`}
                            className="flex items-center space-x-2 rounded-md border border-[#333] p-2 cursor-pointer peer-data-[state=checked]:border-[#FFD700] hover:bg-[#222222]"
                          >
                            <span>{color}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                
                {/* Quantity and Add to Cart */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <QuantityControl
                      quantity={quantity}
                      onIncrement={() => setQuantity(prev => Math.min(prev + 1, 99))}
                      onDecrement={() => setQuantity(prev => Math.max(prev - 1, 1))}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#FFD700] hover:bg-[#D4AF37] text-black font-medium px-6 py-3 h-auto flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
                
                {/* WhatsApp Inquiry Button */}
                <div className="mb-6">
                  <Button 
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-medium px-6 py-3 h-auto"
                    onClick={handleWhatsAppInquiry}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Enquire on WhatsApp
                  </Button>
                  <p className="text-[#C4C4C4] text-sm mt-2 text-center">
                    Click to send product details to our team via WhatsApp
                  </p>
                </div>
                
                {/* Delivery options */}
                <div className="bg-[#1A1A1A] p-4 rounded-sm mb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <Truck className="h-5 w-5 text-[#FFD700] mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Free Delivery</h4>
                      <p className="text-[#C4C4C4] text-sm">Delivery within 7-14 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 mb-3">
                    <Shield className="h-5 w-5 text-[#FFD700] mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">2-Year Warranty</h4>
                      <p className="text-[#C4C4C4] text-sm">Comprehensive coverage for peace of mind</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RotateCcw className="h-5 w-5 text-[#FFD700] mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">30-Day Returns</h4>
                      <p className="text-[#C4C4C4] text-sm">Return within 30 days for full refund</p>
                    </div>
                  </div>
                </div>
                
                {/* Share */}
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#C4C4C4] hover:text-white"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="mt-12">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full flex bg-[#222222] rounded-none border-b border-[#333] mb-6">
                  <TabsTrigger 
                    value="details" 
                    className="flex-1 py-3 data-[state=active]:text-[#FFD700] data-[state=active]:border-b-2 data-[state=active]:border-[#FFD700] rounded-none data-[state=active]:shadow-none"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="specifications" 
                    className="flex-1 py-3 data-[state=active]:text-[#FFD700] data-[state=active]:border-b-2 data-[state=active]:border-[#FFD700] rounded-none data-[state=active]:shadow-none"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="materials" 
                    className="flex-1 py-3 data-[state=active]:text-[#FFD700] data-[state=active]:border-b-2 data-[state=active]:border-[#FFD700] rounded-none data-[state=active]:shadow-none"
                  >
                    Materials
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-0">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-[#C4C4C4] leading-relaxed">{product.details}</p>
                    
                    {product.features && (
                      <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-[#FFD700] mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-[#C4C4C4]">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="specifications" className="mt-0">
                  <div className="bg-[#222222] p-6 rounded-sm">
                    <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-[#FFD700] font-medium mb-2">Dimensions</h4>
                        <ul className="space-y-2">
                          {selectedVariant?.dimensions && Object.entries(selectedVariant.dimensions).map(([key, value]) => {
                            if (key === 'unit') return null;
                            return (
                              <li key={key} className="flex justify-between border-b border-[#333] pb-1">
                                <span className="text-[#C4C4C4] capitalize">{key}</span>
                                <span className="text-white">
                                  {value} {selectedVariant.dimensions.unit}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-[#FFD700] font-medium mb-2">General</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between border-b border-[#333] pb-1">
                            <span className="text-[#C4C4C4]">Product ID</span>
                            <span className="text-white">{product.id}</span>
                          </li>
                          <li className="flex justify-between border-b border-[#333] pb-1">
                            <span className="text-[#C4C4C4]">Category</span>
                            <span className="text-white">{category.name}</span>
                          </li>
                          <li className="flex justify-between border-b border-[#333] pb-1">
                            <span className="text-[#C4C4C4]">Colors Available</span>
                            <span className="text-white">{product.colors?.length || 0}</span>
                          </li>
                          <li className="flex justify-between border-b border-[#333] pb-1">
                            <span className="text-[#C4C4C4]">Warranty</span>
                            <span className="text-white">2 Years</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="materials" className="mt-0">
                  <div className="bg-[#222222] p-6 rounded-sm">
                    <h3 className="text-xl font-semibold mb-4">Materials & Construction</h3>
                    
                    <ul className="space-y-4">
                      {product.materials?.map((material, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-[#FFD700] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-[#C4C4C4]">{material}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6">
                      <h4 className="text-[#FFD700] font-medium mb-2">Care Instructions</h4>
                      <p className="text-[#C4C4C4]">
                        Regular dusting with a soft, dry cloth. Avoid direct sunlight and heat sources. 
                        Use coasters for drinks and clean spills immediately. For detailed care instructions 
                        specific to your product, refer to the care guide included with your purchase.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Related Products */}
            <div className="mt-16">
              <h2 className="font-playfair text-2xl md:text-3xl font-semibold mb-6">You May Also Like</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {category.products
                  .filter(p => p.id !== product.id)
                  .slice(0, 4)
                  .map(relatedProduct => (
                    <Link href={`/furniture/${category.id}/${relatedProduct.id}`} key={relatedProduct.id}>
                      <div className="bg-[#222222] rounded-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
                        <div className="relative h-40 md:h-48 overflow-hidden">
                          <img 
                            src={relatedProduct.mainImage} 
                            alt={relatedProduct.name} 
                            className="w-full h-full object-cover transition-all hover:scale-105"
                          />
                          {relatedProduct.isNew && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-[#FFD700] text-[#0A0A0A] font-medium text-xs">New</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-3 md:p-4">
                          <h3 className="font-playfair text-base font-semibold mb-1 line-clamp-1">{relatedProduct.name}</h3>
                          <div className="flex items-baseline mb-1">
                            <span className="text-[#FFD700] font-bold text-sm">{formatPrice(relatedProduct.discountedPrice)}</span>
                            {relatedProduct.price > relatedProduct.discountedPrice && (
                              <span className="ml-2 text-[#888] line-through text-xs">{formatPrice(relatedProduct.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
}