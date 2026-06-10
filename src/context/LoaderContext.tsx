"use client";
import React, { createContext, useContext, useState } from "react";
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

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsLoaderFinished(false);
  }

  return (
    <LoaderContext.Provider value={{ isLoaderFinished, setIsLoaderFinished }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
