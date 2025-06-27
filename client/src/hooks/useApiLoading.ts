import { useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Custom hook to manage loading state for API calls
 * 
 * @returns Methods to handle API loading state
 */
export function useApiLoading() {
  const [requestCount, setRequestCount] = useState(0);
  const { startLoading, stopLoading } = useLoading();
  
  /**
   * Wraps an API call with loading state
   * @param apiCall The async function to call
   * @returns The result of the API call
   */
  const withLoading = async <T,>(apiCall: () => Promise<T>): Promise<T> => {
    try {
      // Only show loading indicator if this is the first request
      if (requestCount === 0) {
        startLoading();
      }
      // Increment request counter
      setRequestCount(prev => prev + 1);
      
      // Execute the API call
      return await apiCall();
    } finally {
      // Decrement request counter
      setRequestCount(prev => {
        const newCount = Math.max(0, prev - 1);
        // If all requests are done, stop loading
        if (newCount === 0) {
          stopLoading();
        }
        return newCount;
      });
    }
  };

  return { withLoading };
} 