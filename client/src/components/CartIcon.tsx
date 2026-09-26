import { Link } from 'wouter';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart">
      <div className="relative cursor-pointer text-[#1A1A1A] hover:text-[#8B7355] transition-colors">
        <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[9px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  );
}
