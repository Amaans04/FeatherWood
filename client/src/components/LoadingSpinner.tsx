import React, { useEffect, useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export default function LoadingSpinner() {
  const [visible, setVisible] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const { stopLoading } = useLoading();
  
  // Add a small delay before showing the spinner to prevent flashing
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 200);
    
    // Show cancel button if loading takes more than 2 seconds
    const cancelTimer = setTimeout(() => {
      setShowCancel(true);
    }, 2000);
    
    // Auto-cancel loading after 10 seconds to prevent getting stuck
    const autoStopTimer = setTimeout(() => {
      stopLoading();
    }, 10000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(cancelTimer);
      clearTimeout(autoStopTimer);
    };
  }, [stopLoading]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A] bg-opacity-90">
      <div className="relative">
        {/* Logo container with pulse animation */}
        <div className="relative animate-pulse">
          <img 
            src="/cmp_logo.jpg" 
            alt="FeatherWood Logo" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-full"
          />
          <div className="absolute inset-0 border-2 border-[#FFD700] rounded-full animate-ping"></div>
        </div>
        
        {/* Spinner circle around the logo */}
        <div className="absolute inset-0 border-t-2 border-r-2 border-[#FFD700] rounded-full animate-spin -ml-1 -mt-1 w-[calc(100%+8px)] h-[calc(100%+8px)]"></div>
        <div className="absolute inset-0 border-b-2 border-l-2 border-[#F5F5F5] rounded-full animate-spin animation-delay-500 -ml-3 -mt-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"></div>
        
        {/* Loading text */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-[#FFD700] font-medium">
            <span className="inline-block animate-bounce">L</span>
            <span className="inline-block animate-bounce animation-delay-100">o</span>
            <span className="inline-block animate-bounce animation-delay-200">a</span>
            <span className="inline-block animate-bounce animation-delay-300">d</span>
            <span className="inline-block animate-bounce animation-delay-400">i</span>
            <span className="inline-block animate-bounce animation-delay-500">n</span>
            <span className="inline-block animate-bounce animation-delay-600">g</span>
            <span className="inline-block animate-bounce animation-delay-700">.</span>
            <span className="inline-block animate-bounce animation-delay-800">.</span>
            <span className="inline-block animate-bounce animation-delay-900">.</span>
          </p>
        </div>
        
        {/* Cancel button that appears after timeout */}
        {showCancel && (
          <button
            onClick={stopLoading}
            className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            Cancel Loading
          </button>
        )}
      </div>
    </div>
  );
} 