import React, { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export default function DevTools() {
  const { isLoading, stopLoading } = useLoading();
  const [showTools, setShowTools] = useState(false);

  // Only show in development environment
  const isDev = process.env.NODE_ENV === 'development';

  // Toggle DevTools visibility with Ctrl+Shift+D
  useEffect(() => {
    if (!isDev) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowTools(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDev]);
  
  if (!isDev || !showTools) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-[9990] bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs opacity-90 w-60">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">DevTools</h3>
        <button 
          onClick={() => setShowTools(false)}
          className="text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between">
          <span>Loading State:</span>
          <span className={isLoading ? 'text-green-400' : 'text-gray-400'}>
            {isLoading ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        
        {isLoading && (
          <button
            onClick={stopLoading}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
          >
            Force Stop Loading
          </button>
        )}
        
        <div className="mt-2 text-gray-400 text-[10px]">
          Press Ctrl+Shift+D to toggle
        </div>
      </div>
    </div>
  );
} 