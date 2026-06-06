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
      <div className="absolute bottom-[30%] left-6 text-left md:bottom-auto md:top-[30%] md:left-auto md:right-12 md:text-right">
        <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-bold leading-[1.05] tracking-tight text-white/90">
          <div className="overflow-hidden pb-1"><span className="mask-line block translate-y-[110%]">Beyond</span></div>
          <div className="overflow-hidden pb-1"><span className="mask-line block translate-y-[110%]">Visuals.</span></div>
          <div className="overflow-hidden pb-1"><span className="mask-line block text-white/50 translate-y-[110%]">Built with</span></div>
          <div className="overflow-hidden pb-1"><span className="mask-line block translate-y-[110%]">Vision.</span></div>
        </h2>
      </div>

      {/* ── BOTTOM LEFT: DESCRIPTION & ABILITIES ── */}
      <div className="flex flex-col gap-6 md:gap-10 max-w-[320px] md:max-w-[480px]">
        
        {/* Description */}
        <p className="h-desc text-white/80 text-sm md:text-lg font-medium leading-relaxed tracking-wide opacity-0 translate-y-5">
          We build brands, websites, <br className="hidden md:block" />and digital experiences <span className="text-white/40 italic font-light">with intention, clarity and care.</span>
        </p>

        {/* Highlighted Abilities (Replaced Logos) */}
        <div className="h-logos flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mt-2 md:mt-0 opacity-0 translate-y-5">
          <span className="text-[10px] md:text-[11px] text-[#f04e00] uppercase tracking-[0.2em] font-mono font-bold">
            I Create:
          </span>
          
          <div className="flex items-center gap-3 md:gap-4 text-white/90">
            <span className="font-bold tracking-widest text-xs md:text-sm uppercase">Apps</span>
            <span className="text-white/30 text-[10px]">●</span>
            <span className="font-bold tracking-widest text-xs md:text-sm uppercase">Websites</span>
            <span className="text-white/30 text-[10px]">●</span>
            <span className="font-bold tracking-widest text-xs md:text-sm uppercase">Design</span>
          </div>
        </div>

      </div>

    </div>
  );
}