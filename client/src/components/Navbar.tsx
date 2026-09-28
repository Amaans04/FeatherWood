import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ChevronDown, ShoppingCart, User, X } from "lucide-react";
import LinkWithScroll from "@/components/LinkWithScroll";
import CartIcon from "@/components/CartIcon";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  text: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { text: string; href: string }[];
}

const mainNavLinks: NavLink[] = [
  { text: "Home", href: "/" },
  {
    text: "Furniture",
    href: "/furniture",
    hasDropdown: true,
    dropdownItems: [
      { text: "Sofas", href: "/furniture/sofas" },
      { text: "Dining Tables", href: "/furniture/dining-tables" },
      { text: "Beds", href: "/furniture/beds" },
      { text: "Wardrobes", href: "/furniture/wardrobes" },
      { text: "Tables", href: "/furniture/tables" },
      { text: "Chairs", href: "/furniture/chairs" },
      { text: "Accent Chairs", href: "/furniture/accent-chairs" },
      { text: "All Furniture", href: "/furniture" },
    ],
  },
  { text: "Design Ideas", href: "/design-ideas" },
  {
    text: "Calculators",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { text: "Home Interior", href: "/home-interior-price-calculator" },
      { text: "Kitchen", href: "/kitchen-price-calculator" },
      { text: "Wardrobe", href: "/wardrobe-price-calculator" },
    ],
  },
  { text: "Stores", href: "/store-locator" },
  { text: "About", href: "/about" },
  { text: "Contact", href: "/contact" },
];

const mobileNavLinks = [
  { text: "Home", href: "/" },
  { text: "Shop", href: "/furniture" },
  { text: "Begin", href: "/user-info", highlight: true },
  { text: "Ideas", href: "/design-ideas" },
  { text: "More", href: "#", hasMenu: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [mobileMenuOpen]);

  /* Ensure menu-open never stuck after route change or unmount */
  useEffect(() => {
    return () => document.body.classList.remove("menu-open");
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location === href : location.startsWith(href);

  return (
    <>
      {/* Single unified header — Bay Window style */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]" : "border-b border-[#E8E4DF]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <LinkWithScroll href="/" className="flex-shrink-0">
              <img
                src="/cmp_logo.jpg"
                alt="FeatherWood"
                className="h-9 w-auto"
              />
            </LinkWithScroll>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainNavLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.text}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.text)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="navbar-item-hover flex items-center gap-1 py-2 focus:outline-none">
                      {link.text}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.text && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-[#E8E4DF] py-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                        >
                          {link.dropdownItems?.map((item) => (
                            <LinkWithScroll key={item.href} href={item.href}>
                              <div className="px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] text-[#6E6A66] hover:text-[#1A1A1A] hover:bg-[#FAFAF8] cursor-pointer transition-colors">
                                {item.text}
                              </div>
                            </LinkWithScroll>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <LinkWithScroll key={link.text} href={link.href}>
                    <span
                      className={`navbar-item-hover py-2 cursor-pointer ${
                        isActive(link.href) ? "text-[#8B7355]" : ""
                      }`}
                    >
                      {link.text}
                    </span>
                  </LinkWithScroll>
                )
              )}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-6">
              <CartIcon />
              <LinkWithScroll href="/user-info">
                <span className="luxury-btn text-[10px] px-6 py-2.5">
                  Book Consultation
                </span>
              </LinkWithScroll>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex lg:hidden items-center gap-4">
              <LinkWithScroll href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-[#1A1A1A]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[9px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </LinkWithScroll>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-[#E8E4DF] bg-white"
            >
              <div className="px-6 py-6 space-y-1 max-h-[70vh] overflow-y-auto">
                {mainNavLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.text} className="py-2">
                      <p className="luxury-label mb-2">{link.text}</p>
                      {link.dropdownItems?.map((item) => (
                        <LinkWithScroll key={item.href} href={item.href}>
                          <div className="py-2.5 text-sm text-[#6E6A66] hover:text-[#1A1A1A] cursor-pointer">
                            {item.text}
                          </div>
                        </LinkWithScroll>
                      ))}
                    </div>
                  ) : (
                    <LinkWithScroll key={link.text} href={link.href}>
                      <div className="py-3 text-sm uppercase tracking-[0.12em] text-[#1A1A1A] border-b border-[#F0EDE8] cursor-pointer">
                        {link.text}
                      </div>
                    </LinkWithScroll>
                  )
                )}
                <div className="pt-4">
                  <LinkWithScroll href="/user-info">
                    <span className="luxury-btn w-full text-center block text-[10px]">
                      Book Consultation
                    </span>
                  </LinkWithScroll>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile bottom nav — frosted glass */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[#E8E4DF]/80 safe-area-bottom">
        <div className="grid grid-cols-5 h-[3.75rem]">
          {mobileNavLinks.map((link) =>
            link.hasMenu ? (
              <button
                key={link.text}
                onClick={() => setMobileMenuOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <Menu className="h-4 w-4 text-[#6E6A66]" />
                <span className="text-[9px] uppercase tracking-wider text-[#6E6A66]">
                  {link.text}
                </span>
              </button>
            ) : link.highlight ? (
              <LinkWithScroll key={link.text} href={link.href}>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center -mt-3">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A] mt-0.5">
                    {link.text}
                  </span>
                </div>
              </LinkWithScroll>
            ) : (
              <LinkWithScroll key={link.text} href={link.href}>
                <div
                  className={`flex flex-col items-center justify-center h-full ${
                    isActive(link.href) ? "text-[#1A1A1A]" : "text-[#6E6A66]"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider">
                    {link.text}
                  </span>
                  {isActive(link.href) && (
                    <div className="w-4 h-px bg-[#1A1A1A] mt-1" />
                  )}
                </div>
              </LinkWithScroll>
            )
          )}
        </div>
      </div>
    </>
  );
}
