import { ReactNode } from 'react';
import { Link } from 'wouter';

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
    // Scroll to top immediately when link is clicked
    window.scrollTo(0, 0);
    
    // Call the original onClick if provided
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