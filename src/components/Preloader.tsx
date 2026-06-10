"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

gsap.registerPlugin();

// Explicit initial coordinate pairs from your brand specification
const letterSpecs = [
  { char: "P", x: -350, y: 0, rotate: -8 },
  { char: "R", x: 220, y: -180, rotate: 6 },
  { char: "I", x: 0, y: -250, rotate: -5 },
  { char: "N", x: -220, y: 180, rotate: 10 },
  { char: "C", x: 300, y: 0, rotate: -12 },
  { char: "E", x: 0, y: 250, rotate: 4 },
];

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordWrapperRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const trademarkRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const { setIsLoaderFinished } = useLoader();

  useGSAP(() => {
    // 1. HARD RESET AND IMMEDIATE STATE PROTECTION (PREVENTS FLASH OF FULL TEXT)
    setIsLoaderFinished(false);
    gsap.set(containerRef.current, { yPercent: 0, display: "flex" });
    gsap.set(percentRef.current, { opacity: 1, y: 0 });
    gsap.set(trademarkRef.current, { opacity: 0, scale: 0.5 });
    if (percentRef.current) percentRef.current.textContent = "0%";

    const progress = { value: 0 };
    
    // Create an elegant, longer, cinematic timeline with a small delay for hydration recovery
    const tl = gsap.timeline({
      delay: 0.15,
      onComplete: () => {
        setIsLoaderFinished(true);
        gsap.set(containerRef.current, { display: "none" });
      },
    });

    // ── PHASE 1: LETTER DISCOVERY (Slightly slower, 0.5s duration) ──
    tl.to(".loader-letter", {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    // ── PHASE 5: PROGRESS COUNTER (Lengthened to 2.2s for high-end feel) ──
    tl.to(progress, {
      value: 100,
      duration: 2.2,
      ease: "power3.out",
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.textContent = Math.round(progress.value) + "%";
        }
      },
    }, 0);

    // ── PHASE 2: LETTER ASSEMBLY (Increased duration to 1.4s & smooth expo ease) ──
    tl.to(".loader-letter", {
      x: 0,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
      scale: 1,
      duration: 1.4,
      stagger: 0.06,
      ease: "expo.out",
    }, 0.4); // Starts smoothly mid-discovery

    // ── PHASE 3: ALIGNMENT SNAP (Smooth premium cushion overshoot) ──
    // Formed word finishes grouping around 2.15s - 2.2s mark
    tl.to(wordWrapperRef.current, {
      scale: 1.06,
      duration: 0.15,
      ease: "power2.out",
    }, 2.15)
    .to(wordWrapperRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "back.out(1.5)",
    })
    // Trademark symbol floats in elegantly
    .to(trademarkRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
    }, 2.15);

    // ── PHASE 4: BRAND ENERGY PULSE (Cinematic aura via high-performance text-shadow) ──
    tl.to(wordWrapperRef.current, {
      textShadow: "0 0 35px rgba(0,0,0,0.35)",
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    }, 2.4);

    // ── PHASE 6: PANEL EXIT (Perfect micro-pause after hits 100%) ──
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut",
    }, 2.65);

  }, { scope: containerRef, dependencies: [pathname] });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#f04e00] flex flex-col items-center justify-center text-black select-none"
      style={{ willChange: "transform" }}
    >
      <div className="flex flex-col items-center justify-center">
        
        {/* Main Branding Block */}
        <div className="overflow-visible flex items-start leading-none pb-2">
          <h1 
            ref={wordWrapperRef} 
            className="text-[clamp(3.5rem,10vw,7rem)] font-black uppercase tracking-tighter flex items-center leading-none select-none will-change-transform"
          >
            {letterSpecs.map((spec, index) => (
              <span
                key={index}
                // Inline styles ensure layout-stable state is rendered on server and client before hydration
                style={{
                  opacity: 0,
                  transform: `translate3d(${spec.x}px, ${spec.y}px, 0) scale(0.65) rotate(${spec.rotate}deg)`,
                  filter: "blur(16px)",
                  display: "inline-block",
                  willChange: "transform, opacity",
                }}
                className={`loader-letter letter-${index}`}
              >
                {spec.char}
              </span>
            ))}
          </h1>
          
          <span 
            ref={trademarkRef} 
            className="text-[clamp(12px,2.5vw,1.75rem)] font-bold mt-2 ml-1 opacity-0 pointer-events-none select-none will-change-transform"
          >
            ®
          </span>
        </div>

        {/* Centered Percentage Progress */}
        <div 
          ref={percentRef} 
          className="mt-6 text-sm md:text-base font-mono font-bold tracking-[0.2em] opacity-80"
        >
          0%
        </div>

      </div>
    </div>
  );
}