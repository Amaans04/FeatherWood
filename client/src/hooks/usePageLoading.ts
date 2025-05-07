import { useState, useEffect, useCallback, useRef } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Custom hook to handle manual loading states in components
 * Useful for operations like data fetching or complex computations
 */
export function usePageLoading() {
  const [localLoading, setLocalLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const mounted = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      // If component unmounts while loading, make sure to stop loading
      if (localLoading) {
        stopLoading();
      }
    };
  }, [localLoading, stopLoading]);

  // Convert to callbacks to avoid stale closures
  const startPageLoading = useCallback(() => {
    if (mounted.current) {
      console.log('startPageLoading called');
      setLocalLoading(true);
      startLoading();
    }
  }, [startLoading]);

  const stopPageLoading = useCallback(() => {
    if (mounted.current) {
      console.log('stopPageLoading called');
      setLocalLoading(false);
      stopLoading();
    }
  }, [stopLoading]);

  // Effect to handle loading state changes
  useEffect(() => {
    if (localLoading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [localLoading, startLoading, stopLoading]);

  // Utility function to wrap async operations
  const withLoading = useCallback(async <T,>(loadingOperation: () => Promise<T>): Promise<T> => {
    try {
      startPageLoading();
      return await loadingOperation();
    } finally {
      // Small delay to ensure UI updates properly
      setTimeout(() => {
        stopPageLoading();
      }, 300);
    }
  }, [startPageLoading, stopPageLoading]);

  return {
    isLoading: localLoading,
    startPageLoading,
    stopPageLoading,
    withLoading
  };
} 