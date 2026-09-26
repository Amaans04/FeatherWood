import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/analytics';
import { scrollToTop } from '@/lib/scroll';

export default function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    scrollToTop({ immediate: true });
    trackPageView(location);
  }, [location]);
  
  // This component doesn't render anything
  return null;
} 