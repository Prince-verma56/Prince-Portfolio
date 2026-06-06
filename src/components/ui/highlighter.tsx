"use client";

import React, { useEffect, useRef } from "react";

interface HighlighterProps {
  children: React.ReactNode;
  action?: "underline" | "highlight" | "box" | "circle" | "strike-through" | "crossed-off" | "bracket";
  color?: string;
  strokeWidth?: number;
  padding?: number | [number, number, number, number];
  iterations?: number;
  isView?: boolean;
  animate?: boolean;
  animationDuration?: number;
}

export function Highlighter({
  children,
  action = "underline",
  color = "currentColor",
  strokeWidth = 2,
  padding = 5,
  iterations = 2,
  isView = true,
  animate = true,
  animationDuration = 800,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<any>(null);

  useEffect(() => {
    let active = true;
    let observer: IntersectionObserver | null = null;

    // Dynamically import rough-notation since it requires browser APIs (document/window)
    import("rough-notation")
      .then(({ annotate }) => {
        if (!active || !elementRef.current) return;

        // Map component action prop to rough-notation type prop
        const type = action === "highlight" ? "highlight" : action;

        const annotation = annotate(elementRef.current, {
          type: type as any,
          color,
          strokeWidth,
          padding,
          iterations,
          animate,
          animationDuration,
        });

        annotationRef.current = annotation;

        if (isView) {
          observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  annotation.show();
                } else {
                  annotation.hide();
                }
              });
            },
            { threshold: 0.1 }
          );

          observer.observe(elementRef.current);
        } else {
          annotation.show();
        }
      })
      .catch((err) => {
        console.error("Failed to load rough-notation:", err);
      });

    return () => {
      active = false;
      if (observer) {
        observer.disconnect();
      }
      if (annotationRef.current) {
        try {
          annotationRef.current.remove();
        } catch (e) {
          // Ignore errors during unmount if DOM elements are already cleaned up
        }
      }
    };
  }, [action, color, strokeWidth, padding, iterations, isView, animate, animationDuration]);

  return (
    <span ref={elementRef} className="relative inline-block">
      {children}
    </span>
  );
}