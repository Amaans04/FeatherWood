import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LoadingContextProps {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextProps | null>(null);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  // Use a counter approach to handle nested loading calls
  const startLoading = () => {
    console.log('Starting loading...');
    setLoadingCount(prev => prev + 1);
  };

  const stopLoading = () => {
    console.log('Stopping loading...');
    setLoadingCount(0); // Reset completely instead of decrementing
  };

  // Update isLoading based on loadingCount
  useEffect(() => {
    if (loadingCount > 0) {
      setIsLoading(true);
    } else {
      // Small delay before hiding the spinner to avoid flickering
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loadingCount]);

  // Ensure loading is stopped when component unmounts
  useEffect(() => {
    return () => {
      setIsLoading(false);
      setLoadingCount(0);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingContext.Provider>
  );
} 