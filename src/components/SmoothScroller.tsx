"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // ── THE MAGIC NUMBERS ──
      lerp: 0.05, // Controls the momentum. Lower = longer, smoother glide (Default is usually 0.1)
      wheelMultiplier: 1.1, // Slightly increases the distance per scroll tick to offset the heavy lerp
      duration: 2.0, // Makes anchor links (e.g., clicking "Contact" to scroll down) take 2 full seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // A highly aggressive Expo Out curve
      smoothWheel: true,
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