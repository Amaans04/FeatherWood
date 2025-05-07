import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ChevronDown, Phone, MessageCircle, ShoppingCart, User, Home, LogOut, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkWithScroll from "@/components/LinkWithScroll";
import CartIcon from "@/components/CartIcon";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import designIdeasData from "@/data/designideas.json";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  text: string;
  href: string;
  hasDropdown?: boolean;
  hasPopover?: boolean;
  dropdownItems?: { text: string; href: string }[];
}

const designCategories = designIdeasData.categories.map(category => ({
  text: category.title,
  href: `/design-ideas/${category.id}`
}));

const mobileNavLinks: NavLink[] = [
  { text: "Home", href: "/" },
  { text: "Design Ideas", href: "/design-ideas" },
  { text: "Let's Begin", href: "/user-info" },
  { text: "Furniture", href: "/furniture" },
  { 
    text: "More", 
    href: "#", 
    hasDropdown: true,
    dropdownItems: [
      { text: "Get Estimate", href: "/home-interior-price-calculator" },
      { text: "About Us", href: "/about" },
      { text: "Store Locator", href: "/store-locator" },
      { text: "Contact", href: "/contact" },
    ]
  }
];

const mainNavLinks: NavLink[] = [
  { text: "Home", href: "/" },
  { 
    text: "Design Ideas", 
    href: "/design-ideas", 
    hasPopover: true
  },
  {
    text: "Furniture",
    href: "/furniture",
    hasDropdown: true,
    dropdownItems: [
      { text: "Beds", href: "/furniture/beds" },
      { text: "Wardrobes", href: "/furniture/wardrobes" },
      { text: "Tables", href: "/furniture/tables" },
      { text: "Chairs", href: "/furniture/chairs" },
      { text: "Sofas", href: "/furniture/sofas" },
      { text: "All Furniture", href: "/furniture" }
    ]
  },
  { 
    text: "Price Calculators", 
    href: "#", 
    hasDropdown: true,
    dropdownItems: [
      { text: "Home Interior Calculator", href: "/home-interior-price-calculator" },
      { text: "Kitchen Calculator", href: "/kitchen-price-calculator" },
      { text: "Wardrobe Calculator", href: "/wardrobe-price-calculator" },
    ]
  },
  { text: "Store Locator", href: "/store-locator" },
  { text: "About Us", href: "/about" },
  { text: "Contact", href: "/contact" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.isAdmin || false);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Make navbar visible when scrolling up or when at the top
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return location === href;
    }
    return location.startsWith(href);
  };

  const renderProfileDropdown = () => (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link href="/profile" className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/orders" className="flex items-center">
          <Package className="mr-2 h-4 w-4" />
          <span>My Orders</span>
        </Link>
      </DropdownMenuItem>
      {user?.isAdmin && (
        <DropdownMenuItem>
          <Link href="/admin/orders" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => logout()}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <>
      {/* Top Navbar - Logo Only */}
      <div className="bg-[#0A0A0A] border-b border-gray-800 py-2 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <LinkWithScroll href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <img 
                  src="/cmp_logo.jpg" 
                  alt="FeatherWood" 
                  className="h-14 w-auto"
                />
              </div>
            </LinkWithScroll>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-black" />
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  {renderProfileDropdown()}
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button 
                    className="bg-[#FFD700] hover:bg-[#D4AF37] text-black text-xs rounded-full px-6"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Auth Section */}
            <div className="flex md:hidden">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-black" />
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  {renderProfileDropdown()}
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button 
                    className="bg-[#FFD700] hover:bg-[#D4AF37] text-black text-xs rounded-full px-4 py-2"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Desktop Navigation */}
      <nav className={`bg-[#151515] sticky top-0 z-40 hidden md:block ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex items-center space-x-8">
              {mainNavLinks.map((link, index) => {
                if (link.hasDropdown) {
                  return (
                    <div 
                      key={index}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.text)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button className="navbar-item-hover py-2 text-[#F5F5F5] text-sm flex items-center focus:outline-none">
                        {link.text}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      {openDropdown === link.text && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-[#222222] border border-gray-800 rounded-md shadow-lg">
                          {link.dropdownItems?.map((item, idx) => (
                            <LinkWithScroll key={idx} href={item.href}>
                              <div className="px-4 py-2 text-[#C4C4C4] hover:text-[#FFD700] hover:bg-[#2A2A2A] cursor-pointer">
                                {item.text}
                              </div>
                            </LinkWithScroll>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                if (link.hasPopover) {
                  return (
                    <div 
                      key={index}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.text)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button className="navbar-item-hover py-2 text-[#F5F5F5] text-sm flex items-center focus:outline-none">
                        {link.text}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      {openDropdown === link.text && (
                        <div className="absolute top-full left-0 mt-1 w-[550px] bg-[#222222] border border-gray-800 rounded-md shadow-lg p-6">
                          <div>
                            <div className="mb-4 pb-2 border-b border-gray-800">
                              <h3 className="text-[#FFD700] font-semibold">Design Ideas</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {designCategories.map((category, idx) => (
                                <LinkWithScroll key={idx} href={category.href}>
                                  <div className="text-[#C4C4C4] hover:text-[#FFD700] text-sm py-1.5 cursor-pointer">
                                    {category.text}
                                  </div>
                                </LinkWithScroll>
                              ))}
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-800 text-center">
                              <LinkWithScroll href="/design-ideas">
                                <div className="text-[#FFD700] hover:underline text-sm font-medium cursor-pointer">
                                  View All Design Ideas
                                </div>
                              </LinkWithScroll>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <LinkWithScroll key={index} href={link.href}>
                    <div className="navbar-item-hover py-2 text-[#F5F5F5] text-sm cursor-pointer">
                      {link.text}
                    </div>
                  </LinkWithScroll>
                );
              })}
            </div>

            {/* Action button */}
            <div className="flex items-center space-x-4">
              <CartIcon />
              <LinkWithScroll href="/user-info">
                <Button 
                  className="bg-[#FFD700] hover:bg-[#D4AF37] text-black text-xs rounded-full px-6"
                >
                  BOOK FREE CONSULTATION
                </Button>
              </LinkWithScroll>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {visible && (
          <motion.div 
            className="md:hidden border-t border-gray-800 bg-[#151515] fixed bottom-0 left-0 right-0 z-50 shadow-lg"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ 
              paddingBottom: "env(safe-area-inset-bottom)"
            }}
          >
            <div className="grid grid-cols-5 text-center">
              {mobileNavLinks.map((link, index) => {
                if (link.hasDropdown) {
                  return (
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger asChild className="focus:outline-none">
                        <button className="py-3 w-full flex flex-col items-center justify-center text-[#F5F5F5] text-xs focus:outline-none">
                          <div className="mb-1 relative p-2 rounded-md">
                            <Menu className="h-6 w-6" />
                          </div>
                          <span>{link.text}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="bg-[#222222] border-gray-800 mb-16">
                        {link.dropdownItems?.map((item, idx) => (
                          <DropdownMenuItem key={idx} className="text-[#C4C4C4] hover:text-[#FFD700]">
                            <LinkWithScroll href={item.href}>{item.text}</LinkWithScroll>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                } else if (link.text === "Profile" || link.text === "Let's Begin") {
                  return (
                    <LinkWithScroll key={index} href={link.href}>
                      <motion.div 
                        className={`py-3 flex flex-col items-center justify-center text-xs ${
                          isActive(link.href) 
                            ? 'text-[#FFD700] font-medium' 
                            : 'text-[#F5F5F5]'
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div 
                          className={`mb-1 p-2 rounded-full ${
                            isActive(link.href) 
                              ? 'bg-[#FFD700]' 
                              : 'bg-[#FFD700]'
                          }`}
                          whileHover={{ 
                            scale: 1.1,
                            boxShadow: "0px 0px 8px rgba(255, 215, 0, 0.7)"
                          }}
                        >
                          <User className={`h-6 w-6 ${
                            isActive(link.href) 
                              ? 'text-black' 
                              : 'text-black'
                          }`} />
                        </motion.div>
                        <span>{link.text}</span>
                        {isActive(link.href) && (
                          <motion.div 
                            className="h-1 w-6 bg-[#FFD700] rounded-full mt-1"
                            layoutId="bottomNavIndicator"
                          />
                        )}
                      </motion.div>
                    </LinkWithScroll>
                  );
                } else {
                  return (
                    <LinkWithScroll key={index} href={link.href}>
                      <motion.div 
                        className={`py-3 flex flex-col items-center justify-center text-xs ${
                          isActive(link.href) 
                            ? 'text-[#FFD700] font-medium' 
                            : 'text-[#F5F5F5]'
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div 
                          className={`mb-1 p-2 rounded-md ${
                            isActive(link.href) 
                              ? 'bg-[#222222]' 
                              : 'transparent'
                          }`}
                          whileHover={{ 
                            scale: 1.1, 
                            backgroundColor: isActive(link.href) ? "#222222" : "#1a1a1a" 
                          }}
                        >
                          {link.text === "Home" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          ) : link.text === "Design Ideas" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          ) : link.text === "Furniture" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          ) : null}
                        </motion.div>
                        <span>{link.text}</span>
                        {isActive(link.href) && (
                          <motion.div 
                            className="h-1 w-6 bg-[#FFD700] rounded-full mt-1"
                            layoutId="bottomNavIndicator"
                          />
                        )}
                      </motion.div>
                    </LinkWithScroll>
                  );
                }
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating contact buttons */}
      <div className="fixed right-4 bottom-24 z-50 flex flex-col space-y-4 md:space-y-6">
        <LinkWithScroll href="/cart">
          <motion.div 
            className="relative w-12 h-12 md:w-14 md:h-14 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg hover:bg-[#D4AF37] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart className="text-black h-6 w-6" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-black text-[#FFD700] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </motion.div>
        </LinkWithScroll>
        <a 
          href="tel:+918850219287" 
          className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg hover:bg-[#D4AF37] transition-colors"
        >
          <Phone className="text-black h-6 w-6" />
        </a>
        <a 
          href="https://wa.me/918850219287" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BD5C] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>

      {/* Expanded Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-[#0A0A0A] z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <LinkWithScroll href="/">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <img 
                src="/cmp_logo.jpg" 
                alt="FeatherWood" 
                className="h-10 w-auto"
              />
            </div>
          </LinkWithScroll>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div className="px-4 py-6 space-y-4 h-full overflow-y-auto">
          <LinkWithScroll href="/">
            <div className="block px-3 py-3 text-lg font-medium text-[#F5F5F5] hover:text-[#FFD700] cursor-pointer border-b border-gray-800">
              Home
            </div>
          </LinkWithScroll>
          <div>
            <LinkWithScroll href="/design-ideas">
              <div className="block px-3 py-3 text-lg font-medium text-[#F5F5F5] hover:text-[#FFD700] cursor-pointer border-b border-gray-800">
                Design Ideas
              </div>
            </LinkWithScroll>
            <div className="pl-6 py-2 space-y-3">
              {designCategories.map((category, idx) => (
                <LinkWithScroll key={idx} href={category.href}>
                  <div className="block px-3 py-1 text-base font-medium text-[#C4C4C4] hover:text-[#FFD700] cursor-pointer">
                    {category.text}
                  </div>
                </LinkWithScroll>
              ))}
            </div>
          </div>
          <div>
            <div className="block px-3 py-3 text-lg font-medium text-[#F5F5F5] border-b border-gray-800">
              Price Calculators
            </div>
            <div className="pl-6 py-2 space-y-3">
              <LinkWithScroll href="/home-interior-price-calculator">
                <div className="block px-3 py-1 text-base font-medium text-[#C4C4C4] hover:text-[#FFD700] cursor-pointer">
                  Home Interior Calculator
                </div>
              </LinkWithScroll>
              <LinkWithScroll href="/kitchen-price-calculator">
                <div className="block px-3 py-1 text-base font-medium text-[#C4C4C4] hover:text-[#FFD700] cursor-pointer">
                  Kitchen Calculator
                </div>
              </LinkWithScroll>
              <LinkWithScroll href="/wardrobe-price-calculator">
                <div className="block px-3 py-1 text-base font-medium text-[#C4C4C4] hover:text-[#FFD700] cursor-pointer">
                  Wardrobe Calculator
                </div>
              </LinkWithScroll>
            </div>
          </div>
          <LinkWithScroll href="/store-locator">
            <div className="block px-3 py-3 text-lg font-medium text-[#F5F5F5] hover:text-[#FFD700] cursor-pointer border-b border-gray-800">
              Store Locator
            </div>
          </LinkWithScroll>
          <LinkWithScroll href="/about">
            <div className="block px-3 py-3 text-lg font-medium text-[#F5F5F5] hover:text-[#FFD700] cursor-pointer border-b border-gray-800">
              About Us
            </div>
          </LinkWithScroll>
          <LinkWithScroll href="/contact">
            <div className="block px-3 py-3 text-lg font-medium text-[#F5F5F5] hover:text-[#FFD700] cursor-pointer border-b border-gray-800">
              Contact
            </div>
          </LinkWithScroll>
          <LinkWithScroll href="/"> {/* Added Interiors link to mobile menu */}
            <div className="block px-3 py-3 text-lg font-medium text-[#F5F5F5] hover:text-[#FFD700] cursor-pointer border-b border-gray-800">
              Interiors
            </div>
          </LinkWithScroll>
          <div className="pt-4">
            <LinkWithScroll href="/user-info">
              <Button className="w-full py-6 bg-[#FFD700] hover:bg-[#D4AF37] text-black">
                BOOK FREE CONSULTATION
              </Button>
            </LinkWithScroll>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-gray-800 md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className="flex flex-col items-center text-[#C4C4C4] hover:text-[#FFD700]">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/furniture" className="flex flex-col items-center text-[#C4C4C4] hover:text-[#FFD700]">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link href="/user-info" className="flex flex-col items-center text-[#FFD700]">
            <div className="bg-[#FFD700] text-black rounded-full p-2">
              <User className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Let's Begin</span>
          </Link>
        </div>
      </div> */}
    </>
  );
}