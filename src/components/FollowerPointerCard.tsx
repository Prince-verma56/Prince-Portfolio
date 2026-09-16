"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FollowerPointerCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

// How often the container rect may be re-measured while the pointer moves.
// The pinned Work section drifts a few px with scroll parallax, so a stale
// rect is refreshed at most ~8×/s instead of on every mousemove.
const RECT_REFRESH_MS = 120;

export function FollowerPointerCard({ children, title = "View Project", className = "" }: FollowerPointerCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const pointer = pointerRef.current;
      if (!container || !pointer) return;
      // Coarse pointers never hover; skip the listeners entirely on touch devices.
      if (window.matchMedia("(pointer: coarse)").matches) return;

      // Center the follower exactly on the mouse coordinates
      gsap.set(pointer, { xPercent: -50, yPercent: -50, scale: 0.8, opacity: 0 });

      // gsap.quickTo creates a highly optimized tween for mouse tracking
      const xTo = gsap.quickTo(pointer, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(pointer, "y", { duration: 0.4, ease: "power3.out" });

      let rect: DOMRect | null = null;
      let rectTime = 0;
      const measure = (now: number) => {
        rect = container.getBoundingClientRect();
        rectTime = now;
        return rect;
      };

      const onEnter = (e: MouseEvent) => {
        const r = measure(performance.now());
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
        // Pop in animation (driven straight from the DOM event, no React re-render)
        gsap.to(pointer, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)", overwrite: "auto" });
      };

      const onMove = (e: MouseEvent) => {
        const now = performance.now();
        const r = rect && now - rectTime < RECT_REFRESH_MS ? rect : measure(now);
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      };

      const onLeave = () => {
        rect = null;
        // Fade out animation
        gsap.to(pointer, { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
      };

      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mousemove", onMove, { passive: true });
      container.addEventListener("mouseleave", onLeave);

      return () => {
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mousemove", onMove);
        container.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: containerRef }
  );

  const hasPosition = className.includes("absolute") || className.includes("relative") || className.includes("fixed");
  const positionClass = hasPosition ? "" : "relative";

  return (
    <div
      ref={containerRef}
      // Hides the default cursor completely while hovering this container
      className={`${positionClass} cursor-none ${className}`}
    >
      {children}

      {/* ── THE FLOATING PILL BUTTON ── */}
      <div
        ref={pointerRef}
        className="absolute top-0 left-0 z-50 pointer-events-none"
        style={{ opacity: 0, transform: "scale(0.8)" }} // Initial hidden state
      >
        {/* Solid fill: at 95% opacity the backdrop blur was invisible but re-blurred
            the project image under the pill on every frame it moved. */}
        <div className="bg-[#f04e00] text-white px-6 py-3.5 rounded-full text-[11px] md:text-xs font-extrabold tracking-widest uppercase shadow-2xl border border-white/20 flex items-center justify-center gap-2 whitespace-nowrap">
          {title}
          <span className="text-sm md:text-base font-light leading-none">↗</span>
        </div>
      </div>
    </div>
  );
}
