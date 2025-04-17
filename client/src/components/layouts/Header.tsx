
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import MobileMenu from "@/components/ui/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(11, 11, 11, 0.8)", "rgba(11, 11, 11, 0.95)"]
  );

  const scale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const mobileScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ backgroundColor }}
      className={`fixed z-50 w-full ${isMobile ? 'top-4 flex justify-center' : 'top-0'}`}
    >
      <motion.nav 
        style={{ scale: isMobile ? mobileScale : scale }}
        className={`
          ${isMobile ? 'w-[90%] max-w-[280px] px-4' : 'container mx-auto px-6'} 
          py-3 flex justify-between items-center backdrop-blur-lg rounded-full
          border border-white/10 shadow-lg
        `}
      >
        <Link href="/" className="text-2xl font-bold flex items-center text-white">
          <span className="text-accent">Feather</span>Wood
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <motion.div className="text-white">
            {[
              { href: "/", label: "Home" },
              { href: "/furniture", label: "Furniture" },
              { href: "/interiors", label: "Interiors" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent transition-all font-medium ml-8 relative group"
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"
                  initial={false}
                  animate={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                />
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="lg:hidden text-white hover:text-accent transition-all"
          onClick={() => setMobileMenuOpen(true)}
          whileTap={{ scale: 0.9 }}
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </motion.header>
  );
};

export default Header;
