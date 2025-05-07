import { Link } from 'wouter';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart">
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
} 