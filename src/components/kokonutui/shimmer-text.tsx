"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ShimmerTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  hoverOnly?: boolean;
}

export default function ShimmerText({
  text,
  className,
  as: Component = "span",
  hoverOnly = false,
}: ShimmerTextProps) {
  // @ts-ignore
  const MotionComponent = motion[typeof Component === "string" ? Component : "span"];

  return (
    <MotionComponent
      initial={{ backgroundPosition: "-200% center" }}
      animate={
        hoverOnly
          ? { backgroundPosition: "-200% center" }
          : {
              backgroundPosition: ["200% center", "-200% center"],
              transition: {
                duration: 2.5,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              },
            }
      }
      whileHover={
        hoverOnly
          ? {
              backgroundPosition: "200% center",
              transition: {
                duration: 1.2,
                ease: "easeInOut",
              },
            }
          : undefined
      }
      className={cn(
        "bg-[length:200%_100%] bg-clip-text text-transparent inline-flex",
        className
      )}
    >
      {text}
    </MotionComponent>
  );
}
