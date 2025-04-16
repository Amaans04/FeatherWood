import React, { useState } from "react";
import { Link } from "wouter";
import MobileMenu from "@/components/ui/MobileMenu";
import { 
  Phone, 
  Mail, 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  ChevronDown,
  Menu
} from "lucide-react";
import { useCart } from "@/hooks/useCart";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  
  return (
    <header className="bg-primary text-white nav-shadow relative">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 bg-foreground text-sm">
        <div className="flex gap-4">
          <Link href="/contact" className="hover:text-accent transition-all">Contact</Link>
          <Link href="/about" className="hover:text-accent transition-all">About Us</Link>
          <Link href="/blog" className="hover:text-accent transition-all">Blog</Link>
        </div>
        <div className="flex gap-4">
          <a href="tel:+18005551234" className="hover:text-accent transition-all flex items-center">
            <Phone className="w-3 h-3 mr-1" /> +1 (800) 555-1234
          </a>
          <a href="mailto:info@featherwood.com" className="hover:text-accent transition-all flex items-center">
            <Mail className="w-3 h-3 mr-1" /> info@featherwood.com
          </a>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="text-accent">Feather</span>Wood
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link href="/" className="hover:text-accent transition-all font-medium">Home</Link>
          
          <div className="group relative">
            <Link href="/furniture" className="hover:text-accent transition-all font-medium flex items-center">
              Furniture <ChevronDown className="ml-1 w-4 h-4" />
            </Link>
            <div className="absolute hidden group-hover:block bg-white text-foreground py-2 px-4 rounded-md shadow-lg w-48 z-10">
              <Link href="/furniture?category=beds" className="block py-2 hover:text-accent transition-all">Beds</Link>
              <Link href="/furniture?category=sofas" className="block py-2 hover:text-accent transition-all">Sofas</Link>
              <Link href="/furniture?category=tables" className="block py-2 hover:text-accent transition-all">Tables</Link>
              <Link href="/furniture?category=storage" className="block py-2 hover:text-accent transition-all">Storage</Link>
              <Link href="/furniture?category=decor" className="block py-2 hover:text-accent transition-all">Decor</Link>
            </div>
          </div>
          
          <div className="group relative">
            <Link href="/interiors" className="hover:text-accent transition-all font-medium flex items-center">
              Interiors <ChevronDown className="ml-1 w-4 h-4" />
            </Link>
            <div className="absolute hidden group-hover:block bg-white text-foreground py-2 px-4 rounded-md shadow-lg w-48 z-10">
              <Link href="/interiors?category=Modular Kitchen" className="block py-2 hover:text-accent transition-all">Modular Kitchen</Link>
              <Link href="/interiors?category=Living Room" className="block py-2 hover:text-accent transition-all">Living Room</Link>
              <Link href="/interiors?category=Bedroom" className="block py-2 hover:text-accent transition-all">Bedroom</Link>
              <Link href="/interiors?category=Wardrobes" className="block py-2 hover:text-accent transition-all">Wardrobes</Link>
              <Link href="/interiors?category=Case Studies" className="block py-2 hover:text-accent transition-all">Case Studies</Link>
            </div>
          </div>
          
          <Link href="/interiors" className="hover:text-accent transition-all font-medium">Portfolio</Link>
          <Link href="/blog" className="hover:text-accent transition-all font-medium">Blog</Link>
          <Link href="/contact" className="hover:text-accent transition-all font-medium">Contact</Link>
        </div>
        
        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-accent transition-all" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-accent transition-all" aria-label="User account">
            <User className="w-5 h-5" />
          </button>
          <Link href="/wishlist" className="hover:text-accent transition-all" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="hover:text-accent transition-all relative" aria-label="Shopping cart">
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <button 
            className="lg:hidden hover:text-accent transition-all" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
