"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";

const abilities = [
  {
    name: "3D Web",
    icon: (
      <svg className="w-4 h-4 text-[#f04e00] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.16 8.37-9-5a1.71 1.71 0 0 0-1.68 0l-9 5a1.73 1.73 0 0 0-1 1.54v10a1.73 1.73 0 0 0 1 1.54l9 5a1.71 1.71 0 0 0 1.68 0l9-5a1.73 1.73 0 0 0 1-1.54V9.91a1.73 1.73 0 0 0-1-1.54Z" />
        <path d="m12 22v-8m0 0 8-4.5M12 14l-8-4.5" />
      </svg>
    )
  },
  {
    name: "AI Solutions",
    icon: (
      <svg className="w-4 h-4 text-[#f04e00] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    )
  },
  {
    name: "Full Stack",
    icon: (
      <svg className="w-4 h-4 text-[#f04e00] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 17 10 5 10-5M2 12l10 5 10-5M12 2 2 7l10 5 10-5Z" />
      </svg>
    )
  },
  {
    name: "Agentic Systems",
    icon: (
      <svg className="w-4 h-4 text-[#f04e00] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="12" x="3" y="8" rx="2" />
        <path d="M9 14h.01M15 14h.01M12 6V2M10 2h4" />
      </svg>
    )
  }
];

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
      <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[95%] sm:max-w-[420px] md:max-w-[500px] z-20 relative">

        {/* Description */}
        <p className="h-desc text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed tracking-wide opacity-0 translate-y-5 drop-shadow-md">
        Every great product begins as an idea.
          <br className="hidden sm:block" />What makes the difference is the care, <span className="text-white/50 italic font-light"> craft, and intention behind bringing it to life.</span>
        </p>

        {/* Highlighted Abilities Marquee */}
        <div className="h-logos flex flex-row items-center gap-4 mt-2 md:mt-0 opacity-0 translate-y-5 w-full overflow-hidden">
          <span className="text-[10px] md:text-[11px] text-[#f04e00] uppercase tracking-[0.2em] font-mono font-bold shrink-0">
            Abilities:
          </span>

          {/* Marquee viewport with left/right fade masks */}
          <div 
            className="relative flex-1 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)'
            }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes marquee-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee-left-track {
                display: flex;
                width: max-content;
                animation: marquee-left 25s linear infinite;
              }
              .animate-marquee-left-track:hover {
                animation-play-state: paused;
              }
            `}} />

            <div className="animate-marquee-left-track flex items-center">
              {/* Loop 1 */}
              <div className="flex items-center gap-10 pr-10 shrink-0">
                {abilities.map((ability, idx) => (
                  <div key={`set1-${idx}`} className="flex items-center gap-2.5 text-white/60 hover:text-white group/item cursor-default transition-all duration-300">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      {ability.icon}
                    </div>
                    <span className="font-bold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase whitespace-nowrap">
                      {ability.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Loop 2 */}
              <div className="flex items-center gap-10 pr-10 shrink-0">
                {abilities.map((ability, idx) => (
                  <div key={`set2-${idx}`} className="flex items-center gap-2.5 text-white/60 hover:text-white group/item cursor-default transition-all duration-300">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      {ability.icon}
                    </div>
                    <span className="font-bold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase whitespace-nowrap">
                      {ability.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

// 3D Web ● AI Solutions ● Full Stack ● Agentic Systems