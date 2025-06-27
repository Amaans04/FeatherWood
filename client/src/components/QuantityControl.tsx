import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export default function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
}: QuantityControlProps) {
  return (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDecrement}
        disabled={quantity <= min}
        className={`p-1 rounded-full ${
          quantity <= min
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-[#FFD700] hover:bg-[#D4AF37]'
        }`}
      >
        <Minus className="h-4 w-4" />
      </motion.button>
      
      <span className="w-8 text-center font-medium">{quantity}</span>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onIncrement}
        disabled={quantity >= max}
        className={`p-1 rounded-full ${
          quantity >= max
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-[#FFD700] hover:bg-[#D4AF37]'
        }`}
      >
        <Plus className="h-4 w-4" />
      </motion.button>
    </div>
  );
} 