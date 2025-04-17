import React from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const menuVariants = {
    closed: {
      y: -20,
      opacity: 0,
      scale: 0.9,
      borderRadius: "9999px",
    },
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      borderRadius: "24px",
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-primary/95 backdrop-blur-lg z-50 overflow-hidden rounded-3xl text-white"
        >
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-white hover:text-accent">
              <X className="w-6 h-6" />
            </button>
          </div>
          <motion.div 
            className="container mx-auto px-4 py-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, staggerChildren: 0.1 }}
          >
            {[
              { href: "/", label: "Home" },
              { href: "/furniture", label: "Furniture" },
              { href: "/interiors", label: "Interiors" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-3 hover:text-accent transition-all text-lg"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;