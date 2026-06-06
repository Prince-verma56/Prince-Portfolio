"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface FollowerPointerCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function FollowerPointerCard({ children, title = "View Project", className = "" }: FollowerPointerCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !pointerRef.current) return;

    // Center the follower exactly on the mouse coordinates
    gsap.set(pointerRef.current, { xPercent: -50, yPercent: -50 });

    // gsap.quickTo creates a highly optimized tween for mouse tracking
    const xTo = gsap.quickTo(pointerRef.current, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(pointerRef.current, "y", { duration: 0.4, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      xTo(x);
      yTo(y);
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isHovered) {
      // Pop in animation
      gsap.to(pointerRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)", overwrite: "auto" });
    } else {
      // Fade out animation
      gsap.to(pointerRef.current, { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
    }
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Hides the default cursor completely while hovering this container
      className={`relative cursor-none ${className}`}
    >
      {children}
      
      {/* ── THE FLOATING PILL BUTTON ── */}
      <div
        ref={pointerRef}
        className="absolute top-0 left-0 z-50 pointer-events-none"
        style={{ opacity: 0, transform: "scale(0.8)" }} // Initial hidden state
      >
        <div className="bg-[#f04e00]/95 backdrop-blur-md text-white px-6 py-3.5 rounded-full text-[11px] md:text-xs font-extrabold tracking-widest uppercase shadow-2xl border border-white/20 flex items-center justify-center gap-2 whitespace-nowrap">
          {title}
          <span className="text-sm md:text-base font-light leading-none">↗</span>
        </div>
      </div>
    </div>
  );
}