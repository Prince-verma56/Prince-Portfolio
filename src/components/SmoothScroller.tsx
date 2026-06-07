"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if we're on a touch device for better mobile handling
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const lenis = new Lenis({
      // ── OPTIMIZED FOR BOTH DESKTOP & MOBILE ──
      lerp: isTouchDevice ? 0.2 : 0.1, // Higher lerp on mobile = more responsive
      wheelMultiplier: 1.1,
      duration: isTouchDevice ? 1.0 : 2.0, // Faster anchor links on mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false, // Disable smooth touch for better mobile scrolling
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}