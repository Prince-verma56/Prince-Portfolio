"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";

export default function HeroContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    // 1. Set initial hidden states immediately
    gsap.set(".mask-line", { y: "110%" });
    gsap.set([".h-desc", ".h-logos"], { opacity: 0, y: 20 });

    // 2. Build Timeline (PAUSED)
    const tl = gsap.timeline({ paused: true });

    // Staggered Mask Reveal for Heading
    tl.to(".mask-line", {
      y: "0%",
      duration: 1.2,
      stagger: 0.1,
      ease: "expo.out"
    });

    // Fade Up Bottom-Left Description
    tl.to(".h-desc", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.6");

    // Fade Up Abilities (Replaced Logos)
    tl.to(".h-logos", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8");

    tlRef.current = tl;
  }, { scope: rootRef, dependencies: [] });

  // 3. Play the timeline ONLY when the loader says it's done
  useEffect(() => {
    if (isLoaderFinished) {
      tlRef.current?.play();
    } else {
      tlRef.current?.progress(0).pause();
    }
  }, [isLoaderFinished]);

  return (
    // ── INVISIBLE OVERLAY ──
    <div
      ref={rootRef}
      className="absolute inset-0 z-10 w-full h-screen flex flex-col justify-end p-6 md:p-12 pb-12 md:pb-16 pointer-events-none select-none"
    >



      {/* ── EDITORIAL HEADING (Responsive Positioning) ── */}
      {/* Moved to top-[18%] on mobile to avoid overlapping the face, and adjusted text sizing */}
      <div className="absolute top-[18%] sm:top-[20%] left-6 text-left md:bottom-auto md:top-[30%] md:left-auto md:right-12 md:text-right z-20">
        <h2 className="text-4xl sm:text-5xl md:text-[clamp(4rem,7vw,7rem)] font-black leading-[0.95] md:leading-[1.05] tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:drop-shadow-none">
          <div className="overflow-hidden pb-1"><span className="mask-line block translate-y-[110%]">Build</span></div>
          <div className="overflow-hidden pb-1"><span className="mask-line block translate-y-[110%]">Create</span></div>
          <div className="overflow-hidden pb-1"><span className="mask-line block text-white/50 translate-y-[110%]">Automate</span></div>
          <div className="overflow-hidden pb-1"><span className="mask-line block translate-y-[110%] text-[#f04e00] md:text-white">Scale</span></div>
        </h2>
      </div>

      {/* ── BOTTOM LEFT: DESCRIPTION & ABILITIES ── */}
      {/* Ensure it is layered properly and has a clean layout */}
      <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[90%] sm:max-w-[400px] md:max-w-[480px] z-20 relative">

        {/* Description */}
        <p className="h-desc text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed tracking-wide opacity-0 translate-y-5 drop-shadow-md">
          I transform ambitious ideas into intelligent products,
          <br className="hidden sm:block" /> combining cutting-edge development, immersive design, <span className="text-white/50 italic font-light"> and AI-driven innovation to create experiences that stand out.</span>
        </p>

        {/* Highlighted Abilities (Replaced Logos) */}
        {/* Fixed Flex-Wrap to prevent awkward text breaking on small screens */}
        <div className="h-logos flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mt-2 md:mt-0 opacity-0 translate-y-5">
          <span className="text-[10px] md:text-[11px] text-[#f04e00] uppercase tracking-[0.2em] font-mono font-bold shrink-0">
            Abilities:
          </span>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/90">
            <span className="font-bold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase whitespace-nowrap">3D Web</span>
            <span className="text-white/30 text-[8px] sm:text-[10px]">●</span>
            <span className="font-bold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase whitespace-nowrap">AI Solutions</span>
            <span className="text-white/30 text-[8px] sm:text-[10px]">●</span>
            <span className="font-bold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase whitespace-nowrap">Full Stack</span>
            <span className="text-white/30 text-[8px] sm:text-[10px]">●</span>
            <span className="font-bold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase whitespace-nowrap">Agentic Systems</span>
          </div>
        </div>

      </div>

    </div>
  );
}

// 3D Web ● AI Solutions ● Full Stack ● Agentic Systems