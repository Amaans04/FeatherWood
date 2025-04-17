
import React from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  // Close menu when clicking outside
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      width: "280px",
      height: "50px",
      borderRadius: "9999px",
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      width: "95%",
      height: "auto",
      borderRadius: "24px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 max-w-md 
                    backdrop-blur-xl z-50 overflow-hidden
                    border border-white/10 shadow-xl"
        >
          <div className="flex justify-end p-4">
            <motion.button
              onClick={onClose}
              className="text-white hover:text-accent"
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
          
          <motion.div className="px-6 py-4">
            {[
              { href: "/", label: "Home" },
              { href: "/furniture", label: "Furniture" },
              { href: "/interiors", label: "Interiors" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <motion.div
                key={link.href}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-3 text-white hover:text-accent transition-all text-lg"
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
