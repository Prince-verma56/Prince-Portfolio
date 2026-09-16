"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lazy-loaded sections and accordions change the document height after
// ScrollTriggers were measured. One debounced refresh, driven by a
// ResizeObserver on <body>, replaces the per-section setTimeout(refresh) calls.
const REFRESH_DEBOUNCE_MS = 120;

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const lenis = new Lenis({
      lerp: isTouchDevice ? 0.2 : 0.1,
      wheelMultiplier: 1.1,
      duration: isTouchDevice ? 1.0 : 2.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Single coordinated frame: Lenis → ScrollTrigger.update → GSAP render.
    // Keep the same function references so cleanup can actually remove them.
    const onScroll = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", onScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Mobile browsers fire resize when the URL bar collapses; a full refresh
    // there makes pinned sections jump.
    ScrollTrigger.config({ ignoreMobileResize: true });

    let refreshTimer: number | null = null;
    let lastHeight = document.documentElement.scrollHeight;
    const scheduleRefresh = () => {
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        refreshTimer = null;
        ScrollTrigger.refresh();
      }, REFRESH_DEBOUNCE_MS);
    };
    const heightObserver = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      if (height === lastHeight) return; // pin-spacer writes during refresh settle here
      lastHeight = height;
      scheduleRefresh();
    });
    heightObserver.observe(document.body);

    return () => {
      heightObserver.disconnect();
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
