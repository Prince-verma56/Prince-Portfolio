"use client";

/**
 * @author: @dorianbaffier (Updated for Icons & Premium Theme)
 * @description: Scroll Text with Icons
 * @version: 1.1.0
 */

import { motion, type Variants } from "framer-motion"; // Note: 'motion/react' is usually 'framer-motion' in standard setups
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Define the new Item interface
export interface TechItem {
  name: string;
  icon: React.ReactNode;
}

interface ScrollTextProps {
  items: TechItem[];
  className?: string;
}

export default function ScrollText({ items, className }: ScrollTextProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = itemsRef.current.findIndex(
          (item) => item === entry.target
        );
        setActiveIndex(index);
      }
    });
  };

  // Setup intersection observer
  const setupObserver = (element: HTMLDivElement | null, index: number) => {
    if (element && !itemsRef.current[index]) {
      itemsRef.current[index] = element;

      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(handleIntersection, {
          threshold: 0.7,
          root: containerRef.current,
          rootMargin: "-45% 0px -45% 0px",
        });
      }
      observerRef.current.observe(element);
    }
  };

  // Animation variants for the reveal effect
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: (index: number) => ({
      opacity: 0,
      x: index % 2 === 0 ? -50 : 50, // Reduced from 100 to 50 for tighter, premium feel
      rotate: index % 2 === 0 ? -5 : 5,
    }),
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  return (
    <div className={cn("mx-auto w-full max-w-4xl", className)}>
      <div
        className={cn(
          "scrollbar-none h-[400px] md:h-[500px] overflow-y-auto cursor-grab active:cursor-grabbing",
          "relative flex flex-col items-center",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        ref={containerRef}
      >
        <div className="h-[200px]" />
        <motion.div
          animate="visible"
          className="flex w-full flex-col items-center gap-4"
          initial="hidden"
          variants={containerVariants}
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                className={cn(
                  "flex items-center gap-6 md:gap-8 whitespace-nowrap px-4 py-4 md:py-6 font-black text-4xl md:text-6xl lg:text-7xl",
                  "transition-all duration-500 ease-out",
                  isActive
                    ? "text-white scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-neutral-600 scale-100 blur-[1px]" // Slight blur to non-active items adds incredible depth
                )}
                custom={index}
                initial="hidden"
                key={item.name}
                ref={(el) => setupObserver(el, index)}
                variants={itemVariants}
                viewport={{
                  once: false,
                  margin: "-20% 0px -20% 0px",
                }}
                whileInView="visible"
              >
                {/* Render the Icon */}
                <div 
                  className={cn(
                    "flex-shrink-0 transition-all duration-500",
                    isActive ? "text-[#f04e00]" : "text-neutral-600" // Highlight icon in brand orange
                  )}
                >
                  {item.icon}
                </div>
                {/* Render the Text */}
                <span>{item.name}</span>
              </motion.div>
            );
          })}
        </motion.div>
        <div className="h-[200px]" />
      </div>
    </div>
  );
}