import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import MobileMenu from "@/components/ui/MobileMenu";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(11, 11, 11, 0)", "rgba(11, 11, 11, 0.9)"]
  );

  const scale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const textColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(11, 11, 11, 0.9)", "rgba(255, 255, 255, 0.9)"]
  );

  return (
    <motion.header 
      style={{ backgroundColor }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl rounded-full"
    >
      <motion.nav 
        style={{ scale }}
        className="container mx-auto px-6 py-3 flex justify-between items-center backdrop-blur-sm rounded-full bg-white/5"
      >
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="text-accent">Feather</span>Wood
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <motion.div style={{ color: textColor }}>
            <Link href="/" className="hover:text-accent transition-all font-medium">Home</Link>
            <Link href="/furniture" className="hover:text-accent transition-all font-medium ml-8">Furniture</Link>
            <Link href="/interiors" className="hover:text-accent transition-all font-medium ml-8">Interiors</Link>
            <Link href="/blog" className="hover:text-accent transition-all font-medium ml-8">Blog</Link>
            <Link href="/contact" className="hover:text-accent transition-all font-medium ml-8">Contact</Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden hover:text-accent transition-all" 
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </motion.header>
  );
};

export default Header;