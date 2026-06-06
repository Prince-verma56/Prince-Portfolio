"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Define the context shape
interface LoaderContextType {
  isLoaderFinished: boolean;
  setIsLoaderFinished: (val: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType>({
  isLoaderFinished: false,
  setIsLoaderFinished: () => {},
});

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const pathname = usePathname();

  // Every time the route changes, reset the loader state to false
  useEffect(() => {
    setIsLoaderFinished(false);
  }, [pathname]);

  return (
    <LoaderContext.Provider value={{ isLoaderFinished, setIsLoaderFinished }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
