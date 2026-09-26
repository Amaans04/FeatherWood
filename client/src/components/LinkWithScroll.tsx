import { ReactNode } from 'react';
import { Link } from 'wouter';
import { scrollToTop } from '@/lib/scroll';

interface LinkWithScrollProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LinkWithScroll({ 
  href, 
  children, 
  className, 
  onClick 
}: LinkWithScrollProps) {
  
  const handleClick = () => {
    scrollToTop({ immediate: true });
    
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
} 